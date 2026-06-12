import { useMemo } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render an accessible on/off switch with an optional inline label.
 *
 * @param {ToggleProps} props
 * @returns {React.JSX.Element}
 */
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
  ...props
}) {
  const toggleClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'inline-flex',
      'flex-shrink-0',
      'cursor-pointer',
      'rounded-full',
      'transition-colors',
      'duration-200',
      'ease-in-out',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-2',

      // Sizing
      {
        'h-5 w-9': size === 'sm',
        'h-6 w-11': size === 'md',
        'h-7 w-14': size === 'lg',
      },

      // Colors
      checked ? 'bg-blue-600' : 'bg-gray-200',

      // Disabled state
      disabled && 'opacity-50 cursor-not-allowed',

      className
    );
  }, [checked, size, disabled, className]);

  const knobClasses = useMemo(() => {
    return cn(
      // Base
      'pointer-events-none',
      'inline-block',
      'rounded-full',
      'bg-white',
      'shadow',
      'transform',
      'ring-0',
      'transition-transform',
      'duration-200',
      'ease-in-out',

      // Sizing
      {
        'h-4 w-4': size === 'sm',
        'h-5 w-5': size === 'md',
        'h-6 w-6': size === 'lg',
      },

      // Position based on state
      checked ? 'translate-x-full' : 'translate-x-0'
    );
  }, [checked, size]);

  const labelClasses = useMemo(() => {
    return cn(
      'ml-3',
      'select-none',
      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },
      disabled ? 'text-gray-400' : 'text-gray-900'
    );
  }, [size, disabled]);

  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label className="inline-flex items-center">
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        className={toggleClasses}
        onClick={handleChange}
        {...props}
      >
        <span className="sr-only">{label}</span>
        <span
          className={knobClasses}
          style={{
            marginLeft: '2px',
            marginTop: '2px'
          }}
        />
      </button>
      {label && (
        <span className={labelClasses}>
          {label}
        </span>
      )}
    </label>
  );
}
