import React from 'react';
import { Paragraph } from '../../react/components/Paragraph.jsx';

export default {
  title: 'Components/Paragraph',
  component: Paragraph,
  parameters: {
    docs: {
      description: {
        component: 'A paragraph component with configurable typography, alignment, and spacing.'
      }
    }
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify']
    },
    lineHeight: {
      control: 'select',
      options: ['normal', 'relaxed', 'loose']
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary']
    }
  }
};

const sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

export const Default = {
  args: {
    children: sampleText
  },
  parameters: {
    layout: 'padded'
  }
};

export const Alignment = {
  render: () => (
    <div className="space-y-4">
      <Paragraph align="left">Left aligned: {sampleText}</Paragraph>
      <Paragraph align="center">Center aligned: {sampleText}</Paragraph>
      <Paragraph align="right">Right aligned: {sampleText}</Paragraph>
      <Paragraph align="justify">Justify aligned: {sampleText}</Paragraph>
    </div>
  )
};

export const LineHeights = {
  render: () => (
    <div className="space-y-4">
      <Paragraph lineHeight="normal">Normal line height: {sampleText}</Paragraph>
      <Paragraph lineHeight="relaxed">Relaxed line height: {sampleText}</Paragraph>
      <Paragraph lineHeight="loose">Loose line height: {sampleText}</Paragraph>
    </div>
  )
};

export const Variants = {
  render: () => (
    <div className="space-y-4">
      <Paragraph>Default variant: {sampleText}</Paragraph>
      <Paragraph variant="primary">Primary variant: {sampleText}</Paragraph>
      <Paragraph variant="secondary">Secondary variant: {sampleText}</Paragraph>
      <Paragraph lead>Lead paragraph: {sampleText}</Paragraph>
    </div>
  )
};
