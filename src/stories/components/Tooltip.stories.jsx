import React from 'react';
import { Tooltip } from '../../react/components/Tooltip.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component: 'A tooltip component that appears on hover/focus with support for multiple placements and delays.'
      }
    }
  }
};

export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    content: 'Tooltip content',
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover me</button>
  },
  parameters: {
    layout: 'centered'
  }
};

export const Placements = {
  render: () => (
    <div className="flex items-center justify-center gap-8 h-64">
      <Tooltip content="Top tooltip" placement="top">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Top</button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Right</button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Bottom</button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Left</button>
      </Tooltip>
    </div>
  )
};

export const WithDelay = {
  args: {
    content: 'Delayed tooltip',
    delay: 500,
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Hover with delay</button>
  }
};

export const Disabled = {
  args: {
    content: 'Disabled tooltip',
    disabled: true,
    children: <button className="px-4 py-2 bg-gray-500 text-white rounded">Disabled</button>
  }
};

export const WithRichContent = {
  args: {
    content: (
      <div className="p-2">
        <h3 className="font-bold mb-1">Rich Content</h3>
        <p className="text-sm">Tooltips can contain complex content</p>
      </div>
    ),
    children: <button className="px-4 py-2 bg-blue-500 text-white rounded">Rich tooltip</button>
  }
};
