export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import ContentUnavailable from '@/components/ContentUnavailable';
import SearchBar from '@/components/SearchBar';
import MediaGrid from '@/components/MediaGrid';
import { isTmdbNetworkError, searchMulti } from '@/lib/tmdb';
import type { PaginatedResponse, SearchResult } from '@/types';

interface PageProps {
  searchParams: { q?: string; page?: string };
}

export const metadata: Metadata = {
  title: 'Search',
};

const emptyResults: PaginatedResponse<SearchResult> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export default async function SearchPage({ searchParams }: PageProps) {
  const query = searchParams.q ?? '';
  const page = Number(searchParams.page) || 1;

  let results = emptyResults;
  let loadFailed = false;

  if (query) {
    try {
      results = await searchMulti(query, page);
    } catch (error) {
      if (!isTmdbNetworkError(error)) throw error;
      loadFailed = true;
    }
  }

  const mediaResults = results.results.filter(
    (item): item is typeof item & { media_type: 'movie' | 'tv' } =>
      item.media_type === 'movie' || item.media_type === 'tv'
  );

  return (
    <div className="min-h-screen px-4 pb-24 pt-20 sm:pt-24 md:px-8 md:pb-12 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 font-display text-2xl tracking-wide text-white sm:mb-6 sm:text-3xl md:text-4xl">
          Search
        </h1>
        <Suspense fallback={null}>
          <SearchBar defaultValue={query} className="mb-6 sm:mb-8" />
        </Suspense>
      </div>

      {loadFailed && <ContentUnavailable />}

      {query && !loadFailed && (
        <div className="mx-auto max-w-[1920px]">
          <p className="mb-4 text-sm text-muted sm:mb-6">
            {mediaResults.length > 0
              ? `Found ${results.total_results} results for "${query}"`
              : `No results found for "${query}"`}
          </p>

          <MediaGrid items={mediaResults} />

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
        <p className="text-center text-sm text-muted">
          Search for your favorite movies and TV shows.
        </p>
      )}
    </div>
  );
}
