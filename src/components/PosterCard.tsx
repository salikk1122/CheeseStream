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
}

const cardWidth =
  'w-[calc((100vw-2rem)/2.5)] sm:w-[calc((100vw-4rem)/4)] md:w-[calc((100vw-6rem)/5)] lg:w-[calc((100vw-8rem)/7)] xl:w-[180px]';

export default function PosterCard({ item, priority = false }: PosterCardProps) {
  const title = getMediaTitle(item);
  const href = getMediaHref(item);
  const watchHref = getWatchHref(item);
  const posterUrl = getImageUrl(item.poster_path, POSTER_SIZES.large);
  const year = getYear(item.release_date ?? item.first_air_date);

  return (
    <div className="group relative shrink-0 snap-start hover:z-30">
      <Link href={href} className="block">
        <article
          className={`relative aspect-[2/3] ${cardWidth} overflow-hidden rounded-xl bg-[#0a1628] shadow-md transition-all duration-300 ease-out will-change-transform group-hover:-translate-y-3 group-hover:scale-110 group-hover:shadow-[0_24px_48px_rgba(0,0,0,0.7)]`}
        >
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 40vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 180px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface text-xs text-muted">
              No Image
            </div>
          )}

          {/* Gold inset frame on hover */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-all duration-300 group-hover:inset-[10px] group-hover:bottom-14 group-hover:opacity-100"
            aria-hidden="true"
          >
            <div className="h-full w-full rounded-md border-2 border-accent/85" />
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/55" />

          {/* Centered hover content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Link
              href={watchHref}
              onClick={(e) => e.stopPropagation()}
              className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 hover:scale-105"
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

          {/* Bottom title bar */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full border-t border-accent/0 bg-[#0a1628]/0 px-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:border-accent/70 group-hover:bg-[#0a1628]/95 group-hover:py-2.5 group-hover:opacity-100">
            <p className="line-clamp-1 text-center font-display text-xs tracking-[0.2em] text-accent/90 uppercase">
              {title}
            </p>
          </div>
        </article>
      </Link>
    </div>
  );
}

export function PosterCardSkeleton() {
  return (
    <div className="shrink-0 snap-start">
      <div
        className={`aspect-[2/3] ${cardWidth} rounded-xl skeleton`}
      />
    </div>
  );
}
