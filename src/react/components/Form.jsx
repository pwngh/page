import React, { useMemo, useState } from 'react';
import { Form as RemixForm } from '@remix-run/react';
import { cn } from '../../shared/utils.js';

/**
 * Wrap Remix's Form with shared state for its named children.
 *
 * Direct children with a `name` prop are cloned with `value` and `onChange`
 * wired to the form's state object; a child's own props take precedence.
 * Controlled only when `mode="controlled"` and `onChange` are both provided —
 * the parent then owns `formData` and receives every change.
 *
 * @param {import('../../shared/types.js').FormProps} props
 * @param {Object} [props.formData] - Form state when controlled; the initial state otherwise.
 * @param {(data: Object) => void} [props.onChange] - Receives the full updated form state on every field change.
 * @param {'controlled'|'uncontrolled'} [props.mode='uncontrolled'] - State management mode.
 * @param {string} [props.action='.'] - Remix action the form submits to.
 */
export function Form({
  children,
  className,
  action = '.',
  method = 'post',
  replace = false,
  preventScrollReset = false,
  relative,
  formData,
  onChange,
  mode = 'uncontrolled',
  ...props
}) {
  const [internalState, setInternalState] = useState(formData || {});
  const isControlled = onChange !== undefined && mode === 'controlled';
  const currentData = isControlled ? formData : internalState;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    const updatedData = {
      ...currentData,
      [name]: newValue,
    };

    if (!isControlled) {
      setInternalState(updatedData);
    }

    if (onChange) {
      onChange(updatedData);
    }
  };

  const formClasses = useMemo(() => {
    return cn(
      'flex flex-col space-y-4',
      'border border-gray-300 rounded-md',
      'p-4',
      className
    );
  }, [className]);

  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.props.name) {
      return React.cloneElement(child, {
        value: currentData[child.props.name] || '',
        onChange: handleChange,
        ...child.props,
      });
    }
    return child;
  });

  return (
    <RemixForm
      className={formClasses}
      action={action}
      method={method}
      replace={replace}
      preventScrollReset={preventScrollReset}
      relative={relative}
      onChange={handleChange}
      {...props}
    >
      {enhancedChildren}
    </RemixForm>
  );
}
