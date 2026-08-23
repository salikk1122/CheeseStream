'use client';

import Image from 'next/image';
import type { MediaItem } from '@/types';
import PosterCard from './PosterCard';

interface MediaGridProps {
  items: MediaItem[];
}

/** Responsive poster grid for browse / search / my-list pages */
export default function MediaGrid({ items }: MediaGridProps) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
      {items.map((item) => (
        <PosterCard
          key={`${item.media_type ?? 'item'}-${item.id}`}
          item={item}
          fill
        />
      ))}
    </div>
  );
}
