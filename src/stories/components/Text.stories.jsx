import React from 'react';
import { Text } from '../../react/components/Text.jsx';

export default {
  title: 'Components/Text',
  component: Text,
  parameters: {
    docs: {
      description: {
        component: `Text component for consistent typography with configurable size, weight, and color variants.`
      }
    }
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'bold']
    },
    variant: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'success', 'error']
    }
  }
};

const Template = (args) => (
  <Text {...args}>
    The quick brown fox jumps over the lazy dog
  </Text>
);

export const Default = {
  render: Template,
  args: {
    size: 'md',
    weight: 'normal'
  }
};

export const Small = {
  render: Template,
  args: {
    size: 'sm'
  }
};

export const Large = {
  render: Template,
  args: {
    size: 'lg'
  }
};

export const Bold = {
  render: Template,
  args: {
    weight: 'bold'
  }
};

export const Primary = {
  render: Template,
  args: {
    variant: 'primary'
  }
};

export const Secondary = {
  render: Template,
  args: {
    variant: 'secondary'
  }
};

export const Success = {
  render: Template,
  args: {
    variant: 'success'
  }
};

export const Error = {
  render: Template,
  args: {
    variant: 'error'
  }
};

export const Combined = {
  render: Template,
  args: {
    size: 'lg',
    weight: 'bold',
    variant: 'primary'
  }
};
