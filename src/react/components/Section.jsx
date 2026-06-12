import { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render a full-width page section with background variants and vertical spacing.
 *
 * @param {SectionProps} props
 * @returns {React.JSX.Element}
 */
export function Section({
  variant = 'default',
  space = 'md',
  divider = false,
  padding,
  constrainWidth = true,
  maxWidth = 'lg',
  className,
  children,
  ...props
}) {
  const sectionClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'w-full',

      // Background Variants
      {
        'bg-white': variant === 'default',
        'bg-gray-50': variant === 'secondary',
        'bg-blue-600': variant === 'primary',
        'bg-gray-900': variant === 'dark',
      },

      // Text Color for Dark Backgrounds
      {
        'text-white': variant === 'primary' || variant === 'dark',
      },

      // Default Vertical Spacing (if not overridden)
      !padding && {
        'py-0': space === 'none',
        'py-2': space === 'xs',
        'py-6': space === 'sm',
        'py-12': space === 'md',
        'py-16 md:py-24': space === 'lg',
      },

      // Custom Padding Override
      padding,

      // Bottom Divider
      divider && 'border-b border-gray-200',

      // Custom Classes
      className,
    );
  }, [variant, space, padding, divider, className]);

  const contentClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'w-full',

      // Width Constraints
      constrainWidth && [
        'mx-auto px-4 sm:px-6 lg:px-8',
        {
          'max-w-screen-sm': maxWidth === 'sm',
          'max-w-screen-md': maxWidth === 'md',
          'max-w-screen-lg': maxWidth === 'lg',
          'max-w-screen-xl': maxWidth === 'xl',
          'max-w-full': maxWidth === 'full',
        },
      ],
    );
  }, [constrainWidth, maxWidth]);

  return (
    <section
      className={sectionClasses}
      {...props}
    >
      {constrainWidth ? (
        <div className={contentClasses}>
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
}

/**
 * @typedef {Object} SectionHeaderProps
 * @property {React.ReactNode} title - Header title
 * @property {React.ReactNode} [subtitle] - Optional subtitle
 * @property {React.ReactNode} [action] - Optional action element
 * @property {'left'|'center'} [align='left'] - Text alignment
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Render a section heading with optional subtitle and action slot.
 *
 * @param {SectionHeaderProps} props
 * @returns {React.JSX.Element}
 */
export function SectionHeader({
  title,
  subtitle,
  action,
  align = 'left',
  className,
  ...props
}) {
  const headerClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'w-full',
      'mb-8',

      // Alignment
      {
        'text-left': align === 'left',
        'text-center': align === 'center',
      },

      // Action Layout
      action && 'flex items-center justify-between gap-4',

      // Custom Classes
      className,
    );
  }, [align, action, className]);

  const contentClasses = useMemo(() => {
    return cn(
      // Base
      'space-y-1',

      // Flex When Action Present
      action && 'flex-1',
    );
  }, [action]);

  return (
    <div
      className={headerClasses}
      {...props}
    >
      <div className={contentClasses}>
        {typeof title === 'string' ? (
          <h2 className="text-2xl font-bold tracking-tight">
            {title}
          </h2>
        ) : (
          title
        )}
        {subtitle && (
          <div className="text-lg text-gray-600 dark:text-gray-300">
            {subtitle}
          </div>
        )}
      </div>
      {action && (
        <div className="flex-none">{action}</div>
      )}
    </div>
  );
}
