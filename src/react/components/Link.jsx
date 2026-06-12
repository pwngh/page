import React, { useMemo } from 'react';
import { Link as RemixLink } from '@remix-run/react';
import { cn } from '../../shared/utils.js';

/**
 * Render an internal Remix link or an external anchor with shared styling.
 *
 * External links open in a new tab with `rel="noopener noreferrer"` and an
 * external-link icon appended; internal links use client-side navigation.
 *
 * @param {import('../../shared/types.js').LinkProps} props
 * @param {string} props.href - Destination route (internal) or URL (external).
 * @param {boolean} [props.external=false] - Render a plain anchor targeting a new tab.
 * @param {'primary'|'secondary'|'subtle'} [props.variant='primary'] - Color scheme.
 * @param {boolean} [props.disabled=false] - Block navigation and clicks.
 */
export function Link({
  href,
  external = false,
  variant = 'primary',
  underline = false,
  disabled = false,
  className,
  children,
  onClick,
  ...props
}) {
  const linkClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'inline-flex',
      'items-center',
      'transition-colors',
      'duration-200',
      'select-none',

      // Typography
      'text-base',
      'leading-normal',

      // Variants
      {
        // Primary
        'text-blue-600 hover:text-blue-700 active:text-blue-800':
          variant === 'primary' && !disabled,

        // Secondary
        'text-gray-600 hover:text-gray-700 active:text-gray-800':
          variant === 'secondary' && !disabled,

        // Subtle
        'text-gray-500 hover:text-gray-600 active:text-gray-700':
          variant === 'subtle' && !disabled,
      },

      // Underline
      underline && 'hover:underline',

      // Focus
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-blue-500',

      // Disabled State
      disabled && 'opacity-50 cursor-not-allowed pointer-events-none',

      // Custom Classes
      className,
    );
  }, [variant, underline, disabled, className]);

  const externalProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer',
  } : {};

  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  // External link
  if (external) {
    return (
      <a
        href={href}
        className={linkClasses}
        onClick={handleClick}
        {...externalProps}
        {...props}
      >
        {children}
        <svg
          className="ml-1 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    );
  }

  // Internal Remix link
  return (
    <RemixLink
      to={href}
      className={linkClasses}
      onClick={handleClick}
      {...props}
    >
      {children}
    </RemixLink>
  );
}
