import { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Arrange children vertically or horizontally with consistent spacing.
 *
 * @param {StackProps} props
 * @returns {React.JSX.Element}
 */
export function Stack({
  direction = 'vertical',
  spacing = 'md',
  wrap = false,
  fullWidth = false,
  className,
  children,
  ...props
}) {
  const stackClasses = useMemo(() => {
    return cn(
      // Base
      'flex',

      // Direction
      {
        'flex-col': direction === 'vertical',
        'flex-row': direction === 'horizontal',
      },

      // Spacing
      {
        'space-y-1': direction === 'vertical' && spacing === 'xs',
        'space-y-2': direction === 'vertical' && spacing === 'sm',
        'space-y-4': direction === 'vertical' && spacing === 'md',
        'space-y-6': direction === 'vertical' && spacing === 'lg',
        'space-y-8': direction === 'vertical' && spacing === 'xl',
        'space-x-1': direction === 'horizontal' && spacing === 'xs',
        'space-x-2': direction === 'horizontal' && spacing === 'sm',
        'space-x-4': direction === 'horizontal' && spacing === 'md',
        'space-x-6': direction === 'horizontal' && spacing === 'lg',
        'space-x-8': direction === 'horizontal' && spacing === 'xl',
      },

      // Wrapping
      {
        'flex-wrap': wrap,
      },

      // Width
      {
        'w-full': fullWidth,
      },

      // Custom Classes
      className,
    );
  }, [direction, spacing, wrap, fullWidth, className]);

  return (
    <div className={stackClasses} {...props}>
      {children}
    </div>
  );
}
