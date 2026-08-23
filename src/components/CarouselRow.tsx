'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaItem } from '@/types';
import PosterCard, { PosterCardSkeleton } from './PosterCard';

interface CarouselRowProps {
  title: string;
  items: MediaItem[];
  viewAllHref?: string;
  loading?: boolean;
}

export default function CarouselRow({
  title,
  items,
  viewAllHref,
  loading = false,
}: CarouselRowProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const updateScrollButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollLeft(emblaApi.canScrollPrev());
    setCanScrollRight(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollButtons();
    emblaApi.on('select', updateScrollButtons);
    emblaApi.on('reInit', updateScrollButtons);
    return () => {
      emblaApi.off('select', updateScrollButtons);
      emblaApi.off('reInit', updateScrollButtons);
    };
  }, [emblaApi, items, updateScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    if (!emblaApi) return;
    if (direction === 'left') emblaApi.scrollPrev();
    else emblaApi.scrollNext();
  };

  if (!loading && items.length === 0) return null;

  return (
    <section
      className="group/row relative mb-6 sm:mb-8 md:mb-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-3 flex items-end justify-between gap-3 px-4 sm:mb-4 md:px-8 lg:px-12">
        <h2 className="font-display text-lg tracking-wide text-white sm:text-xl md:text-2xl">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="shrink-0 text-xs font-medium text-muted transition-colors hover:text-accent sm:text-sm"
          >
            View All &rarr;
          </Link>
        )}
      </div>

      <div className="relative">
        {canScrollLeft && isHovered && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/70 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/90 md:block"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div className="overflow-hidden px-4 md:px-8 lg:px-12" ref={emblaRef}>
          <div className="flex gap-2.5 py-3 sm:gap-3 sm:py-4 md:gap-4 md:py-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <PosterCardSkeleton key={i} />
                ))
              : items.map((item, index) => (
                  <PosterCard
                    key={`${item.id}-${index}`}
                    item={item}
                    priority={index < 4}
                  />
                ))}
          </div>
        </div>

        {canScrollRight && isHovered && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/70 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/90 md:block"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </section>
  );
}
