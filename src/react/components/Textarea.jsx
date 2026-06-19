import { useMemo, useId } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render a styled textarea with size, disabled, and invalid states.
 *
 * @param {TextareaProps} props
 * @returns {React.JSX.Element}
 */
export function Textarea({
  size = 'md',
  disabled = false,
  invalid = false,
  className,
  label,
  value,
  onChange,
  id,
  ...props
}) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  const textareaClasses = useMemo(() => {
    return cn(
      // Base
      'block',
      'w-full',
      'px-3',
      'py-2',
      'border',
      'border-gray-300',
      'rounded-md',
      'shadow-sm',
      'focus:outline-none',
      'focus:ring-blue-500',
      'focus:border-blue-500',
      'transition',
      'duration-150',
      'ease-in-out',

      // Size Variants
      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },

      // Disabled State
      {
        'bg-gray-100': disabled,
        'cursor-not-allowed': disabled,
      },

      // Invalid State
      {
        'border-red-500': invalid,
        'focus:ring-red-500': invalid,
        'focus:border-red-500': invalid,
      },

      // Custom Classes
      className,
    );
  }, [size, disabled, invalid, className]);

  return (
    <div>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={textareaClasses}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}
