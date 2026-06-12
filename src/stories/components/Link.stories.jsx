import React from 'react';
import { Link } from '../../react/components/Link.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Link',
  component: Link,
  parameters: {
    docs: {
      description: {
        component: 'A link component that handles both internal and external links with various visual styles.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'subtle']
    }
  }
};

export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    href: '/dashboard',
    children: 'Dashboard Link',
    variant: 'primary'
  },
  parameters: {
    layout: 'padded'
  }
};

export const External = {
  args: {
    href: 'https://example.com',
    children: 'External Link',
    external: true
  }
};

export const Variants = {
  decorators: [withRemixMocks({})],
  render: () => (
    <div className="space-x-4">
      <Link href="#" variant="primary">Primary</Link>
      <Link href="#" variant="secondary">Secondary</Link>
      <Link href="#" variant="subtle">Subtle</Link>
    </div>
  )
};

export const States = {
  decorators: [withRemixMocks({})],
  render: () => (
    <div className="space-x-4">
      <Link href="#" underline>With Underline</Link>
      <Link href="#" disabled>Disabled Link</Link>
      <Link href="https://example.com" external>External with Icon</Link>
    </div>
  )
};
