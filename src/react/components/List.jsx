import React, { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render an ordered, unordered, or marker-less list with consistent spacing.
 *
 * Children are expected to be <li> elements, except when `marker` is set:
 * each child is then wrapped in an <li> with the custom marker prefixed and
 * the default bullet suppressed.
 *
 * @param {import('../../shared/types.js').ListProps} props
 * @param {'ordered'|'unordered'|'none'} [props.type='unordered'] - List semantics and default marker style.
 * @param {boolean} [props.dividers=false] - Draw a border between items.
 * @param {string} [props.marker] - Custom marker rendered in front of each item.
 */
export function List({
  type = 'unordered',
  size = 'md',
  dividers = false,
  marker,
  className,
  children,
  ...props
}) {
  const Component = type === 'ordered' ? 'ol' : 'ul';

  const listClasses = useMemo(() => {
    return cn(
      // Base
      'relative',

      // Spacing
      'space-y-1',
      'my-4',

      // List Style
      {
        'list-none': type === 'none' || Boolean(marker),
        'list-decimal pl-8': type === 'ordered',
        'list-disc pl-8': type === 'unordered' && !marker,
      },

      // Typography
      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },

      // Dividers
      dividers && [
        '[&>li]:border-b',
        '[&>li]:border-gray-200',
        '[&>li:last-child]:border-0',
        '[&>li]:pb-1',
      ],

      // Custom Classes
      className,
    );
  }, [type, size, dividers, marker, className]);

  const itemClasses = useMemo(() => {
    return cn(
      'relative',
      marker && 'pl-6',
      'leading-normal'
    );
  }, [marker]);

  const wrappedChildren = marker
    ? React.Children.map(children, child => (
        <li className={itemClasses}>
          <span className="absolute left-0 select-none text-gray-400">
            {marker}
          </span>
          {child}
        </li>
      ))
    : children;

  return (
    <Component
      className={listClasses}
      {...props}
    >
      {wrappedChildren}
    </Component>
  );
}
