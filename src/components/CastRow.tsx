'use client';

import Image from 'next/image';
import type { CastMember } from '@/types';
import { getImageUrl, PROFILE_SIZES } from '@/lib/utils';

interface CastRowProps {
  cast: CastMember[];
}

export default function CastRow({ cast }: CastRowProps) {
  const topCast = cast.slice(0, 20);

  if (topCast.length === 0) return null;

  return (
    <section className="mb-10 px-4 md:px-8 lg:px-12">
      <h2 className="mb-4 font-display text-xl tracking-wide text-white md:text-2xl">
        Cast
      </h2>
      <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {topCast.map((member) => {
          const profileUrl = getImageUrl(
            member.profile_path,
            PROFILE_SIZES.medium
          );
          return (
            <div
              key={member.id}
              className="w-28 shrink-0 snap-start text-center md:w-32"
            >
              <div className="relative mx-auto aspect-square w-24 overflow-hidden rounded-full bg-surface md:w-28">
                {profileUrl ? (
                  <Image
                    src={profileUrl}
                    alt={member.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted">
                    N/A
                  </div>
                )}
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-medium text-white">
                {member.name}
              </p>
              <p className="line-clamp-1 text-xs text-muted">
                {member.character}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
