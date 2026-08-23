'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Check,
  Download,
  EyeOff,
  Play,
  Plus,
} from 'lucide-react';
import type { MediaDetails } from '@/types';
import { getDetailsTitle, isMovie } from '@/types';
import {
  BACKDROP_SIZES,
  getImageUrl,
  getWatchHref,
  getYear,
} from '@/lib/utils';
import { useWatchlistStore } from '@/store/watchlist';
import RatingBadge from './RatingBadge';

interface DetailHeaderProps {
  details: MediaDetails;
  mediaType: 'movie' | 'tv';
}

export default function DetailHeader({
  details,
  mediaType,
}: DetailHeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const title = getDetailsTitle(details);
  const year = getYear(
    isMovie(details) ? details.release_date : details.first_air_date
  );
  const backdropUrl = getImageUrl(
    details.backdrop_path,
    BACKDROP_SIZES.original
  );
  const watchHref = getWatchHref({ id: details.id, media_type: mediaType });

  const { toggleItem, isInList } = useWatchlistStore();
  const inList = isInList(details.id, mediaType);

  const runtime = isMovie(details)
    ? details.runtime
      ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
      : null
    : details.number_of_seasons
      ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}`
      : null;

  return (
    <section className="relative min-h-[60vh] w-full">
      {backdropUrl && (
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      <div className="relative px-4 pb-12 pt-28 md:px-8 lg:px-12">
        <div className="max-w-3xl space-y-4">
          <h1 className="font-display text-4xl tracking-wide text-white md:text-6xl lg:text-7xl">
            {title}
          </h1>

          {details.tagline && (
            <p className="text-lg italic text-gray-300">{details.tagline}</p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <RatingBadge rating={details.vote_average} size="lg" showLabel />
            {year && (
              <span className="rounded bg-white/10 px-2 py-1 text-sm">
                {year}
              </span>
            )}
            {runtime && (
              <span className="text-sm text-gray-300">{runtime}</span>
            )}
            {details.adult && (
              <span className="rounded border border-white/30 px-2 py-0.5 text-xs font-bold">
                R
              </span>
            )}
          </div>

          {details.genres && details.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {details.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link href={watchHref} className="btn-primary">
              <Play className="h-5 w-5 fill-current" />
              Play
            </Link>
            <button
              onClick={() =>
                toggleItem({
                  id: details.id,
                  type: mediaType,
                  title,
                  poster_path: details.poster_path,
                  vote_average: details.vote_average,
                })
              }
              className={`btn-secondary ${inList ? 'bg-accent/20 text-accent' : ''}`}
            >
              {inList ? (
                <Check className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {inList ? 'In My List' : 'My List'}
            </button>
            <button
              disabled
              className="btn-secondary cursor-not-allowed opacity-50"
              title="Download not available in demo"
            >
              <Download className="h-5 w-5" />
              Download
            </button>
            <button className="btn-secondary">
              <EyeOff className="h-5 w-5" />
              Hide
            </button>
          </div>

          <div>
            <p
              className={`text-sm leading-relaxed text-gray-200 md:text-base ${
                expanded ? '' : 'line-clamp-3'
              }`}
            >
              {details.overview || 'No overview available.'}
            </p>
            {details.overview && details.overview.length > 200 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-sm font-medium text-accent hover:underline"
              >
                {expanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
