import { forwardRef } from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: string;
  label?: string;
}

const StarRatingInput = forwardRef<HTMLDivElement, StarRatingInputProps>(({
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
  label = 'Rating',
}, ref) => (
  <div className="space-y-2">
    <span className="block text-sm font-medium text-gray-700">{label}</span>
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onBlur={onBlur}
      className="flex items-center gap-2"
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const ratingValue = index + 1;
        const isActive = ratingValue <= value;

        return (
          <button
            key={ratingValue}
            type="button"
            onClick={() => onChange(ratingValue)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                event.preventDefault();
                onChange(Math.max(1, value - 1));
              }
              if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault();
                onChange(Math.min(5, value + 1));
              }
            }}
            role="radio"
            aria-checked={isActive}
            aria-label={`${ratingValue} star${ratingValue > 1 ? 's' : ''}`}
            disabled={disabled}
            className={`p-1 rounded-md transition-colors ${
              isActive ? 'text-amber-500' : 'text-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300'}`}
          >
            <Star
              className="w-6 h-6"
              fill={isActive ? '#f59e0b' : 'none'}
              strokeWidth={isActive ? 0 : 1.5}
            />
          </button>
        );
      })}
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
));

StarRatingInput.displayName = 'StarRatingInput';

export default StarRatingInput;
