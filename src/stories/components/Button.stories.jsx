import React from 'react';
import { fn } from '@storybook/test';
import { Button } from '../../react/components/Button.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `A versatile button component supporting multiple variants, sizes, and states. 
        Includes proper focus states, loading indicators, and full width options.`
      }
    }
  }
};

// Base story with all variants
export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    children: 'Button',
    onClick: fn(),
  },
  parameters: {
    layout: 'padded',
    size: 'sm'
  }
};

// Variants
export const Variants = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
    </div>
  )
};

// Sizes
export const Sizes = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
};

// States
export const States = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button disabled>Disabled Button</Button>
      <Button loading>Loading Button</Button>
      <Button fullWidth>Full Width Button</Button>
    </div>
  )
};

// With Icon
export const WithIcon = {
  render: () => (
    <Button>
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add Item
    </Button>
  )
};
