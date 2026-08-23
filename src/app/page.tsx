export const dynamic = 'force-dynamic';

import CarouselRow from '@/components/CarouselRow';
import Hero from '@/components/Hero';
import {
  getDiscover,
  getNowPlaying,
  getPopular,
  getTopRated,
  getTrending,
} from '@/lib/tmdb';

export default async function HomePage() {
  const [
    trendingMovies,
    trendingTV,
    popularMovies,
    newReleases,
    topRatedMovies,
    topRatedTV,
  ] = await Promise.all([
    getTrending('movie', 'week'),
    getTrending('tv', 'week'),
    getDiscover('movie'),
    getNowPlaying(),
    getTopRated('movie'),
    getTopRated('tv'),
  ]);

  // Hero uses top trending movies + TV mixed
  const heroItems = [
    ...trendingMovies.results.slice(0, 3),
    ...trendingTV.results.slice(0, 2),
  ];

  return (
    <>
      <Hero items={heroItems} />

      <div className="-mt-16 relative z-10 space-y-2 pb-8 md:-mt-20">
        <CarouselRow
          title="Trending Movies"
          items={trendingMovies.results}
          viewAllHref="/movies"
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
    </>
  );
}
