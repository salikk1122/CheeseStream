export const dynamic = 'force-dynamic';

import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import ContentUnavailable from '@/components/ContentUnavailable';
import TrailerPlayer from '@/components/TrailerPlayer';
import { findTrailer, getDetails, getVideos, isTmdbNetworkError } from '@/lib/tmdb';
import { getDetailsTitle } from '@/types';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { type: string; id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const mediaType = params.type as 'movie' | 'tv';
    const details = await getDetails(mediaType, params.id);
    return {
      title: `Watch — ${getDetailsTitle(details)}`,
    };
  } catch {
    return { title: 'Watch' };
  }
}

export default async function WatchPage({ params }: PageProps) {
  const mediaType = params.type;
  if (mediaType !== 'movie' && mediaType !== 'tv') {
    notFound();
  }

  let details;
  let videos;

  try {
    [details, videos] = await Promise.all([
      getDetails(mediaType, params.id),
      getVideos(mediaType, params.id),
    ]);
  } catch (error) {
    if (isTmdbNetworkError(error)) {
      return (
        <div className="min-h-screen px-4 pb-24 pt-20 sm:pt-24 md:px-8 md:pb-12 lg:px-12">
          <ContentUnavailable />
        </div>
      );
    }
    notFound();
  }

  const title = getDetailsTitle(details);
  const trailer = findTrailer(videos.results);

  return (
    <div className="min-h-screen px-4 pb-24 pt-20 sm:pt-24 md:px-8 md:pb-12 lg:px-12">
      <Link
        href={`/title/${mediaType}/${params.id}`}
        className="mb-4 inline-flex max-w-full items-center gap-2 text-sm text-muted transition-colors hover:text-white sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" />
        <span className="truncate">Back to {title}</span>
      </Link>

      <h1 className="mb-2 font-display text-2xl tracking-wide text-white sm:text-3xl md:text-5xl">
        {title}
      </h1>
      <p className="mb-6 text-sm text-muted sm:mb-8">
        {trailer
          ? `Official trailer — ${trailer.name}`
          : 'No trailer available for this title.'}
      </p>

      {trailer ? (
        <div className="mx-auto max-w-5xl">
          <TrailerPlayer videoKey={trailer.key} title={trailer.name} />
          <p className="mt-4 text-center text-xs text-muted">
            Trailer sourced from TMDB via official YouTube embed. CheeseStream
            does not host or stream copyrighted content.
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl rounded-lg border border-white/10 bg-surface p-8 text-center sm:p-12">
          <p className="text-lg text-white">No trailer found</p>
          <p className="mt-2 text-sm text-muted">
            TMDB does not have a YouTube trailer for this title yet.
          </p>
          <Link
            href={`/title/${mediaType}/${params.id}`}
            className="btn-primary mt-6 inline-flex"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
}
