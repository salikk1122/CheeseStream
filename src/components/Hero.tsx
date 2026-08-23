'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Check, CircleHelp, Play, Plus, Rocket, Star } from 'lucide-react';
import type { MediaItem } from '@/types';
import {
  BACKDROP_SIZES,
  formatRating,
  getImageUrl,
  getMediaHref,
  getMediaTitle,
  getMediaType,
  getPrimaryGenreName,
  getWatchHref,
  getYear,
} from '@/lib/utils';
import { useWatchlistStore } from '@/store/watchlist';

interface HeroProps {
  items: MediaItem[];
}

const SLIDE_DURATION_S = 5;

export default function Hero({ items }: HeroProps) {
  const featured = items.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { toggleItem, isInList } = useWatchlistStore();

  const goTo = useCallback(
    (index: number) => {
      if (featured.length === 0) return;
      setCurrentIndex(
        ((index % featured.length) + featured.length) % featured.length
      );
    },
    [featured.length]
  );

  const advanceSlide = useCallback(() => {
    if (featured.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  }, [featured.length]);

  if (featured.length === 0) {
    return (
      <div className="relative h-[85dvh] min-h-[520px] w-full skeleton md:h-[100dvh] md:min-h-[640px]" />
    );
  }

  const current = featured[currentIndex];
  const title = getMediaTitle(current);
  const mediaType = getMediaType(current);
  const detailHref = getMediaHref(current);
  const watchHref = getWatchHref(current);
  const year = getYear(current.release_date ?? current.first_air_date);
  const genre = getPrimaryGenreName(current.genre_ids);
  const inList = isInList(current.id, mediaType);

  return (
    <section
      className="relative h-[85dvh] min-h-[520px] w-full overflow-hidden md:h-[100dvh] md:min-h-[640px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {featured.map((item, index) => {
        const url = getImageUrl(item.backdrop_path, BACKDROP_SIZES.original);
        if (!url) return null;
        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={url}
              alt={getMediaTitle(item)}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/55 to-transparent md:from-background/90 md:via-background/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30 md:via-background/20 md:to-black/20" />

      <div className="relative flex h-full items-end px-4 pb-24 pt-24 sm:px-6 sm:pb-28 md:px-8 md:pb-32 md:pt-28 lg:px-12">
        <div className="max-w-3xl space-y-3 sm:space-y-4 md:space-y-6">
          <h1 className="font-display text-[2.75rem] leading-[0.9] tracking-wide text-white drop-shadow-lg sm:text-6xl md:text-8xl lg:text-9xl">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-white sm:gap-x-3 sm:text-sm md:text-base">
            <span className="inline-flex items-center gap-1 sm:gap-1.5">
              <Star className="h-3.5 w-3.5 fill-white text-white sm:h-4 sm:w-4" />
              {formatRating(current.vote_average)}/10
            </span>
            {year && (
              <>
                <span className="text-white/50" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1 sm:gap-1.5">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {year}
                </span>
              </>
            )}
            {genre && (
              <>
                <span className="text-white/50" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1 sm:gap-1.5">
                  <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="max-w-[9rem] truncate sm:max-w-none">{genre}</span>
                </span>
              </>
            )}
          </div>

          <p className="line-clamp-2 max-w-2xl text-sm text-white/90 sm:line-clamp-3 sm:text-base md:text-lg">
            {current.overview}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-0.5 sm:gap-3 sm:pt-1">
            <Link
              href={watchHref}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform active:scale-[0.98] hover:scale-[1.02] hover:bg-white/95 sm:px-7 sm:py-3 md:text-base"
            >
              <Play className="h-4 w-4 fill-black sm:h-5 sm:w-5" />
              Play
            </Link>

            <div className="inline-flex items-center overflow-hidden rounded-full border border-white/20 bg-black/35 backdrop-blur-md">
              <button
                type="button"
                onClick={() =>
                  toggleItem({
                    id: current.id,
                    type: mediaType,
                    title,
                    poster_path: current.poster_path,
                    vote_average: current.vote_average,
                  })
                }
                className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10 sm:h-12 sm:w-12"
                aria-label={inList ? 'Remove from My List' : 'Add to My List'}
              >
                {inList ? (
                  <Check className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
                ) : (
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.25} />
                )}
              </button>
              <div className="h-5 w-px bg-white/25 sm:h-6" aria-hidden="true" />
              <Link
                href={detailHref}
                className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:bg-white/10 sm:h-12 sm:w-12"
                aria-label={`More info about ${title}`}
              >
                <CircleHelp className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {featured.length > 1 && (
        <div
          className="absolute bottom-[4.75rem] left-1/2 flex -translate-x-1/2 items-center gap-2 md:bottom-12"
          role="tablist"
          aria-label="Featured titles"
        >
          {featured.map((item, index) => {
            if (index < currentIndex) {
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={false}
                  aria-label={`Go to ${getMediaTitle(item)}`}
                  onClick={() => goTo(index)}
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-white transition-opacity hover:opacity-80"
                />
              );
            }

            if (index === currentIndex) {
              return (
                <div
                  key={item.id}
                  role="tab"
                  aria-selected
                  aria-label={`Now showing ${getMediaTitle(item)}`}
                  className="h-1.5 w-8 shrink-0 overflow-hidden rounded-full bg-white/25 sm:w-10"
                >
                  <div
                    key={`progress-${currentIndex}`}
                    className={`hero-progress-fill h-full w-full rounded-full bg-white ${
                      isPaused ? 'paused' : ''
                    }`}
                    style={{ animationDuration: `${SLIDE_DURATION_S}s` }}
                    onAnimationEnd={advanceSlide}
                  />
                </div>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={false}
                aria-label={`Go to ${getMediaTitle(item)}`}
                onClick={() => goTo(index)}
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/30 transition-colors hover:bg-white/50"
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
