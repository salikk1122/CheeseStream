export const dynamic = 'force-dynamic';

import CarouselRow from '@/components/CarouselRow';
import Hero from '@/components/Hero';
import {
  getDiscover,
  getNowPlaying,
  getTopRated,
  getTrending,
} from '@/lib/tmdb';
import type { MediaItem, PaginatedResponse } from '@/types';

const emptyPage: PaginatedResponse<MediaItem> = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

function settled<T>(result: PromiseSettledResult<T>, fallback: T): T {
  if (result.status === 'fulfilled') return result.value;
  console.error('[CheeseStream] TMDB request failed:', result.reason);
  return fallback;
}

export default async function HomePage() {
  // Fetch in smaller batches to avoid connection failures on some networks
  const batch1 = await Promise.allSettled([
    getTrending('movie', 'week'),
    getTrending('tv', 'week'),
  ]);
  const batch2 = await Promise.allSettled([
    getDiscover('movie'),
    getNowPlaying(),
  ]);
  const batch3 = await Promise.allSettled([
    getTopRated('movie'),
    getTopRated('tv'),
  ]);

  const results = [...batch1, ...batch2, ...batch3];

  const trendingMovies = settled(results[0], emptyPage);
  const trendingTV = settled(results[1], emptyPage);
  const popularMovies = settled(results[2], emptyPage);
  const newReleases = settled(results[3], emptyPage);
  const topRatedMovies = settled(results[4], emptyPage);
  const topRatedTV = settled(results[5], emptyPage);

  const heroItems = [
    ...trendingMovies.results.slice(0, 3),
    ...trendingTV.results.slice(0, 2),
  ];

  const hasAnyContent =
    heroItems.length > 0 ||
    trendingMovies.results.length > 0 ||
    trendingTV.results.length > 0;

  return (
    <>
      {heroItems.length > 0 ? (
        <Hero items={heroItems} />
      ) : (
        <section className="flex h-[60vh] min-h-[420px] items-end px-4 pb-16 md:px-8 lg:px-12">
          <div className="max-w-xl space-y-3">
            <h1 className="font-display text-5xl tracking-wide text-white md:text-7xl">
              CheeseStream
            </h1>
            <p className="text-muted">
              {hasAnyContent
                ? 'Loading featured titles…'
                : 'Could not load titles from TMDB right now. Check your connection and API keys, then refresh.'}
            </p>
          </div>
        </section>
      )}

      <section className="relative bg-background pb-10 pt-6 sm:pt-8 md:pb-12 md:pt-10">
        <div className="space-y-1 sm:space-y-2 md:space-y-3">
          <CarouselRow
            title="Trending Movies"
            items={trendingMovies.results}
            viewAllHref="/movies"
            leading
          />
        <CarouselRow
          title="Trending Series"
          items={trendingTV.results}
          viewAllHref="/shows"
        />
        <CarouselRow
          title="Popular on CheeseStream"
          items={popularMovies.results}
        />
        <CarouselRow title="New Releases" items={newReleases.results} />
        <CarouselRow
          title="Top Rated Movies"
          items={topRatedMovies.results.slice(0, 15)}
        />
        <CarouselRow
          title="Top Rated Series"
          items={topRatedTV.results.slice(0, 15)}
        />
        </div>
      </section>
    </>
  );
}
