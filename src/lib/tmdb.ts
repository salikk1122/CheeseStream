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

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

type MediaType = 'movie' | 'tv';

function buildAuth(url: URL): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };

  // Prefer v4 read access token (Bearer auth)
  const readToken =
    process.env.API_READ_ACCESS_TOKEN ??
    process.env.TMDB_READ_ACCESS_TOKEN;

  if (readToken) {
    return { ...headers, Authorization: `Bearer ${readToken}` };
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error(
      'TMDB credentials not set. Add API_READ_ACCESS_TOKEN or TMDB_API_KEY to .env.local'
    );
  }

  // JWT-shaped value stored in TMDB_API_KEY → treat as Bearer token
  if (apiKey.startsWith('eyJ')) {
    return { ...headers, Authorization: `Bearer ${apiKey}` };
  }

  // v3 API key → query-string auth
  url.searchParams.set('api_key', apiKey);
  return headers;
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

  const response = await fetch(url.toString(), {
    headers,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB API error: ${response.status} ${response.statusText}. ` +
        'Check API_READ_ACCESS_TOKEN or TMDB_API_KEY in .env.local.'
    );
  }

  return response.json() as Promise<T>;
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

/** Pick the best YouTube trailer from TMDB video results */
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
