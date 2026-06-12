import React, { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Position a child within a Grid via column span, start, and responsive overrides.
 *
 * @param {import('../../shared/types.js').GridItemProps} props
 * @param {1|2|3|4|6|12} [props.span] - Columns this item spans.
 * @param {{sm?: number, md?: number, lg?: number}} [props.responsive] - Span per breakpoint, overriding `span`.
 * @param {1|2|3|4|5|6} [props.start] - Column the item starts at.
 */
export function GridItem({
  span,
  responsive,
  start,
  className,
  children,
  ...props
}) {
  const itemClasses = useMemo(() => {
    return cn(
      // Base
      'relative',

      // Column Span
      {
        'col-span-1': span === 1,
        'col-span-2': span === 2,
        'col-span-3': span === 3,
        'col-span-4': span === 4,
        'col-span-6': span === 6,
        'col-span-12': span === 12,
      },

      // Column Start
      start && {
        'col-start-1': start === 1,
        'col-start-2': start === 2,
        'col-start-3': start === 3,
        'col-start-4': start === 4,
        'col-start-5': start === 5,
        'col-start-6': start === 6,
      },

      // Responsive Spans
      responsive && {
        // Small
        'sm:col-span-2': responsive.sm === 2,
        'sm:col-span-3': responsive.sm === 3,
        'sm:col-span-4': responsive.sm === 4,

        // Medium
        'md:col-span-2': responsive.md === 2,
        'md:col-span-3': responsive.md === 3,
        'md:col-span-4': responsive.md === 4,
        'md:col-span-6': responsive.md === 6,

        // Large
        'lg:col-span-3': responsive.lg === 3,
        'lg:col-span-4': responsive.lg === 4,
        'lg:col-span-6': responsive.lg === 6,
        'lg:col-span-12': responsive.lg === 12,
      },

      // Custom Classes
      className,
    );
  }, [span, responsive, start, className]);

  return (
    <div
      className={itemClasses}
      {...props}
    >
      {children}
    </div>
  );
}
