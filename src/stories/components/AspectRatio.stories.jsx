import React from 'react';
import { AspectRatio } from '../../react/components/AspectRatio.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  parameters: {
    docs: {
      description: {
        component: `A component that maintains a specific aspect ratio for its content. 
        Useful for images, videos, or any content that needs to maintain proportions.`
      }
    }
  }
};

export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    ratio: 16 / 9,
    children: (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600">16:9 Aspect Ratio</span>
      </div>
    )
  },
  parameters: {
    layout: 'padded'
  }
};

export const Square = {
  args: {
    ratio: 1,
    children: (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600">1:1 Aspect Ratio</span>
      </div>
    )
  }
};

export const Portrait = {
  args: {
    ratio: 2 / 3,
    children: (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-600">2:3 Aspect Ratio</span>
      </div>
    )
  }
};
