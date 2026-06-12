import React from 'react';
import { Section, SectionHeader } from '../../react/components/Section.jsx';
import { Button } from '../../react/components/Button.jsx';

export default {
  title: 'Components/Section',
  component: Section,
  parameters: {
    docs: {
      description: {
        component: 'A section component for page layout with customizable backgrounds, spacing, and width constraints.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'dark']
    },
    space: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg']
    },
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full']
    }
  }
};

const ExampleContent = ({ inverted }) => (
  <>
    <SectionHeader
      title="Section Title"
      subtitle="Optional section subtitle with supporting text"
      action={<Button variant={inverted ? 'white' : 'primary'}>Action</Button>}
    />
    <p className="text-lg">
      This is example content within the section. It demonstrates how content
      appears with different section variants and spacing options.
    </p>
  </>
);

export const Default = {
  args: {
    children: <ExampleContent />,
    variant: 'default',
    space: 'md'
  },
  parameters: {
    layout: 'padded'
  }
};

export const Variants = {
  render: () => (
    <div className="space-y-8">
      <Section variant="default">
        <ExampleContent />
      </Section>
      <Section variant="secondary">
        <ExampleContent />
      </Section>
      <Section variant="primary">
        <ExampleContent inverted />
      </Section>
      <Section variant="dark">
        <ExampleContent inverted />
      </Section>
    </div>
  )
};

export const Spacing = {
  render: () => (
    <div className="space-y-4 bg-gray-100">
      <Section space="none" variant="default">
        <ExampleContent />
      </Section>
      <Section space="sm" variant="default">
        <ExampleContent />
      </Section>
      <Section space="md" variant="default">
        <ExampleContent />
      </Section>
      <Section space="lg" variant="default">
        <ExampleContent />
      </Section>
    </div>
  )
};

export const WithDivider = {
  render: () => (
    <>
      <Section divider>
        <ExampleContent />
      </Section>
      <Section>
        <ExampleContent />
      </Section>
    </>
  )
};

export const MaxWidth = {
  render: () => (
    <div className="space-y-8">
      <Section maxWidth="sm">
        <ExampleContent />
      </Section>
      <Section maxWidth="xl">
        <ExampleContent />
      </Section>
      <Section maxWidth="full">
        <ExampleContent />
      </Section>
    </div>
  )
};
