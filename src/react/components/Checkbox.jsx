import React, { useMemo, useState } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render a checkbox with an optional label and indeterminate marker.
 *
 * Controlled only when `mode="controlled"` and `onChange` are both provided;
 * otherwise it manages its own state, seeded from `checked`.
 *
 * @param {import('../../shared/types.js').CheckboxProps} props
 * @param {boolean} [props.checked=false] - Checked state; the initial value in uncontrolled mode.
 * @param {boolean} [props.indeterminate=false] - Render the mixed-state marker.
 * @param {(checked: boolean) => void} [props.onChange] - Receives the next checked state.
 * @param {'controlled'|'uncontrolled'} [props.mode='uncontrolled'] - State management mode.
 */
export function Checkbox({
  size = 'md',
  disabled = false,
  checked = false,
  indeterminate = false,
  className,
  label,
  onChange,
  mode = 'uncontrolled',
  ...props
}) {
  const [internalChecked, setInternalChecked] = useState(checked);

  const isControlled = mode === "controlled" && onChange !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e) => {
    setInternalChecked(e.target.checked);
    onChange?.(e.target.checked);
  };

  const checkboxClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'inline-flex',
      'items-center',
      'justify-center',
      'transition-all',
      'duration-200',
      'select-none',

      // Sizing
      {
        'h-4 w-4': size === 'sm',
        'h-5 w-5': size === 'md',
        'h-6 w-6': size === 'lg',
      },

      // Borders & Radius
      'rounded',
      'border',
      'border-gray-300',

      // Checked & Indeterminate States
      {
        'bg-blue-600 border-transparent': isChecked || indeterminate,
        'hover:bg-blue-700': (isChecked || indeterminate) && !disabled,
      },

      // Focus
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-blue-500',

      // Disabled State
      {
        'opacity-50 cursor-not-allowed': disabled,
      },

      // Custom Classes
      className,
    );
  }, [size, disabled, isChecked, indeterminate, className]);

  const labelClasses = useMemo(() => {
    return cn(
      // Base
      'ml-2',
      'select-none',

      // Typography
      'text-gray-700',
      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },

      // Disabled State
      {
        'opacity-50 cursor-not-allowed': disabled,
      },
    );
  }, [size, disabled]);

  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        className={checkboxClasses}
        disabled={disabled}
        checked={isChecked}
        onChange={handleChange}
        {...props}
      />
      {indeterminate && (
        <span className="absolute w-2 h-2 bg-white rounded" />
      )}
      {label && <span className={labelClasses}>{label}</span>}
    </label>
  );
}
