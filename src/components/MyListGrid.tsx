'use client';

import { useEffect, useState } from 'react';
import type { WatchlistItem } from '@/types';
import { useWatchlistStore } from '@/store/watchlist';
import PosterCard from './PosterCard';

export default function MyListGrid() {
  const items = useWatchlistStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch with localStorage-persisted state
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-lg skeleton" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-xl font-medium text-white">Your list is empty</p>
        <p className="mt-2 text-muted">
          Add movies and shows to your list to watch them later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item: WatchlistItem) => (
        <PosterCard
          key={`${item.type}-${item.id}`}
          item={{
            id: item.id,
            title: item.type === 'movie' ? item.title : undefined,
            name: item.type === 'tv' ? item.title : undefined,
            poster_path: item.poster_path,
            vote_average: item.vote_average,
            overview: '',
            backdrop_path: null,
            vote_count: 0,
            popularity: 0,
            media_type: item.type,
          }}
        />
      ))}
    </div>
  );
}
