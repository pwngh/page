import React from 'react';
import { Container } from '../../react/components/Container.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Container',
  component: Container,
  parameters: {
    docs: {
      description: {
        component: `A container component for consistent content width and spacing with responsive padding and max-width constraints.`
      }
    }
  }
};

const DemoContent = ({ bgColor = 'bg-blue-100' }) => (
  <div className={`${bgColor} p-4 text-center rounded`}>
    Content
  </div>
);

export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    children: <DemoContent />,
  },
  parameters: {
    layout: 'padded'
  }
};

export const MaxWidths = {
  render: () => (
    <div className="space-y-4">
      <Container maxWidth="sm"><DemoContent bgColor="bg-red-100" /></Container>
      <Container maxWidth="md"><DemoContent bgColor="bg-yellow-100" /></Container>
      <Container maxWidth="lg"><DemoContent bgColor="bg-green-100" /></Container>
      <Container maxWidth="xl"><DemoContent bgColor="bg-blue-100" /></Container>
      <Container maxWidth="full"><DemoContent bgColor="bg-purple-100" /></Container>
    </div>
  )
};

export const Spacing = {
  render: () => (
    <div className="space-y-4 bg-gray-100">
      <Container space="none"><DemoContent /></Container>
      <Container space="sm"><DemoContent /></Container>
      <Container space="md"><DemoContent /></Container>
      <Container space="lg"><DemoContent /></Container>
    </div>
  )
};

export const CustomPadding = {
  args: {
    padding: 'p-8',
    children: <DemoContent />
  }
};
