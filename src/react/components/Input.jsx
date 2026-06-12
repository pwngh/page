import React, { useMemo, useState } from 'react';
import { cn } from '../../shared/utils.js';

/**
 * Per-type input attributes (input mode, autocomplete, masking constraints)
 * merged onto the underlying input element.
 * @type {Object.<string, Object>}
 */
const TYPE_CONFIG = {
  // Standard HTML types remain unchanged
  text: {},
  email: {
    inputMode: 'email',
    autoCapitalize: 'off',
    autoComplete: 'email'
  },
  password: {
    autoComplete: 'current-password'
  },
  number: {
    inputMode: 'numeric',
    pattern: '[0-9]*'
  },
  tel: {
    inputMode: 'tel',
    autoComplete: 'tel'
  },
  url: {
    inputMode: 'url',
    autoComplete: 'url'
  },
  search: {
    role: 'searchbox'
  },

  // Address types
  'address-street': {
    type: 'text',
    autoComplete: 'street-address'
  },
  'address-city': {
    type: 'text',
    autoComplete: 'address-level2'
  },
  'address-state': {
    type: 'text',
    autoComplete: 'address-level1',
    maxLength: 2,
    pattern: '[A-Za-z]{2}'
  },
  'address-county': {
    type: 'text',
    autoComplete: 'address-level3'
  },

  // Payment types
  'card-number': {
    type: 'text',
    inputMode: 'numeric',
    autoComplete: 'cc-number',
    maxLength: 19,
    pattern: '[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}'
  },
  'card-expiration': {
    type: 'text',
    inputMode: 'numeric',
    autoComplete: 'cc-exp',
    maxLength: 5,
    placeholder: 'MM/YY',
    pattern: '(0[1-9]|1[0-2])/([0-9]{2})'
  },
  'card-cvv': {
    type: 'text',
    inputMode: 'numeric',
    autoComplete: 'cc-csc',
    maxLength: 4,
    pattern: '[0-9]{3,4}'
  },

  // Banking types
  'bank-account': {
    type: 'text',
    inputMode: 'numeric',
    autoComplete: 'off',
    pattern: '[0-9]{4,17}'
  },
  'bank-routing': {
    type: 'text',
    inputMode: 'numeric',
    autoComplete: 'off',
    maxLength: 9,
    pattern: '[0-9]{9}'
  },

  // Special types
  signature: {
    type: 'text',
    autoComplete: 'off',
    spellCheck: false
  },
  dollar: {
    type: 'text',
    inputMode: 'decimal',
    pattern: '\\d*\\.?\\d{0,2}',
    placeholder: '0.00'
  }
};

/**
 * Per-type `format` (input masking) and `validate` (returns an error message,
 * or '' when valid) rules applied on every change.
 */
