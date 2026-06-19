import { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render inline text with configurable size, weight, and color variant.
 *
 * @param {TextProps} props
 * @returns {React.JSX.Element}
 */
export function Text({
  size = 'md',
  weight = 'normal',
  variant,
  className,
  children,
  ...props
}) {
  const textClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'inline',
      'transition-colors',

      // Typography Scale
      {
        'text-sm leading-5': size === 'sm',
        'text-base leading-6': size === 'md',
        'text-lg leading-7': size === 'lg',
      },

      // Font Weights
      {
        'font-normal': weight === 'normal',
        'font-medium': weight === 'medium',
        'font-bold': weight === 'bold',
      },

      // Color Variants
      {
        'text-gray-900': !variant && !/text-(?:white|black|current|transparent|inherit|[a-z]+-\d{2,3})/.test(className || ''),
        'text-blue-600': variant === 'primary',
        'text-gray-600': variant === 'secondary',
        'text-green-600': variant === 'success',
        'text-red-600': variant === 'error',
      },

      // Custom Classes
      className,
    );
  }, [size, weight, variant, className]);

  return (
    <span
      className={textClasses}
      {...props}
    >
      {children}
    </span>
  );
}
