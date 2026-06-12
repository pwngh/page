import React, { useState } from 'react';
import { Select } from '../../react/components/Select.jsx';

const mockData = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' }
];

export default {
  title: 'Components/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: 'A select component with support for various sizes, states, and custom styling.'
      }
    }
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  }
};

export const Default = {
  args: {
    placeholder: 'Select an option',
    label: 'Select Label',
    data: mockData,
    description: 'Helper text for the select input'
  },
  parameters: {
    layout: 'padded'
  }
};

export const Controlled = () => {
  const [value, setValue] = useState('option1');

  return (
    <Select
      value={value}
      onChange={setValue}
      data={mockData}
      label="Controlled Select"
      placeholder="Select an option"
    />
  );
};

export const Sizes = {
  render: () => (
    <div className="space-y-4">
      <Select size="sm" data={mockData} placeholder="Small" />
      <Select size="md" data={mockData} placeholder="Medium" />
      <Select size="lg" data={mockData} placeholder="Large" />
    </div>
  )
};

export const States = {
  render: () => (
    <div className="space-y-4">
      <Select
        data={mockData}
        placeholder="Default"
      />
      <Select
        data={mockData}
        placeholder="Disabled"
        disabled
      />
      <Select
        data={mockData}
        placeholder="Loading"
        loading
      />
      <Select
        data={mockData}
        placeholder="Full Width"
        fullWidth
      />
    </div>
  )
};

export const WithLabelsAndDescription = {
  args: {
    label: "Choose an option",
    description: "This is helper text for the select input",
    placeholder: "Select an option",
    data: mockData
  }
};
