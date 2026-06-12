import React from 'react';
import { fn } from '@storybook/test';
import { Checkbox } from '../../react/components/Checkbox.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `A checkbox component with support for multiple sizes, labels, and states including indeterminate.`
      }
    }
  }
};

export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    label: 'Default Checkbox',
    onChange: fn(),
  },
  parameters: {
    layout: 'padded'
  }
};

export const Sizes = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox size="sm" label="Small Checkbox" />
      <Checkbox size="md" label="Medium Checkbox" />
      <Checkbox size="lg" label="Large Checkbox" />
    </div>
  )
};

export const States = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Checked Checkbox" checked />
      <Checkbox label="Indeterminate Checkbox" indeterminate />
      <Checkbox label="Disabled Checkbox" disabled />
      <Checkbox label="Disabled Checked Checkbox" disabled checked />
    </div>
  )
};

export const NoLabel = {
  args: {
    'aria-label': 'Checkbox without visible label'
  }
};
