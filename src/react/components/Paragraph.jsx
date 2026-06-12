import { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render body text with configurable alignment, line height, and color variant.
 *
 * @param {ParagraphProps} props
 * @returns {React.JSX.Element}
 */
export function Paragraph({
  align = 'left',
  lead = false,
  lineHeight = 'normal',
  variant,
  className,
  children,
  ...props
}) {
  const paragraphClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'block',
      'transition-colors',

      // Typography Scale & Weight
      {
        'text-lg font-normal': lead,
        'text-base font-normal': !lead,
      },

      // Line Height
      {
        'leading-normal': lineHeight === 'normal',
        'leading-relaxed': lineHeight === 'relaxed',
        'leading-loose': lineHeight === 'loose',
      },

      // Alignment
      {
        'text-left': align === 'left',
        'text-center': align === 'center',
        'text-right': align === 'right',
        'text-justify': align === 'justify',
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
  }, [align, lead, lineHeight, variant, className]);

  return (
    <p
      className={paragraphClasses}
      {...props}
    >
      {children}
    </p>
  );
}
