import { useMemo, useState } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Show a dismissible page-level notification bar.
 *
 * Dismissal hides the banner via internal state; there is no controlled mode.
 *
 * @param {import('../../shared/types.js').BannerProps} props
 * @param {'info'|'success'|'warning'|'error'} [props.variant='info'] - Color scheme.
 * @param {'top'|'bottom'} [props.position='top'] - Screen edge the banner anchors to.
 * @param {boolean} [props.dismissible=true] - Render the close button.
 * @param {() => void} [props.onDismiss] - Called after the banner hides itself.
 */
export function Banner({
  children,
  variant = 'info',
  position = 'top',
  dismissible = true,
  onDismiss,
  showIcon = false,
  className = '',
  ...props
}) {
  const [internalDismissed, setInternalDismissed] = useState(false);

  const handleDismiss = (e) => {
    e.preventDefault();
    setInternalDismissed(true);
    onDismiss?.();
  };

  const bannerClasses = useMemo(() => {
    return cn(
      // Base
      'fixed',
      'left-0',
      'right-0',
      'z-50',
      'border-t',
      'border-b',

      {
        'bg-blue-50 text-blue-800 border-blue-200': variant === 'info',
        'bg-green-50 text-green-800 border-green-200': variant === 'success',
        'bg-yellow-50 text-yellow-800 border-yellow-200': variant === 'warning',
        'bg-red-50 text-red-800 border-red-200': variant === 'error',
      },

      {
        'top-0': position === 'top',
        'bottom-0': position === 'bottom',
      },

      {
        'hidden': internalDismissed,
      },

      // Custom Classes
      className,
    );
  }, [variant, position, className, internalDismissed]);

  return (
    <div
      className={bannerClasses}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            {showIcon && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            )}
            <div>{children}</div>
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 rounded-lg p-1 opacity-60 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-label="Dismiss banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
