export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import GenreFilterBar from '@/components/GenreFilterBar';
import PosterCard from '@/components/PosterCard';
import { getDiscover, getGenres } from '@/lib/tmdb';

export const metadata: Metadata = {
  title: 'TV Shows',
};

interface PageProps {
  searchParams: { genre?: string; page?: string };
}

export default async function ShowsPage({ searchParams }: PageProps) {
  const genreId = searchParams.genre
    ? Number(searchParams.genre)
    : undefined;
  const page = Number(searchParams.page) || 1;

  const [genres, discover] = await Promise.all([
    getGenres('tv'),
    getDiscover('tv', { genreId, page }),
  ]);

  const activeGenre = genres.genres.find((g) => g.id === genreId);

  return (
    <div className="min-h-screen pb-12 pt-24">
      <div className="px-4 md:px-8 lg:px-12">
        <h1 className="mb-2 font-display text-3xl tracking-wide text-white md:text-4xl">
          TV Shows
        </h1>
        {activeGenre && (
          <p className="mb-4 text-muted">Genre: {activeGenre.name}</p>
        )}
      </div>

      <Suspense fallback={null}>
        <GenreFilterBar genres={genres.genres} basePath="/shows" />
      </Suspense>

      <div className="flex flex-wrap gap-4 px-4 md:px-8 lg:px-12">
        {discover.results.map((item) => (
          <PosterCard key={item.id} item={{ ...item, name: item.name ?? '' }} />
        ))}
      </div>

      {discover.total_pages > 1 && page < discover.total_pages && (
        <div className="mt-8 text-center">
          <a
            href={`/shows?${genreId ? `genre=${genreId}&` : ''}page=${page + 1}`}
            className="btn-secondary inline-flex"
          >
            Load More
          </a>
        </div>
      )}
    </div>
  );
}
