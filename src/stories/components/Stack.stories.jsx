import React from 'react';
import { Stack } from '../../react/components/Stack.jsx';

export default {
  title: 'Components/Stack',
  component: Stack,
  parameters: {
    docs: {
      description: {
        component: `Stack component for arranging elements vertically or horizontally with consistent spacing.
          Supports different spacing sizes, wrapping, and full width options.`
      }
    }
  },
  argTypes: {
    direction: {
      control: 'radio',
      options: ['vertical', 'horizontal']
    },
    spacing: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    wrap: {
      control: 'boolean'
    },
    fullWidth: {
      control: 'boolean'
    }
  }
};

const Template = (args) => (
  <Stack {...args}>
    <div className="h-16 w-16 bg-blue-500 rounded" />
    <div className="h-16 w-16 bg-green-500 rounded" />
    <div className="h-16 w-16 bg-red-500 rounded" />
  </Stack>
);

export const Vertical = {
  render: Template,
  args: {
    direction: 'vertical',
    spacing: 'md'
  }
};

export const Horizontal = {
  render: Template,
  args: {
    direction: 'horizontal',
    spacing: 'md'
  }
};

export const WithWrap = {
  render: Template,
  args: {
    direction: 'horizontal',
    spacing: 'sm',
    wrap: true
  },
  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    )
  ]
};

export const FullWidth = {
  render: Template,
  args: {
    direction: 'horizontal',
    spacing: 'lg',
    fullWidth: true
  }
};

export const CustomSpacing = {
  render: Template,
  args: {
    direction: 'vertical',
    spacing: 'xl'
  }
};
