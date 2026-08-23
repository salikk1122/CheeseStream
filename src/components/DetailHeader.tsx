'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Check,
  CircleHelp,
  Clock,
  Play,
  Plus,
  Rocket,
  Star,
} from 'lucide-react';
import type { MediaDetails } from '@/types';
import { getDetailsTitle, isMovie } from '@/types';
import {
  BACKDROP_SIZES,
  formatRating,
  getImageUrl,
  getWatchHref,
  getYear,
} from '@/lib/utils';
import { useWatchlistStore } from '@/store/watchlist';

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
  const primaryGenre = details.genres?.[0]?.name;

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
    <section className="relative min-h-[70vh] w-full">
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
        <div className="max-w-3xl space-y-5">
          <h1 className="font-display text-4xl tracking-wide text-white md:text-6xl lg:text-7xl">
            {title}
          </h1>

          {details.tagline && (
            <p className="text-lg italic text-white/70">{details.tagline}</p>
          )}

          {/* Rating · Year · Genre (and runtime when available) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white md:text-base">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-white text-white" />
              {formatRating(details.vote_average)}/10
            </span>
            {year && (
              <>
                <span className="text-white/50" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {year}
                </span>
              </>
            )}
            {primaryGenre && (
              <>
                <span className="text-white/50" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Rocket className="h-4 w-4" />
                  {primaryGenre}
                </span>
              </>
            )}
            {runtime && (
              <>
                <span className="text-white/50" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {runtime}
                </span>
              </>
            )}
          </div>

          <div>
            <p
              className={`max-w-2xl text-sm leading-relaxed text-white/90 md:text-base ${
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

          {/* Play + glass action pill */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={watchHref}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02] hover:bg-white/95 md:text-base"
            >
              <Play className="h-5 w-5 fill-black" />
              Play
            </Link>

            <div className="inline-flex items-center overflow-hidden rounded-full border border-white/20 bg-black/35 backdrop-blur-md">
              <button
                type="button"
                onClick={() =>
                  toggleItem({
                    id: details.id,
                    type: mediaType,
                    title,
                    poster_path: details.poster_path,
                    vote_average: details.vote_average,
                  })
                }
                className="flex h-12 w-12 items-center justify-center text-white transition-colors hover:bg-white/10"
                aria-label={inList ? 'Remove from My List' : 'Add to My List'}
              >
                {inList ? (
                  <Check className="h-5 w-5 text-accent" />
                ) : (
                  <Plus className="h-5 w-5" strokeWidth={2.25} />
                )}
              </button>
              <div className="h-6 w-px bg-white/25" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="flex h-12 w-12 items-center justify-center text-white transition-colors hover:bg-white/10"
                aria-label={expanded ? 'Collapse overview' : 'Expand overview'}
              >
                <CircleHelp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
