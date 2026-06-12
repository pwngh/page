import React from 'react';
import { fn } from '@storybook/test';
import { Banner } from '../../react/components/Banner.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Banner',
  component: Banner,
  parameters: {
    docs: {
      description: {
        component: `A versatile Banner component.`
      }
    }
  }
};

// Base story with all variants
export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    children: 'Your settings have been successfully updated.',
    onDismiss: fn(),
  },
  parameters: {
    variant: 'success',
    showIcon: true
  }
};

// Variants
export const Variants = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Banner variant="info" showIcon>
        This is an informational message.
      </Banner>
      <Banner variant="warning" position="bottom" showIcon>
        Your subscription will expire in 3 days.
      </Banner>
      <Banner variant="error" dismissible={false} showIcon>
        There was an error processing your request.
      </Banner>
    </div>
  )
};
