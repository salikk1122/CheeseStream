import { Star } from 'lucide-react';
import { formatRating } from '@/lib/utils';

interface RatingBadgeProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-xs gap-0.5',
  md: 'px-2 py-1 text-sm gap-1',
  lg: 'px-3 py-1.5 text-base gap-1.5',
};

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

export default function RatingBadge({
  rating,
  size = 'md',
  showLabel = false,
}: RatingBadgeProps) {
  const colorClass =
    rating >= 7
      ? 'bg-green-600/90 text-white'
      : rating >= 5
        ? 'bg-yellow-600/90 text-white'
        : 'bg-red-600/90 text-white';

  return (
    <span
      className={`inline-flex items-center rounded font-semibold ${sizeClasses[size]} ${colorClass}`}
    >
      <Star className={`${iconSizes[size]} fill-current`} />
      {formatRating(rating)}
      {showLabel && <span className="ml-1 font-normal opacity-80">/10</span>}
    </span>
  );
}
