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
    <section className="mb-8 sm:mb-10">
      <h2 className="mb-3 font-display text-lg tracking-wide text-white sm:mb-4 sm:text-xl md:text-2xl">
        Cast
      </h2>
      <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:gap-4 sm:px-0">
        {topCast.map((member) => {
          const profileUrl = getImageUrl(
            member.profile_path,
            PROFILE_SIZES.medium
          );
          return (
            <div
              key={member.id}
              className="w-24 shrink-0 snap-start text-center sm:w-28 md:w-32"
            >
              <div className="relative mx-auto aspect-square w-20 overflow-hidden rounded-full bg-surface sm:w-24 md:w-28">
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
