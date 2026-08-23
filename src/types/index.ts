export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: Genre[];
  media_type?: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  adult?: boolean;
}

export interface Movie extends MediaItem {
  title: string;
  release_date: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  status?: string;
  tagline?: string;
  original_language?: string;
  imdb_id?: string;
}

export interface TVShow extends MediaItem {
  name: string;
  first_air_date: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  status?: string;
  tagline?: string;
  original_language?: string;
  last_air_date?: string;
}

export type MediaDetails = Movie | TVShow;

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface GenreListResponse {
  genres: Genre[];
}

export interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  vote_average: number;
  addedAt: number;
}

export interface SearchResult extends Omit<MediaItem, 'media_type'> {
  media_type: 'movie' | 'tv' | 'person';
}

export function isMovie(details: MediaDetails): details is Movie {
  return 'title' in details && details.title !== undefined;
}

export function isTVShow(details: MediaDetails): details is TVShow {
  return 'name' in details && details.name !== undefined;
}

export function getDetailsTitle(details: MediaDetails): string {
  return isMovie(details) ? details.title : details.name;
}

export function getDetailsDate(details: MediaDetails): string {
  return isMovie(details) ? details.release_date : details.first_air_date;
}

export function getDetailsRuntime(details: MediaDetails): string {
  if (isMovie(details)) {
    return formatRuntime(details.runtime);
  }
  const seasons = details.number_of_seasons;
  if (seasons) {
    return `${seasons} Season${seasons > 1 ? 's' : ''}`;
  }
  return 'N/A';
}

function formatRuntime(minutes?: number | null): string {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}
