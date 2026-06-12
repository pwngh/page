import { useEffect, useMemo, useRef } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render an accessible modal dialog with overlay, size variants, and transitions.
 *
 * While open, body scroll is locked and focus moves into the dialog; on close,
 * focus returns to the previously active element. Renders nothing when closed.
 *
 * @param {ModalProps} props
 * @returns {React.JSX.Element | null} The dialog, or null while isOpen is false.
 */
export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
  ...props
}) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const overlayClasses = useMemo(() => {
    return cn(
      'fixed',
      'inset-0',
      'bg-black',
      'bg-opacity-50',
      'transition-opacity',
      'duration-300',
      isOpen ? 'opacity-100' : 'opacity-0'
    );
  }, [isOpen]);

  const modalClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'bg-white',
      'rounded-lg',
      'shadow-xl',
      'transform',
      'transition-all',
      'duration-300',
      'mx-auto',
      'my-8',
      'max-h-[calc(100vh-4rem)]',
      'overflow-hidden',
      'flex',
      'flex-col',

      // Sizes
      {
        'w-full max-w-sm': size === 'sm',
        'w-full max-w-md': size === 'md',
        'w-full max-w-lg': size === 'lg',
        'w-full max-w-xl': size === 'xl',
        'w-full h-full m-0': size === 'full',
      },

      // Animation
      isOpen
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-4',

      className
    );
  }, [isOpen, size, className]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!closeOnEsc) return;

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay */}
      <div
        className={overlayClasses}
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-50 w-full min-h-full p-4">
        <div
          ref={modalRef}
          className={modalClasses}
          tabIndex={-1}
          {...props}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2
                id="modal-title"
                className="text-lg font-medium text-gray-900"
              >
                {title}
              </h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
