'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import type { MediaItem } from '@/types';
import {
  getImageUrl,
  getMediaHref,
  getMediaTitle,
  getWatchHref,
  POSTER_SIZES,
} from '@/lib/utils';
import RatingBadge from './RatingBadge';

interface PosterCardProps {
  item: MediaItem;
  priority?: boolean;
}

export default function PosterCard({ item, priority = false }: PosterCardProps) {
  const title = getMediaTitle(item);
  const href = getMediaHref(item);
  const watchHref = getWatchHref(item);
  const posterUrl = getImageUrl(item.poster_path, POSTER_SIZES.large);

  return (
    <div className="group relative shrink-0 snap-start">
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] w-[calc((100vw-2rem)/2.5)] overflow-hidden rounded-lg shadow-md transition-all duration-200 ease-in-out group-hover:scale-105 group-hover:shadow-xl sm:w-[calc((100vw-4rem)/4)] md:w-[calc((100vw-6rem)/5)] lg:w-[calc((100vw-8rem)/7)] xl:w-[180px]">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 40vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 180px"
              className="object-cover"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface text-xs text-muted">
              No Image
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="p-3">
              <p className="line-clamp-2 text-sm font-semibold text-white">
                {title}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <RatingBadge rating={item.vote_average} size="sm" />
                <Link
                  href={watchHref}
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-black transition-transform hover:scale-110"
                  aria-label={`Watch trailer for ${title}`}
                >
                  <Play className="h-4 w-4 fill-current" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function PosterCardSkeleton() {
  return (
    <div className="shrink-0 snap-start">
      <div className="aspect-[2/3] w-[calc((100vw-2rem)/2.5)] rounded-lg skeleton sm:w-[calc((100vw-4rem)/4)] md:w-[calc((100vw-6rem)/5)] lg:w-[calc((100vw-8rem)/7)] xl:w-[180px]" />
    </div>
  );
}
