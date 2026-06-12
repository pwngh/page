import React from 'react';
import { fn } from '@storybook/test';
import { Toggle } from '../../react/components/Toggle.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    docs: {
      description: {
        component: 'A toggle/switch component with support for labels, different sizes, and states.'
      }
    }
  }
};

export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    checked: false,
    onChange: fn(),
    label: 'Toggle me'
  }
};

export const Sizes = {
  render: () => (
    <div className="space-y-4">
      <Toggle size="sm" label="Small toggle" checked={false} onChange={() => {}} />
      <Toggle size="md" label="Medium toggle" checked={false} onChange={() => {}} />
      <Toggle size="lg" label="Large toggle" checked={false} onChange={() => {}} />
    </div>
  )
};

export const States = {
  render: () => (
    <div className="space-y-4">
      <Toggle label="Default" checked={false} onChange={() => {}} />
      <Toggle label="Checked" checked={true} onChange={() => {}} />
      <Toggle label="Disabled" disabled checked={false} onChange={() => {}} />
      <Toggle label="Disabled & Checked" disabled checked={true} onChange={() => {}} />
    </div>
  )
};

export const NoLabel = {
  args: {
    checked: false,
    onChange: () => {}
  }
};

export const Controlled = () => {
  const [checked, setChecked] = React.useState(false);
  return (
    <Toggle
      checked={checked}
      onChange={setChecked}
      label={`Toggle is ${checked ? 'on' : 'off'}`}
    />
  );
};
