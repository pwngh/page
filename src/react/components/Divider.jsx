import React, { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Separate content with a horizontal or vertical rule and optional label.
 *
 * Labels are only rendered for horizontal dividers; vertical dividers
 * ignore `label` and `labelPosition`.
 *
 * @param {import('../../shared/types.js').DividerProps} props
 * @param {'horizontal'|'vertical'} [props.orientation='horizontal'] - Divider direction.
 * @param {'solid'|'dashed'|'dotted'} [props.variant='solid'] - Line style.
 * @param {'thin'|'medium'|'thick'} [props.weight='thin'] - Line thickness for dashed and dotted variants.
 * @param {import('react').ReactNode} [props.label] - Text rendered within the horizontal rule.
 * @param {'start'|'center'|'end'} [props.labelPosition='center'] - Where the label sits on the rule.
 */
export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  weight = 'thin',
  label,
  labelPosition = 'center',
  className,
  ...props
}) {
  const dividerClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'flex',
      'items-center',

      // Orientation
      {
        // Horizontal
        'w-full': orientation === 'horizontal',
        'h-auto': orientation === 'horizontal',
        'flex-row': orientation === 'horizontal',

        // Vertical
        'h-full': orientation === 'vertical',
        'w-px': orientation === 'vertical',
        'flex-col': orientation === 'vertical',
        'self-stretch': orientation === 'vertical',
      },

      // Spacing
      {
        'my-4': orientation === 'horizontal' && !label,
        'my-8': orientation === 'horizontal' && label,
        'mx-4': orientation === 'vertical',
      },

      className
    );
  }, [orientation, label, className]);

  const lineClasses = useMemo(() => {
    return cn(
      // Base styles
      'flex-1',
      'transition-colors',

      // Orientation specific
      {
        'h-px w-full': orientation === 'horizontal',
        'w-px h-full': orientation === 'vertical',
      },

      // Line variants
      {
        'border-0 bg-gray-200': variant === 'solid',
        'border-dashed border-gray-200': variant === 'dashed',
        'border-dotted border-gray-200': variant === 'dotted',
      },

      // Line weight (top border for horizontal, left border for vertical)
      {
        'border-t': orientation === 'horizontal' && weight === 'thin' && variant !== 'solid',
        'border-t-2': orientation === 'horizontal' && weight === 'medium' && variant !== 'solid',
        'border-t-4': orientation === 'horizontal' && weight === 'thick' && variant !== 'solid',
        'border-l': orientation === 'vertical' && weight === 'thin' && variant !== 'solid',
        'border-l-2': orientation === 'vertical' && weight === 'medium' && variant !== 'solid',
        'border-l-4': orientation === 'vertical' && weight === 'thick' && variant !== 'solid',
      }
    );
  }, [orientation, variant, weight]);

  const labelClasses = useMemo(() => {
    return cn(
      // Base
      'text-sm',
      'text-gray-500',
      'whitespace-nowrap',
      'bg-white',

      // Positioning
      'px-3',
      {
        'absolute': labelPosition !== 'center',
        'left-0': labelPosition === 'start',
        'right-0': labelPosition === 'end',
      }
    );
  }, [labelPosition]);

  if (orientation === 'vertical') {
    return <div className={dividerClasses} role="separator" {...props}>
      <div className={lineClasses} />
    </div>;
  }

  return (
    <div className={dividerClasses} role="separator" {...props}>
      <div className={lineClasses} />
      {label && (
        <>
          <span className={labelClasses}>{label}</span>
          <div className={lineClasses} />
        </>
      )}
    </div>
  );
}
