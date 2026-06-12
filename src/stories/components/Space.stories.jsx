import React from 'react';
import { Space } from '../../react/components/Space.jsx';

export default {
  title: 'Components/Space',
  component: Space,
  parameters: {
    docs: {
      description: {
        component: 'A utility component for managing spacing between elements.'
      }
    }
  }
};

const SpaceItem = ({ children }) => (
  <div className="bg-blue-500 text-white p-4 rounded">{children}</div>
);

export const SpaceHorizontal = {
  args: {
    h: 4,
    children: [
      <SpaceItem key="1">Item 1</SpaceItem>,
      <SpaceItem key="2">Item 2</SpaceItem>,
      <SpaceItem key="3">Item 3</SpaceItem>
    ]
  }
};

export const SpaceVertical = {
  args: {
    w: 4,
    children: [
      <SpaceItem key="1">Item 1</SpaceItem>,
      <SpaceItem key="2">Item 2</SpaceItem>,
      <SpaceItem key="3">Item 3</SpaceItem>
    ]
  }
};

export const SpaceVariants = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Space h={2}>
        <SpaceItem>Small Gap</SpaceItem>
        <SpaceItem>Horizontal</SpaceItem>
      </Space>
      <Space w={8}>
        <SpaceItem>Large Gap</SpaceItem>
        <SpaceItem>Vertical</SpaceItem>
      </Space>
    </div>
  )
};
