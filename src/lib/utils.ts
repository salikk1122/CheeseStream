export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
} as const;

export const BACKDROP_SIZES = {
  small: 'w780',
  medium: 'w1280',
  original: 'original',
} as const;

export const PROFILE_SIZES = {
  small: 'w185',
  medium: 'w342',
} as const;

export function getImageUrl(
  path: string | null | undefined,
  size: string = POSTER_SIZES.large
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getYear(dateString?: string | null): string {
  if (!dateString) return '';
  return dateString.split('-')[0] ?? '';
}

export function formatRuntime(minutes?: number | null): string {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export function formatCurrency(amount?: number | null): string {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function getMediaTitle(item: {
  title?: string;
  name?: string;
}): string {
  return item.title ?? item.name ?? 'Unknown';
}

export function getMediaType(item: {
  media_type?: string;
  title?: string;
  name?: string;
}): 'movie' | 'tv' {
  if (item.media_type === 'movie' || item.media_type === 'tv') {
    return item.media_type;
  }
  return item.title ? 'movie' : 'tv';
}

export function getMediaHref(
  item: { id: number; media_type?: string; title?: string; name?: string }
): string {
  const type = getMediaType(item);
  return `/title/${type}/${item.id}`;
}

export function getWatchHref(
  item: { id: number; media_type?: string; title?: string; name?: string }
): string {
  const type = getMediaType(item);
  return `/watch/${type}/${item.id}`;
}

/** Common TMDB genre IDs (movie + TV) for list/hero metadata */
const GENRE_NAMES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

export function getGenreName(id: number): string | undefined {
  return GENRE_NAMES[id];
}

export function getPrimaryGenreName(genreIds?: number[]): string | undefined {
  if (!genreIds?.length) return undefined;
  for (const id of genreIds) {
    const name = getGenreName(id);
    if (name) return name;
  }
  return undefined;
}
