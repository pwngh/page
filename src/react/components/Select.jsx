import { useMemo, useState, useRef, useEffect } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Render a custom dropdown select with sizing, loading, and disabled states.
 *
 * Controlled whenever value is defined; otherwise the selection is tracked
 * internally. The dropdown closes on outside clicks via a document listener.
 *
 * @param {SelectProps} props
 * @returns {React.JSX.Element}
 */
export function Select({
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  className,
  placeholder,
  label,
  description,
  data = [],
  value,
  onChange,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(null);
  const selectRef = useRef(null);

  const currentValue = value !== undefined ? value : internalValue;
  const selectedOption = data.find(item => item.value === currentValue);

  const handleOptionSelect = (optionValue) => {
    if (!disabled && !loading) {
      if (onChange) {
        onChange(optionValue);
      } else {
        setInternalValue(optionValue);
      }
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerClasses = useMemo(() => {
    return cn(
      'flex flex-col gap-1',
      fullWidth ? 'w-full' : 'w-auto'
    );
  }, [fullWidth]);

  const triggerClasses = useMemo(() => {
    return cn(
      // Base
      'relative',
      'inline-flex',
      'items-center',
      'justify-between',
      'transition-all',
      'duration-200',
      'select-none',
      'bg-white',

      // Typography
      'font-medium',
      {
        'text-sm': size === 'sm',
        'text-base': size === 'md',
        'text-lg': size === 'lg',
      },

      // Sizing & Padding
      {
        'h-8 px-3': size === 'sm',
        'h-10 px-4': size === 'md',
        'h-12 px-6': size === 'lg',
      },

      // Width
      fullWidth ? 'w-full' : 'w-auto',

      // Borders & Radius
      'rounded-md',
      'border',
      'border-gray-300',

      // States
      'hover:border-gray-400',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-blue-500',

      // Disabled & Loading States
      {
        'opacity-50 cursor-not-allowed': disabled || loading,
        'cursor-default': !(disabled || loading),
      },

      // Custom Classes
      className,
    );
  }, [size, fullWidth, disabled, loading, className]);

  const dropdownClasses = useMemo(() => {
    return cn(
      'absolute',
      'z-50',
      'mt-1',
      'bg-white',
      'border',
      'border-gray-300',
      'rounded-md',
      'shadow-lg',
      'max-h-60',
      'overflow-auto',
      fullWidth ? 'w-full' : 'min-w-[180px]',
      {
        'hidden': !isOpen,
      }
    );
  }, [isOpen, fullWidth]);

  const optionClasses = (isSelected) => cn(
    'px-4',
    'py-2',
    'cursor-pointer',
    'hover:bg-gray-100',
    {
      'bg-blue-50 text-blue-700': isSelected,
      'text-gray-900': !isSelected,
      'text-sm': size === 'sm',
      'text-base': size === 'md',
      'text-lg': size === 'lg',
    }
  );

  return (
    <div className={containerClasses} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          className={triggerClasses}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
          ) : (
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
          <svg
            viewBox="0 0 24 24"
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen ? "transform rotate-180" : ""
            )}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div className={dropdownClasses}>
          {data.map((option) => (
            <div
              key={option.value}
              className={optionClasses(option.value === currentValue)}
              onClick={() => handleOptionSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>

      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
