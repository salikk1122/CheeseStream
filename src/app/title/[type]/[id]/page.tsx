export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import DetailHeader from '@/components/DetailHeader';
import CastRow from '@/components/CastRow';
import MetadataPanel from '@/components/MetadataPanel';
import CarouselRow from '@/components/CarouselRow';
import { getCredits, getDetails, getSimilar, isTmdbNetworkError } from '@/lib/tmdb';
import { getDetailsTitle } from '@/types';
import { notFound } from 'next/navigation';
import ContentUnavailable from '@/components/ContentUnavailable';

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
      title: getDetailsTitle(details),
      description: details.overview,
    };
  } catch {
    return { title: 'Title Not Found' };
  }
}

export default async function TitlePage({ params }: PageProps) {
  const mediaType = params.type;
  if (mediaType !== 'movie' && mediaType !== 'tv') {
    notFound();
  }

  let details;
  let credits;
  let similar;

  try {
    [details, credits, similar] = await Promise.all([
      getDetails(mediaType, params.id),
      getCredits(mediaType, params.id),
      getSimilar(mediaType, params.id),
    ]);
  } catch (error) {
    if (isTmdbNetworkError(error)) {
      return (
        <div className="pb-24 pt-20 md:pb-12">
          <ContentUnavailable />
        </div>
      );
    }
    notFound();
  }

  return (
    <div className="pb-24 md:pb-12">
      <DetailHeader details={details} mediaType={mediaType} />

      <div className="px-4 md:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <CastRow cast={credits.cast} />
          </div>
          <div className="lg:col-span-1">
            <MetadataPanel details={details} mediaType={mediaType} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CarouselRow
          title="More Like This"
          items={similar.results}
        />
      </div>
    </div>
  );
}
