'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Info, Play } from 'lucide-react';
import type { MediaItem } from '@/types';
import {
  BACKDROP_SIZES,
  getImageUrl,
  getMediaHref,
  getMediaTitle,
  getWatchHref,
  getYear,
} from '@/lib/utils';
import RatingBadge from './RatingBadge';

interface HeroProps {
  items: MediaItem[];
}

const SLIDE_DURATION_S = 5;

export default function Hero({ items }: HeroProps) {
  const featured = items.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
      <div className="relative h-[70vh] min-h-[500px] w-full skeleton" />
    );
  }

  const current = featured[currentIndex];
  const title = getMediaTitle(current);
  const detailHref = getMediaHref(current);
  const watchHref = getWatchHref(current);
  const year = getYear(current.release_date ?? current.first_air_date);

  return (
    <section
      className="relative h-[70vh] min-h-[500px] w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Backdrop with crossfade */}
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
              className="object-cover"
            />
          </div>
        );
      })}

      {/* Gradient overlays: left-to-right and bottom-to-top */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

      {/* Content */}
      <div className="relative flex h-full items-end px-4 pb-16 pt-24 md:px-8 md:pb-20 lg:px-12">
        <div className="max-w-2xl space-y-4">
          <h1 className="font-display text-5xl leading-none tracking-wide text-white drop-shadow-lg md:text-7xl lg:text-8xl">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <RatingBadge rating={current.vote_average} size="lg" showLabel />
            {year && (
              <span className="rounded bg-white/10 px-2 py-1 text-sm font-medium">
                {year}
              </span>
            )}
            {current.genre_ids && current.genre_ids.length > 0 && (
              <span className="text-sm text-gray-300">Featured Pick</span>
            )}
          </div>

          <p className="line-clamp-3 max-w-xl text-sm text-gray-200 md:text-base">
            {current.overview}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href={watchHref} className="btn-primary">
              <Play className="h-5 w-5 fill-current" />
              Start Watching
            </Link>
            <Link href={detailHref} className="btn-secondary">
              <Info className="h-5 w-5" />
              More Info
            </Link>
          </div>
        </div>
      </div>

      {/* Progress loader — dots for done/upcoming, animated pill for current */}
      {featured.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2"
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
                  className="h-1.5 w-10 shrink-0 overflow-hidden rounded-full bg-white/25"
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
