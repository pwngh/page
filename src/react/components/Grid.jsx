import React, { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Lay out children in a CSS grid with configurable columns and gaps.
 *
 * Only the listed column counts and gap values map to classes; other
 * numbers fall back to the browser default of a single column.
 *
 * @param {import('../../shared/types.js').GridProps} props
 * @param {1|2|3|4|6|12} [props.columns=1] - Base column count.
 * @param {{sm?: number, md?: number, lg?: number}} [props.responsive] - Column counts per breakpoint, overriding `columns`.
 * @param {1|2|4|6|8|12} [props.gap=4] - Gap on Tailwind's spacing scale.
 * @param {'row'|'col'|'dense'} [props.flow='row'] - Grid auto-flow direction.
 */
export function Grid({
  columns = 1,
  responsive,
  gap = 4,
  flow = 'row',
  stretch = true,
  className,
  children,
  ...props
}) {
  const gridClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'grid',

      // Default Column Count
      {
        'grid-cols-1': columns === 1,
        'grid-cols-2': columns === 2,
        'grid-cols-3': columns === 3,
        'grid-cols-4': columns === 4,
        'grid-cols-6': columns === 6,
        'grid-cols-12': columns === 12,
      },

      // Responsive Columns
      responsive && {
        // Small
        'sm:grid-cols-2': responsive.sm === 2,
        'sm:grid-cols-3': responsive.sm === 3,
        'sm:grid-cols-4': responsive.sm === 4,

        // Medium
        'md:grid-cols-2': responsive.md === 2,
        'md:grid-cols-3': responsive.md === 3,
        'md:grid-cols-4': responsive.md === 4,
        'md:grid-cols-6': responsive.md === 6,

        // Large
        'lg:grid-cols-3': responsive.lg === 3,
        'lg:grid-cols-4': responsive.lg === 4,
        'lg:grid-cols-6': responsive.lg === 6,
        'lg:grid-cols-12': responsive.lg === 12,
      },

      // Gap
      {
        'gap-1': gap === 1,
        'gap-2': gap === 2,
        'gap-4': gap === 4,
        'gap-6': gap === 6,
        'gap-8': gap === 8,
        'gap-12': gap === 12,
      },

      // Flow Direction
      {
        'grid-flow-row': flow === 'row',
        'grid-flow-col': flow === 'col',
        'grid-flow-dense': flow === 'dense',
      },

      // Item Stretching
      stretch && 'h-full',

      // Custom Classes
      className,
    );
  }, [columns, responsive, gap, flow, stretch, className]);

  return (
    <div
      className={gridClasses}
      {...props}
    >
      {children}
    </div>
  );
}
