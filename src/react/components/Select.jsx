import { useMemo, useState, useRef, useEffect, useId } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const selectRef = useRef(null);
  const triggerRef = useRef(null);
  const optionRefs = useRef([]);

  const reactId = useId();
  const labelId = `${reactId}-label`;
  const listboxId = `${reactId}-listbox`;

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const selectedOption = data.find(item => item.value === currentValue);

  const handleOptionSelect = (optionValue) => {
    if (!disabled && !loading) {
      if (!isControlled) {
        setInternalValue(optionValue);
      }
      if (onChange) {
        onChange(optionValue);
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

  useEffect(() => {
    if (isOpen) {
      const selectedIndex = data.findIndex(item => item.value === currentValue);
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    } else {
      setActiveIndex(-1);
    }
  }, [isOpen, currentValue, data]);

  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      optionRefs.current[activeIndex]?.focus();
    }
  }, [isOpen, activeIndex]);

  const closeAndFocusTrigger = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleOptionKeyDown = (event) => {
    if (disabled || loading) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(prev => (prev + 1) % data.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => (prev - 1 + data.length) % data.length);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(data.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (data[activeIndex]) {
          handleOptionSelect(data[activeIndex].value);
        }
        triggerRef.current?.focus();
        break;
      case 'Escape':
        event.preventDefault();
        closeAndFocusTrigger();
        break;
      default:
        break;
    }
  };

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
        <label id={labelId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          ref={triggerRef}
          className={triggerClasses}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          disabled={disabled || loading}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={label ? labelId : undefined}
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
            aria-hidden="true"
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

        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          className={dropdownClasses}
        >
          {data.map((option, index) => {
            const isSelected = option.value === currentValue;
            return (
              <div
                key={option.value}
                ref={(el) => { optionRefs.current[index] = el; }}
                role="option"
                aria-selected={isSelected}
                tabIndex={activeIndex === index ? 0 : -1}
                className={optionClasses(isSelected)}
                onClick={() => handleOptionSelect(option.value)}
                onKeyDown={handleOptionKeyDown}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      </div>

      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}