const VALIDATION_RULES = {
  // Standard HTML types
  email: {
    format: (value) => value.trim().toLowerCase(),
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? '' : 'Invalid email address';
    }
  },
  password: {
    format: (value) => value,
    validate: (value) => {
      if (value.length < 8) return 'Password must be at least 8 characters';
      return '';
    }
  },
  number: {
    format: (value) => value.replace(/[^\d]/g, ''),
    validate: (value) => /^\d+$/.test(value) ? '' : 'Must contain only digits'
  },
  tel: {
    format: (value) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0,3)}-${digits.slice(3)}`;
      return `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6,10)}`;
    },
    validate: (value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length === 10 ? '' : 'Phone number must be 10 digits';
    }
  },
  url: {
    format: (value) => value.trim(),
    validate: (value) => {
      try {
        new URL(value);
        return '';
      } catch {
        return 'Invalid URL';
      }
    }
  },

  // Address types
  'address-street': {
    format: (value) => value.trim(),
    validate: (value) => value.length > 0 ? '' : 'Street address is required'
  },
  'address-city': {
    format: (value) => value.trim(),
    validate: (value) => value.length > 0 ? '' : 'City is required'
  },
  'address-state': {
    format: (value) => value.trim().toUpperCase(),
    validate: (value) => {
      const stateRegex = /^[A-Z]{2}$/;
      return stateRegex.test(value) ? '' : 'Must be 2-letter state code';
    }
  },
  'address-county': {
    format: (value) => value.trim(),
    validate: (value) => value.length > 0 ? '' : 'County is required'
  },

  // Payment types
  'card-number': {
    format: (value) => {
      const digits = value.replace(/\D/g, '');
      return digits.replace(/(\d{4})/g, '$1 ').trim();
    },
    validate: (value) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 16) return 'Card number must be 16 digits';

      // Luhn algorithm for card number validation
      let sum = 0;
      let isEven = false;

      for (let i = digits.length - 1; i >= 0; i--) {
        let num = parseInt(digits[i]);

        if (isEven) {
          num *= 2;
          if (num > 9) num -= 9;
        }

        sum += num;
        isEven = !isEven;
      }

      return sum % 10 === 0 ? '' : 'Invalid card number';
    }
  },
  'card-expiration': {
    format: (value) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length >= 2) {
        return `${digits.slice(0,2)}/${digits.slice(2,4)}`;
      }
      return digits;
    },
    validate: (value) => {
      const [month, year] = value.split('/');
      if (!month || !year) return 'Invalid format (MM/YY)';

      const monthNum = parseInt(month);
      const yearNum = parseInt('20' + year);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (monthNum < 1 || monthNum > 12) return 'Invalid month';
      if (yearNum < currentYear) return 'Card has expired';
      if (yearNum === currentYear && monthNum < currentMonth) return 'Card has expired';

      return '';
    }
  },
  'card-cvv': {
    format: (value) => value.replace(/\D/g, '').slice(0, 4),
    validate: (value) => {
      const digits = value.replace(/\D/g, '');
      return (digits.length >= 3 && digits.length <= 4) ? '' : 'CVV must be 3-4 digits';
    }
  },

  // Banking types
  'bank-account': {
    format: (value) => value.replace(/\D/g, ''),
    validate: (value) => {
      const digits = value.replace(/\D/g, '');
      return (digits.length >= 4 && digits.length <= 17) ? '' : 'Account number must be 4-17 digits';
    }
  },
  'bank-routing': {
    format: (value) => value.replace(/\D/g, ''),
    validate: (value) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 9) return 'Routing number must be 9 digits';

      // Routing number validation algorithm
      let sum = 0;
      for (let i = 0; i < digits.length; i++) {
        sum += parseInt(digits[i]) * [7, 3, 9, 7, 3, 9, 7, 3, 9][i];
      }
      return sum % 10 === 0 ? '' : 'Invalid routing number';
    }
  },

  // Special types
  signature: {
    format: (value) => value.trim(),
    validate: (value) => value.length > 0 ? '' : 'Signature is required'
  },
  dollar: {
    format: (value) => {
      const cleaned = value.replace(/[^\d.]/g, '');
      const parts = cleaned.split('.');
      if (parts.length > 2) return parts[0] + '.' + parts[1];
      if (parts[1]) parts[1] = parts[1].slice(0, 2);
      return parts.join('.');
    },
    validate: (value) => {
      if (!/^\d*\.?\d{0,2}$/.test(value)) return 'Invalid dollar amount';
      if (parseFloat(value) > 999999999.99) return 'Amount too large';
      return '';
    }
  }
};

/** Pass-through rule for types without dedicated formatting or validation. */
const defaultRule = {
  format: (value) => value,
  validate: () => ''
};

/**
 * Render a labeled input with per-type formatting, validation, and error display.
 *
 * Beyond the standard HTML types, domain types (address-*, card-*, bank-*,
 * signature, dollar) add input modes, autocomplete hints, masking, and
 * validators such as the Luhn check for card numbers. `onChange` receives a
 * synthetic event whose `target.value` is the formatted value and
 * `target.error` the current validation message ('' when valid).
 *
 * @param {import('../../shared/types.js').InputProps} props
 * @param {string} props.name - Field name; also derives the input id and label association.
 * @param {string} [props.type='text'] - HTML or domain input type; see TYPE_CONFIG for the full list.
 * @param {'controlled'|'uncontrolled'} [props.mode='uncontrolled'] - Controlled mode renders `value` and `error` from props instead of internal state.
 * @param {string} [props.error] - External validation message, shown in controlled mode.
 * @param {string} [props.helper] - Helper text shown when there is no error.
 */
export function Input({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  error: propError,
  helper,
  className,
  onChange,
  value: propValue,
  mode = 'uncontrolled',
  ...props
}) {
  const [internalValue, setInternalValue] = useState('');
  const [internalError, setInternalError] = useState('');

  const value = mode === 'controlled' ? propValue : internalValue;
  const error = mode === 'controlled' ? propError : internalError;

  const inputClasses = useMemo(() => {
    return cn(
      'p-2',
      'block',
      'w-full',
      'transition-all',
      'duration-200',
      'rounded-md',
      'shadow-sm',
      'sm:text-sm',
      'focus:ring-2',
      'focus:ring-offset-0',
      'focus:outline-none',
      disabled && [
        'bg-gray-50',
        'cursor-not-allowed',
      ],
      readOnly && [
        'bg-gray-50',
        'cursor-default',
      ],
      {
        'border-gray-300 focus:border-blue-500 focus:ring-blue-500':
          !propError && !disabled && !readOnly,
        'border-red-300 focus:border-red-500 focus:ring-red-500':
          propError && !disabled && !readOnly,
        'border-gray-200': disabled || readOnly,
      },
      className
    );
  }, [propError, disabled, readOnly, className]);

  const handleChange = (e) => {
    const rule = VALIDATION_RULES[type] || defaultRule;
    const formattedValue = rule.format(e.target.value);
    const validationError = required && !formattedValue ? 'This field is required' : rule.validate(formattedValue);

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue,
        error: validationError
      }
    };

    if (mode === 'uncontrolled') {
      setInternalValue(formattedValue);
      setInternalError(validationError);
    }

    onChange?.(syntheticEvent);
  };

  const id = `input-${name}`;
  const typeProps = TYPE_CONFIG[type] || {};

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            'block',
            'text-sm',
            'font-medium',
            'mb-1',
            disabled || readOnly ? 'text-gray-500' : 'text-gray-700'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={id}
        name={name}
        type={typeProps.type || type}
        placeholder={placeholder || typeProps.placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        className={inputClasses}
        onChange={handleChange}
        value={value}
        {...typeProps}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {!error && helper && (
        <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500">
          {helper}
        </p>
      )}
    </div>
  );
}
