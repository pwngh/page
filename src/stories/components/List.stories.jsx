import React from 'react';
import { List } from '../../react/components/List.jsx';

export default {
  title: 'Components/List',
  component: List,
  parameters: {
    docs: {
      description: {
        component: 'A flexible list component supporting ordered, unordered, and custom marker variants.'
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['ordered', 'unordered', 'none']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  }
};

export const Ordered = {
  args: {
    type: 'ordered',
    children: [
      <li key="first">First item</li>,
      <li key="second">Second item</li>,
      <li key="third">Third item</li>
    ]
  },
  parameters: {
    layout: 'padded'
  }
};

export const Unordered = {
  args: {
    type: 'unordered',
    children: [
      <li key="documentation">Documentation</li>,
      <li key="components">Components</li>,
      <li key="examples">Examples</li>
    ]
  }
};

export const CustomMarker = {
  args: {
    type: 'none',
    marker: '→',
    children: [
      <li key="one">Custom marker item one</li>,
      <li key="two">Custom marker item two</li>,
      <li key="three">Custom marker item three</li>
    ]
  }
};

export const WithDividers = {
  args: {
    dividers: true,
    children: [
      <li key="one">Divided item one</li>,
      <li key="two">Divided item two</li>,
      <li key="three">Divided item three</li>
    ]
  }
};

export const Sizes = {
  render: () => (
    <div className="space-y-8">
      <List size="sm">
        <li>Small list item</li>
        <li>Small list item</li>
      </List>
      <List size="md">
        <li>Medium list item</li>
        <li>Medium list item</li>
      </List>
      <List size="lg">
        <li>Large list item</li>
        <li>Large list item</li>
      </List>
    </div>
  )
};
