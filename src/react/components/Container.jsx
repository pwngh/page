import React, { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Constrain content to a consistent max width with responsive padding.
 *
 * @param {import('../../shared/types.js').ContainerProps} props
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [props.maxWidth='lg'] - Max-width breakpoint.
 * @param {boolean} [props.center=true] - Center the container horizontally.
 * @param {string} [props.padding] - Tailwind padding classes that replace the responsive default.
 * @param {'none'|'sm'|'md'|'lg'} [props.space='none'] - Vertical padding scale.
 */
export function Container({
  maxWidth = 'lg',
  center = true,
  padding,
  space = 'none',
  className,
  children,
  ...props
}) {
  const containerClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'w-full',

      // Max Width Constraints
      {
        'max-w-screen-sm': maxWidth === 'sm',
        'max-w-screen-md': maxWidth === 'md',
        'max-w-screen-lg': maxWidth === 'lg',
        'max-w-screen-xl': maxWidth === 'xl',
        'max-w-full': maxWidth === 'full',
      },

      // Horizontal Centering
      center && 'mx-auto',

      // Default Padding (if not overridden)
      !padding && [
        'px-4 sm:px-6 lg:px-8',
      ],

      // Custom Padding Override
      padding,

      // Vertical Spacing
      {
        'py-0': space === 'none',
        'py-4': space === 'sm',
        'py-8': space === 'md',
        'py-12': space === 'lg',
      },

      // Custom Classes
      className,
    );
  }, [maxWidth, center, padding, space, className]);

  return (
    <div
      className={containerClasses}
      {...props}
    >
      {children}
    </div>
  );
}
