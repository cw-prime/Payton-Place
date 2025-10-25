import { useId } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  showValue?: boolean;
  size?: number;
  className?: string;
}

const clampRating = (value: number) => Math.max(0, Math.min(5, value));

const RatingStars = ({ rating, showValue = false, size = 18, className }: RatingStarsProps) => {
  const clampedRating = clampRating(rating);
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating - fullStars >= 0.5;
  const gradientId = useId();

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => {
          const position = index + 1;
          const isFull = position <= fullStars;
          const isHalf = !isFull && hasHalfStar && position === fullStars + 1;

          return (
            <Star
              key={position}
              className="stroke-amber-400"
              style={{ width: size, height: size }}
              strokeWidth={isFull || isHalf ? 0 : 1.5}
              fill={
                isFull ? '#f59e0b'
                  : isHalf ? `url(#${gradientId})`
                    : 'none'
              }
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600">
          {clampedRating.toFixed(1)} / 5
        </span>
      )}
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default RatingStars;
