import React, { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render a button with visual variants, sizes, and a loading state.
 *
 * While `loading` is true the button is disabled and its content is replaced
 * by a spinner without changing the button's dimensions.
 *
 * @param {import('../../shared/types.js').ButtonProps} props
 * @param {'primary'|'secondary'|'outline'|'ghost'} [props.variant='primary'] - Visual style.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Height, padding, and font scale.
 * @param {boolean} [props.loading=false] - Show the spinner and block clicks.
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Native button type.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  className,
  children,
  onClick,
  ...props
}) {
  const buttonClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'inline-flex',
      'items-center',
      'justify-center',
      'transition-all',
      'duration-200',
      'select-none',

      // Typography
      'font-medium',

      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },

      // Sizing & Padding
      {
        'h-8 px-3 py-1': size === 'sm',
        'h-10 px-4 py-2': size === 'md',
        'h-12 px-6 py-3': size === 'lg',
      },

      // Width
      fullWidth ? 'w-full' : 'w-auto',

      // Borders & Radius
      'rounded-md',
      'border',

      // Variants
      {
        // Primary
        'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 border-transparent text-white':
          variant === 'primary' && !disabled,

        // Secondary
        'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border-gray-200 text-gray-900':
          variant === 'secondary' && !disabled,

        // Outline
        'bg-transparent hover:bg-gray-50 active:bg-gray-100 border-gray-300 text-gray-700':
          variant === 'outline' && !disabled,

        // Ghost
        'bg-transparent hover:bg-gray-50 active:bg-gray-100 border-transparent text-gray-700':
          variant === 'ghost' && !disabled,
      },

      // Focus
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      {
        'focus:ring-blue-500': variant === 'primary',
        'focus:ring-gray-500': variant !== 'primary',
      },

      // Disabled & Loading States
      {
        'opacity-50 cursor-not-allowed': disabled || loading,
        'cursor-wait': loading && !disabled,
      },

      // Custom Classes
      className,
    );
  }, [variant, size, fullWidth, disabled, loading, className]);

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
        </span>
      )}
      <span className={cn('flex items-center gap-2', { 'opacity-0': loading })}>
        {children}
      </span>
    </button>
  );
}
