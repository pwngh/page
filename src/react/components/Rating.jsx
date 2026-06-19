import { useRef } from 'react';
import { cn } from '../../shared/utils.js';

const STARS = [1, 2, 3, 4, 5];

/**
 * Render an interactive five-star rating control.
 *
 * Selecting the currently active star clears the rating to 0. Enter and Space
 * mirror click behavior for keyboard users.
 *
 * @param {RatingProps} props
 * @returns {React.JSX.Element}
 */
export function Rating({
  value,
  onChange,
  readonly = false,
  disabled = false,
  size = 'md',
  className,
  ...props
}) {
  const starRefs = useRef({});

  const containerClasses = cn(
    'inline-flex',
    'gap-1',
    { 'cursor-pointer': !readonly && !disabled },
    { 'opacity-50': disabled },
    className
  );

  const starClasses = cn(
    'transition-colors',
    'duration-150',
    {
      'w-4 h-4': size === 'sm',
      'w-6 h-6': size === 'md',
      'w-8 h-8': size === 'lg'
    }
  );

  const renderStar = (filled) => (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      className={cn(
        starClasses,
        filled ? 'text-yellow-400' : 'text-gray-300'
      )}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      />
    </svg>
  );

  const handleClick = (rating) => {
    if (!readonly && !disabled) {
      onChange(rating === value ? 0 : rating);
    }
  };

  const handleKeyDown = (e, rating) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(rating);
    } else if (
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowDown'
    ) {
      if (readonly || disabled) {
        return;
      }
      e.preventDefault();
      const delta =
        e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : -1;
      const next = Math.min(5, Math.max(1, rating + delta));
      onChange(next);
      starRefs.current[next]?.focus();
    }
  };

  return (
    <div
      className={containerClasses}
      role="radiogroup"
      aria-label="Rating"
      {...props}
    >
      {STARS.map((star) => (
        <span
          key={star}
          ref={(el) => (starRefs.current[star] = el)}
          onClick={() => handleClick(star)}
          onKeyDown={(e) => handleKeyDown(e, star)}
          tabIndex={
            readonly || disabled
              ? -1
              : star === (value > 0 ? value : 1)
                ? 0
                : -1
          }
          role="radio"
          aria-checked={value >= star}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
        >
          {renderStar(value >= star)}
        </span>
      ))}
    </div>
  );
}
