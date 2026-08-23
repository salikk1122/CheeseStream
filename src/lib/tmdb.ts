import dns from 'node:dns';
import https from 'node:https';
import 'server-only';
import type {
  CastMember,
  Credits,
  GenreListResponse,
  MediaDetails,
  MediaItem,
  Movie,
  PaginatedResponse,
  SearchResult,
  TVShow,
  Video,
  VideosResponse,
} from '@/types';

// Prefer IPv4 — avoids intermittent "fetch failed" when IPv6 routes are broken
dns.setDefaultResultOrder('ipv4first');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 20000;

const httpsAgent = new https.Agent({ keepAlive: true, family: 4 });

const isNodeServer =
  typeof process !== 'undefined' && Boolean(process.versions?.node);

type MediaType = 'movie' | 'tv';

export class TmdbError extends Error {
  constructor(
    message: string,
    public readonly code: 'network' | 'auth' | 'http' | 'config'
  ) {
    super(message);
    this.name = 'TmdbError';
  }
}

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function buildAuth(url: URL): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const readToken =
    getEnv('API_READ_ACCESS_TOKEN') ?? getEnv('TMDB_READ_ACCESS_TOKEN');

  if (readToken) {
    return { ...headers, Authorization: `Bearer ${readToken}` };
  }

  const apiKey = getEnv('TMDB_API_KEY');
  if (!apiKey) {
    throw new TmdbError(
      'TMDB credentials not set. Add API_READ_ACCESS_TOKEN or TMDB_API_KEY to .env.local.',
      'config'
    );
  }

  if (apiKey.startsWith('eyJ')) {
    return { ...headers, Authorization: `Bearer ${apiKey}` };
  }

  url.searchParams.set('api_key', apiKey);
  return headers;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function headersToRecord(headers: HeadersInit): Record<string, string> {
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers as Record<string, string>;
}

/** Node https fallback when global fetch fails (common on Windows dev) */
function httpsRequest(
  url: string,
  headers: Record<string, string>
): Promise<{ status: number; statusText: string; body: string }> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      { method: 'GET', headers, agent: httpsAgent, family: 4 },
      (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({
            status: res.statusCode ?? 0,
            statusText: res.statusMessage ?? '',
            body,
          });
        });
      }
    );

    req.on('error', reject);
    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy(new Error('Request timeout'));
    });
    req.end();
  });
}

async function performRequest(
  url: string,
  headers: HeadersInit
): Promise<{ status: number; statusText: string; body: string }> {
  const headerRecord = headersToRecord(headers);
  const isDev = process.env.NODE_ENV === 'development';

  const fetchRequest = async () => {
    const response = await fetch(url, {
      headers,
      ...(isDev ? { cache: 'no-store' as const } : { next: { revalidate: 3600 } }),
    });

    return {
      status: response.status,
      statusText: response.statusText,
      body: await response.text(),
    };
  };

  // Node's native https is more reliable than undici fetch on Windows dev
  if (isNodeServer) {
    try {
      return await httpsRequest(url, headerRecord);
    } catch (httpsError) {
      try {
        return await fetchRequest();
      } catch (fetchError) {
        const httpsMsg =
          httpsError instanceof Error ? httpsError.message : String(httpsError);
        const fetchMsg =
          fetchError instanceof Error ? fetchError.message : String(fetchError);
        throw new Error(`https failed (${httpsMsg}); fetch failed (${fetchMsg})`);
      }
    }
  }

  try {
    return await fetchRequest();
  } catch (fetchError) {
    try {
      return await httpsRequest(url, headerRecord);
    } catch (httpsError) {
      const fetchMsg =
        fetchError instanceof Error ? fetchError.message : String(fetchError);
      const httpsMsg =
        httpsError instanceof Error ? httpsError.message : String(httpsError);
      throw new Error(`fetch failed (${fetchMsg}); https failed (${httpsMsg})`);
    }
  }
}

async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const headers = buildAuth(url);
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { status, statusText, body } = await performRequest(
        url.toString(),
        headers
      );

      if (status === 401 || status === 403) {
        throw new TmdbError(
          `TMDB auth error (${status}). Check API_READ_ACCESS_TOKEN or TMDB_API_KEY in .env.local.`,
          'auth'
        );
      }

      if (status < 200 || status >= 300) {
        throw new TmdbError(
          `TMDB API error: ${status} ${statusText}`,
          'http'
        );
      }

      return JSON.parse(body) as T;
    } catch (error) {
      lastError = error;
      if (error instanceof TmdbError && error.code !== 'network') {
        throw error;
      }
      if (attempt < MAX_ATTEMPTS) {
        await sleep(400 * attempt);
      }
    }
  }

  const detail =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new TmdbError(
    `Could not reach TMDB after ${MAX_ATTEMPTS} attempts (${detail}). Check your connection or try again shortly.`,
    'network'
  );
}

