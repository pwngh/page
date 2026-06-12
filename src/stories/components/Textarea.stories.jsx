import React, { useState } from 'react';
import { Textarea } from '../../react/components/Textarea.jsx';

export default {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: `Textarea component with configurable size, disabled state, and invalid state.`
      }
    }
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    disabled: {
      control: 'boolean'
    },
    invalid: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    }
  }
};

const Template = (args) => {
  const [value, setValue] = useState('');
  return (
    <Textarea
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default = {
  render: Template,
  args: {
    placeholder: 'Enter your text here...',
    label: 'Message'
  }
};

export const Small = {
  render: Template,
  args: {
    size: 'sm',
    placeholder: 'Small textarea',
    label: 'Small Input'
  }
};

export const Large = {
  render: Template,
  args: {
    size: 'lg',
    placeholder: 'Large textarea',
    label: 'Large Input'
  }
};

export const Disabled = {
  render: Template,
  args: {
    disabled: true,
    value: 'This textarea is disabled',
    label: 'Disabled Input'
  }
};

export const Invalid = {
  render: Template,
  args: {
    invalid: true,
    placeholder: 'Invalid input',
    label: 'Invalid Input'
  }
};

export const WithoutLabel = {
  render: Template,
  args: {
    placeholder: 'No label textarea'
  }
};

export const WithValue = {
  render: Template,
  args: {
    label: 'Pre-filled Input',
    value: 'This is some pre-filled text in the textarea.'
  }
};
