import React from 'react';
import { Title } from '../../react/components/Title.jsx';

export default {
  title: 'Components/Title',
  component: Title,
  parameters: {
    docs: {
      description: {
        component: `Title component for consistent heading typography with configurable level, size, alignment, and styling options.`
      }
    }
  },
  argTypes: {
    level: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6]
    },
    size: {
      control: 'select',
      options: [undefined, 'sm', 'md', 'lg', 'xl']
    },
    align: {
      control: 'radio',
      options: ['left', 'center', 'right']
    },
    variant: {
      control: 'select',
      options: [undefined, 'primary', 'secondary']
    },
    serif: {
      control: 'boolean'
    }
  }
};

const Template = (args) => (
  <Title {...args}>
    The quick brown fox jumps over the lazy dog
  </Title>
);

export const Default = {
  render: Template,
  args: {
    level: 1
  }
};

export const HeadingLevels = {
  render: () => (
    <div className="space-y-4">
      <Title level={1}>Heading Level 1</Title>
      <Title level={2}>Heading Level 2</Title>
      <Title level={3}>Heading Level 3</Title>
      <Title level={4}>Heading Level 4</Title>
      <Title level={5}>Heading Level 5</Title>
      <Title level={6}>Heading Level 6</Title>
    </div>
  )
};

export const CustomSizes = {
  render: () => (
    <div className="space-y-4">
      <Title level={2} size="xl">Extra Large Size</Title>
      <Title level={2} size="lg">Large Size</Title>
      <Title level={2} size="md">Medium Size</Title>
      <Title level={2} size="sm">Small Size</Title>
    </div>
  )
};

export const Alignments = {
  render: () => (
    <div className="space-y-4">
      <Title align="left">Left Aligned</Title>
      <Title align="center">Center Aligned</Title>
      <Title align="right">Right Aligned</Title>
    </div>
  )
};

export const Variants = {
  render: () => (
    <div className="space-y-4">
      <Title>Default Variant</Title>
      <Title variant="primary">Primary Variant</Title>
      <Title variant="secondary">Secondary Variant</Title>
    </div>
  )
};

export const WithSerif = {
  render: Template,
  args: {
    serif: true,
    level: 1,
    children: 'Serif Font Title'
  }
};
