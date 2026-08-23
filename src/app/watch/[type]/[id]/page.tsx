export const dynamic = 'force-dynamic';

import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import TrailerPlayer from '@/components/TrailerPlayer';
import { findTrailer, getDetails, getVideos } from '@/lib/tmdb';
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
  } catch {
    notFound();
  }

  const title = getDetailsTitle(details);
  const trailer = findTrailer(videos.results);

  return (
    <div className="min-h-screen px-4 pb-12 pt-24 md:px-8 lg:px-12">
      <Link
        href={`/title/${mediaType}/${params.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {title}
      </Link>

      <h1 className="mb-2 font-display text-3xl tracking-wide text-white md:text-5xl">
        {title}
      </h1>
      <p className="mb-8 text-muted">
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
        <div className="mx-auto max-w-5xl rounded-lg border border-white/10 bg-surface p-12 text-center">
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
