import { createContext, useCallback, useContext, useState, useMemo } from 'react';
import { cn } from '../../shared/utils.js';

const RadioGroupContext = createContext(null);

/**
 * Group Radio components under a shared name with single-value selection.
 *
 * Selection state is shared with child Radio components via context. Uncontrolled
 * by default; pass mode='controlled' together with onChange to own the value externally.
 *
 * @param {Object} props
 * @param {string} props.name - Shared name attribute for the underlying radio inputs.
 * @param {string} [props.value] - Selected value (controlled) or initial value (uncontrolled).
 * @param {(value: string) => void} [props.onChange] - Called with the newly selected value.
 * @param {'controlled'|'uncontrolled'} [props.mode='uncontrolled'] - Who owns the selection state.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ReactNode} props.children - Radio components.
 * @returns {React.JSX.Element}
 */
export function RadioGroup({
  name,
  value: selectedValue,
  onChange,
  mode = 'uncontrolled',
  className,
  children,
  ...props
}) {
  const [internalValue, setInternalValue] = useState(selectedValue);
  const isControlled = onChange !== undefined && mode === 'controlled';
  const currentValue = isControlled ? selectedValue : internalValue;

  const handleChange = useCallback((value) => {
    if (!isControlled) {
      setInternalValue(value);
    }

    if (onChange) {
      onChange(value);
    }
  }, [isControlled, onChange]);

  const contextValue = useMemo(() => ({
    name,
    value: currentValue,
    onChange: handleChange
  }), [name, currentValue, handleChange]);

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div className={cn('flex flex-col', className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

/**
 * Render a single radio option bound to the enclosing RadioGroup.
 *
 * @param {RadioProps} props
 * @returns {React.JSX.Element}
 * @throws {Error} When rendered outside a RadioGroup.
 */
export function Radio({
  id,
  value,
  label,
  disabled = false,
  size = 'md',
  className,
  ...props
}) {
  const group = useContext(RadioGroupContext);

  if (!group) {
    throw new Error('Radio must be used within a RadioGroup');
  }

  const { name, value: selectedValue, onChange } = group;
  const isChecked = value === selectedValue;

  const handleChange = (e) => {
    if (e.target.checked) {
      onChange(value);
    }
  };

  const radioClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'inline-flex',
      'items-center',
      'cursor-pointer',

      // Sizing & Spacing
      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },
      {
        'gap-2': size === 'sm',
        'gap-3': size === 'md',
        'gap-4': size === 'lg',
      },

      // Disabled State
      {
        'opacity-50 cursor-not-allowed': disabled,
      },

      // Custom Classes
      className,
    );
  }, [size, disabled, className]);

  const inputClasses = useMemo(() => {
    return cn(
      // Base
      'appearance-none',
      'border',
      'border-gray-300',
      'rounded-full',
      'transition-colors',
      'duration-200',

      // Sizing
      {
        'w-4 h-4': size === 'sm',
        'w-5 h-5': size === 'md',
        'w-6 h-6': size === 'lg',
      },

      // Checked State
      {
        'bg-blue-600 border-transparent': isChecked,
        'bg-white': !isChecked,
      },

      // Focus
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-blue-500',
    );
  }, [size, isChecked]);

  return (
    <label htmlFor={id} className={radioClasses}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        className={inputClasses}
        {...props}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
