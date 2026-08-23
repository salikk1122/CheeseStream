export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchBar from '@/components/SearchBar';
import PosterCard from '@/components/PosterCard';
import { searchMulti } from '@/lib/tmdb';

interface PageProps {
  searchParams: { q?: string; page?: string };
}

export const metadata: Metadata = {
  title: 'Search',
};

export default async function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q ?? '';
  const page = Number(searchParams.page) || 1;

  const results = query
    ? await searchMulti(query, page)
    : { results: [], total_results: 0, total_pages: 0, page: 1 };

  // Filter to movies and TV only
  const mediaResults = results.results.filter(
    (item): item is typeof item & { media_type: 'movie' | 'tv' } =>
      item.media_type === 'movie' || item.media_type === 'tv'
  );

  return (
    <div className="min-h-screen px-4 pb-12 pt-24 md:px-8 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 font-display text-3xl tracking-wide text-white md:text-4xl">
          Search
        </h1>
        <Suspense fallback={null}>
          <SearchBar defaultValue={query} className="mb-8" />
        </Suspense>
      </div>

      {query && (
        <div className="mx-auto max-w-[1920px]">
          <p className="mb-6 text-muted">
            {mediaResults.length > 0
              ? `Found ${results.total_results} results for "${query}"`
              : `No results found for "${query}"`}
          </p>

          <div className="flex flex-wrap gap-4">
            {mediaResults.map((item) => (
              <PosterCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>

          {results.total_pages > 1 && page < results.total_pages && (
            <div className="mt-8 text-center">
              <a
                href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                className="btn-secondary"
              >
                Load More
              </a>
            </div>
          )}
        </div>
      )}

      {!query && (
        <p className="text-center text-muted">
          Search for your favorite movies and TV shows.
        </p>
      )}
    </div>
  );
}
