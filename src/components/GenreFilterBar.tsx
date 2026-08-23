'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Genre } from '@/types';

interface GenreFilterBarProps {
  genres: Genre[];
  basePath: '/movies' | '/shows';
}

export default function GenreFilterBar({
  genres,
  basePath,
}: GenreFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get('genre');

  const handleSelect = (genreId: number | null) => {
    if (genreId === null) {
      router.push(basePath);
    } else {
      router.push(`${basePath}?genre=${genreId}`);
    }
  };

  return (
    <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mb-8 md:px-8 lg:px-12">
      <button
        onClick={() => handleSelect(null)}
        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
          !activeGenre
            ? 'bg-accent text-black'
            : 'bg-white/10 text-gray-300 hover:bg-white/20'
        }`}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => handleSelect(genre.id)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
            activeGenre === String(genre.id)
              ? 'bg-accent text-black'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
