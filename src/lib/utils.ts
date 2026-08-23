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
