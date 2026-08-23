'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Star } from 'lucide-react';
import type { MediaItem } from '@/types';
import {
  formatRating,
  getImageUrl,
  getMediaHref,
  getMediaTitle,
  getWatchHref,
  getYear,
  POSTER_SIZES,
} from '@/lib/utils';

interface PosterCardProps {
  item: MediaItem;
  priority?: boolean;
  /** Stretch to parent width (for CSS grids) */
  fill?: boolean;
}

const carouselWidth =
  'w-[38vw] max-w-[160px] sm:w-[calc((100vw-4rem)/4)] sm:max-w-none md:w-[calc((100vw-6rem)/5)] lg:w-[calc((100vw-8rem)/7)] xl:w-[180px]';

export default function PosterCard({
  item,
  priority = false,
  fill = false,
}: PosterCardProps) {
  const title = getMediaTitle(item);
  const href = getMediaHref(item);
  const watchHref = getWatchHref(item);
  const posterUrl = getImageUrl(item.poster_path, POSTER_SIZES.large);
  const year = getYear(item.release_date ?? item.first_air_date);

  return (
    <div
      className={`group relative snap-start ${
        fill ? 'w-full' : 'shrink-0'
      } md:hover:z-30`}
    >
      <Link href={href} className="block">
        <article
          className={`poster-card relative aspect-[2/3] overflow-hidden rounded-xl bg-[#0a1628] shadow-md ${
            fill ? 'w-full' : carouselWidth
          }`}
        >
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 40vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 180px"
              className="object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.03]"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface text-xs text-muted">
              No Image
            </div>
          )}

          {/* Mobile / touch: always-visible title */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-2 pb-2 pt-8 md:hidden">
            <p className="line-clamp-1 text-center text-[11px] font-semibold text-white">
              {title}
            </p>
          </div>

          {/* Desktop hover UI */}
          <div
            className="pointer-events-none absolute inset-0 hidden opacity-0 transition-all duration-300 md:block md:group-hover:inset-[10px] md:group-hover:bottom-14 md:group-hover:opacity-100"
            aria-hidden="true"
          >
            <div className="h-full w-full rounded-md border-2 border-accent/85" />
          </div>

          <div className="absolute inset-0 hidden bg-black/0 transition-colors duration-300 md:block md:group-hover:bg-black/55" />

          <div className="absolute inset-0 hidden flex-col items-center justify-center px-3 opacity-0 transition-all duration-300 md:flex md:group-hover:opacity-100">
            <Link
              href={watchHref}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 hover:scale-105"
              aria-label={`Watch trailer for ${title}`}
            >
              <Play className="ml-0.5 h-6 w-6 fill-black text-black" />
            </Link>

            <h3 className="line-clamp-2 text-center text-sm font-bold leading-tight text-white">
              {title}
            </h3>

            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/95">
              {year && <span>{year}</span>}
              {year && <span className="text-white/40">·</span>}
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span>{formatRating(item.vote_average)}</span>
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 hidden translate-y-full border-t border-accent/0 bg-[#0a1628]/0 px-3 opacity-0 transition-all duration-300 md:block md:group-hover:translate-y-0 md:group-hover:border-accent/70 md:group-hover:bg-[#0a1628]/95 md:group-hover:py-2.5 md:group-hover:opacity-100">
            <p className="line-clamp-1 text-center font-display text-xs tracking-[0.2em] text-accent/90 uppercase">
              {title}
            </p>
          </div>
        </article>
      </Link>
    </div>
  );
}

export function PosterCardSkeleton({ fill = false }: { fill?: boolean }) {
  return (
    <div className={`snap-start ${fill ? 'w-full' : 'shrink-0'}`}>
      <div
        className={`aspect-[2/3] rounded-xl skeleton ${
          fill ? 'w-full' : carouselWidth
        }`}
      />
    </div>
  );
}