export function isTmdbNetworkError(error: unknown): boolean {
  return error instanceof TmdbError && error.code === 'network';
}

export async function getTrending(
  mediaType: MediaType,
  timeWindow: 'day' | 'week' = 'week'
): Promise<PaginatedResponse<MediaItem>> {
  return tmdbFetch<PaginatedResponse<MediaItem>>(
    `/trending/${mediaType}/${timeWindow}`
  );
}

export async function getPopular(
  mediaType: MediaType,
  page = 1
): Promise<PaginatedResponse<MediaItem>> {
  return tmdbFetch<PaginatedResponse<MediaItem>>(`/${mediaType}/popular`, {
    page,
  });
}

export async function getTopRated(
  mediaType: MediaType,
  page = 1
): Promise<PaginatedResponse<MediaItem>> {
  return tmdbFetch<PaginatedResponse<MediaItem>>(`/${mediaType}/top_rated`, {
    page,
  });
}

export async function getNowPlaying(
  page = 1
): Promise<PaginatedResponse<Movie>> {
  return tmdbFetch<PaginatedResponse<Movie>>('/movie/now_playing', { page });
}

export async function getOnTheAir(page = 1): Promise<PaginatedResponse<TVShow>> {
  return tmdbFetch<PaginatedResponse<TVShow>>('/tv/on_the_air', { page });
}

export async function getDiscover(
  mediaType: MediaType,
  options: { genreId?: number; page?: number } = {}
): Promise<PaginatedResponse<MediaItem>> {
  const { genreId, page = 1 } = options;
  return tmdbFetch<PaginatedResponse<MediaItem>>(`/discover/${mediaType}`, {
    page,
    ...(genreId ? { with_genres: genreId } : {}),
    sort_by: 'popularity.desc',
  });
}

export async function getDetails(
  mediaType: MediaType,
  id: string | number
): Promise<MediaDetails> {
  return tmdbFetch<MediaDetails>(`/${mediaType}/${id}`, {
    append_to_response: 'credits,videos,similar,recommendations',
  });
}

export async function getCredits(
  mediaType: MediaType,
  id: string | number
): Promise<Credits> {
  return tmdbFetch<Credits>(`/${mediaType}/${id}/credits`);
}

export async function getVideos(
  mediaType: MediaType,
  id: string | number
): Promise<VideosResponse> {
  return tmdbFetch<VideosResponse>(`/${mediaType}/${id}/videos`);
}

export async function getSimilar(
  mediaType: MediaType,
  id: string | number,
  page = 1
): Promise<PaginatedResponse<MediaItem>> {
  return tmdbFetch<PaginatedResponse<MediaItem>>(
    `/${mediaType}/${id}/similar`,
    { page }
  );
}

export async function getRecommendations(
  mediaType: MediaType,
  id: string | number,
  page = 1
): Promise<PaginatedResponse<MediaItem>> {
  return tmdbFetch<PaginatedResponse<MediaItem>>(
    `/${mediaType}/${id}/recommendations`,
    { page }
  );
}

export async function searchMulti(
  query: string,
  page = 1
): Promise<PaginatedResponse<SearchResult>> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return tmdbFetch<PaginatedResponse<SearchResult>>('/search/multi', {
    query: query.trim(),
    page,
    include_adult: 'false',
  });
}

export async function getGenres(
  mediaType: MediaType
): Promise<GenreListResponse> {
  return tmdbFetch<GenreListResponse>(`/genre/${mediaType}/list`);
}

export function findTrailer(videos: Video[]): Video | null {
  const youtubeVideos = videos.filter((v) => v.site === 'YouTube');

  const trailer =
    youtubeVideos.find((v) => v.type === 'Trailer' && v.official) ??
    youtubeVideos.find((v) => v.type === 'Trailer') ??
    youtubeVideos.find((v) => v.type === 'Teaser') ??
    youtubeVideos[0] ??
    null;

  return trailer;
}

export type { CastMember, MediaItem, MediaDetails, Video };
