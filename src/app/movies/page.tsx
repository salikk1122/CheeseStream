export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import ContentUnavailable from '@/components/ContentUnavailable';
import GenreFilterBar from '@/components/GenreFilterBar';
import MediaGrid from '@/components/MediaGrid';
import { getDiscover, getGenres, isTmdbNetworkError } from '@/lib/tmdb';
import type { Genre, PaginatedResponse, MediaItem } from '@/types';

export const metadata: Metadata = {
  title: 'Movies',
};

interface PageProps {
  searchParams: { genre?: string; page?: string };
}

const emptyDiscover: PaginatedResponse<MediaItem> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export default async function MoviesPage({ searchParams }: PageProps) {
  const genreId = searchParams.genre
    ? Number(searchParams.genre)
    : undefined;
  const page = Number(searchParams.page) || 1;

  let genres: { genres: Genre[] } = { genres: [] };
  let discover = emptyDiscover;
  let loadFailed = false;

  try {
    [genres, discover] = await Promise.all([
      getGenres('movie'),
      getDiscover('movie', { genreId, page }),
    ]);
  } catch (error) {
    if (!isTmdbNetworkError(error)) throw error;
    loadFailed = true;
  }

  const activeGenre = genres.genres.find((g) => g.id === genreId);

  return (
    <div className="min-h-screen pb-24 pt-20 sm:pt-24 md:pb-12">
      <div className="px-4 md:px-8 lg:px-12">
        <h1 className="mb-2 font-display text-2xl tracking-wide text-white sm:text-3xl md:text-4xl">
          Movies
        </h1>
        {activeGenre && (
          <p className="mb-4 text-sm text-muted">Genre: {activeGenre.name}</p>
        )}
      </div>

      {loadFailed ? (
        <ContentUnavailable />
      ) : (
        <>
          <Suspense fallback={null}>
            <GenreFilterBar genres={genres.genres} basePath="/movies" />
          </Suspense>

          <div className="px-4 md:px-8 lg:px-12">
            <MediaGrid
              items={discover.results.map((item) => ({
                ...item,
                title: item.title ?? '',
                media_type: 'movie' as const,
              }))}
            />
          </div>

          {discover.total_pages > 1 && page < discover.total_pages && (
            <div className="mt-8 text-center">
              <a
                href={`/movies?${genreId ? `genre=${genreId}&` : ''}page=${page + 1}`}
                className="btn-secondary inline-flex"
              >
                Load More
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
