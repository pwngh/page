import { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render a semantic heading (h1-h6) with size, alignment, and color variants.
 *
 * Visual size defaults from the heading level and can be overridden
 * independently via the size prop.
 *
 * @param {TitleProps} props
 * @returns {React.JSX.Element}
 */
export function Title({
  level = 1,
  size,
  align = 'left',
  variant,
  serif = false,
  className,
  children,
  ...props
}) {
  const Component = `h${level}`;

  const defaultSize = useMemo(() => ({
    1: 'xl',
    2: 'lg',
    3: 'md',
    4: 'md',
    5: 'sm',
    6: 'sm'
  })[level], [level]);

  const titleClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'block',
      'transition-colors',

      // Typography Family
      serif ? 'font-serif' : 'font-sans',

      // Typography Scale
      {
        'text-4xl leading-10 tracking-tight': (size || defaultSize) === 'xl',
        'text-3xl leading-9 tracking-tight': (size || defaultSize) === 'lg',
        'text-2xl leading-8': (size || defaultSize) === 'md',
        'text-xl leading-7': (size || defaultSize) === 'sm',
      },

      // Font Weight
      'font-bold',

      // Alignment
      {
        'text-left': align === 'left',
        'text-center': align === 'center',
        'text-right': align === 'right',
      },

      // Color Variants
      {
        'text-gray-900': !variant,
        'text-blue-600': variant === 'primary',
        'text-gray-600': variant === 'secondary',
      },

      // Spacing
      'mb-4',

      // Custom Classes
      className,
    );
  }, [size, defaultSize, align, variant, serif, className]);

  return (
    <Component
      className={titleClasses}
      {...props}
    >
      {children}
    </Component>
  );
}
