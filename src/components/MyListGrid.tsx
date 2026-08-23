'use client';

import { useEffect, useState } from 'react';
import type { WatchlistItem } from '@/types';
import { useWatchlistStore } from '@/store/watchlist';
import MediaGrid from './MediaGrid';

export default function MyListGrid() {
  const items = useWatchlistStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-xl skeleton" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
        <p className="text-lg font-medium text-white sm:text-xl">Your list is empty</p>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Add movies and shows to your list to watch them later.
        </p>
      </div>
    );
  }

  return (
    <MediaGrid
      items={items.map((item: WatchlistItem) => ({
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
      }))}
    />
  );
}
