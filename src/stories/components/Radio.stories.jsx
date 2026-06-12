import React, { useState } from 'react';
import { Radio, RadioGroup } from '../../react/components/Radio.jsx';

export default {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    docs: {
      description: {
        component: 'A radio input component with customizable size and label support.'
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
    label: {
      control: 'text'
    }
  }
};

const DefaultExample = (args) => {
  const [selected, setSelected] = useState('');
  return (
    <RadioGroup
      name="default-example"
      value={selected}
      onChange={setSelected}
    >
      <Radio {...args} />
    </RadioGroup>
  );
};

export const Default = {
  render: (args) => <DefaultExample {...args} />,
  args: {
    value: 'option1',
    label: 'Radio Option',
    size: 'md'
  },
  parameters: {
    layout: 'padded'
  }
};

// Radio group example
export const GroupRadio = () => {
  const [selected, setSelected] = useState('option1');

  return (
    <RadioGroup
      name="radio-group"
      value={selected}
      onChange={setSelected}
      className="space-y-2"
    >
      <Radio
        id="option1"
        value="option1"
        label="Option 1"
      />
      <Radio
        id="option2"
        value="option2"
        label="Option 2"
      />
      <Radio
        id="option3"
        value="option3"
        label="Option 3"
      />
    </RadioGroup>
  );
};

// Size variants
export const Sizes = () => {
  const [selected, setSelected] = useState('');

  return (
    <RadioGroup
      name="size-demo"
      value={selected}
      onChange={setSelected}
      className="space-y-4"
    >
      <Radio size="sm" label="Small Radio" value="sm" />
      <Radio size="md" label="Medium Radio" value="md" />
      <Radio size="lg" label="Large Radio" value="lg" />
    </RadioGroup>
  );
};

// Different states example
export const States = () => {
  const [selected, setSelected] = useState('checked');

  return (
    <RadioGroup
      name="states-demo"
      value={selected}
      onChange={setSelected}
      className="space-y-4"
    >
      <Radio
        label="Default Radio"
        value="default"
      />
      <Radio
        label="Initially Selected"
        value="checked"
      />
      <Radio
        label="Disabled Radio"
        value="disabled"
        disabled
      />
      <Radio
        label="Disabled & Selected"
        value="checked-disabled"
        disabled
      />
    </RadioGroup>
  );
};

// Controlled example
export const Controlled = () => {
  const [selected, setSelected] = useState('option1');

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Selected Value: {selected}</h3>
        <button
          className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          onClick={() => setSelected('option2')}
        >
          Select Option 2
        </button>
      </div>

      <RadioGroup
        name="controlled-demo"
        value={selected}
        onChange={setSelected}
        mode="controlled"
        className="space-y-2"
      >
        <Radio value="option1" label="Option 1" />
        <Radio value="option2" label="Option 2" />
        <Radio value="option3" label="Option 3" />
      </RadioGroup>
    </div>
  );
};
