import React from 'react';
import { Grid } from '../../react/components/Grid.jsx';

const GridItem = ({ children }) => (
  <div className="bg-gray-200 p-4 rounded text-center">{children}</div>
);

export default {
  title: 'Components/Grid',
  component: Grid,
  parameters: {
    docs: {
      description: {
        component: 'A responsive grid layout component with configurable columns, gaps, and flow direction.'
      }
    }
  },
  argTypes: {
    columns: {
      control: 'select',
      options: [1, 2, 3, 4, 6, 12]
    },
    gap: {
      control: 'select',
      options: [1, 2, 4, 6, 8, 12]
    },
    flow: {
      control: 'radio',
      options: ['row', 'col', 'dense']
    }
  }
};

export const Default = {
  args: {
    columns: 3,
    gap: 4,
    children: [1, 2, 3, 4, 5, 6].map(i => (
      <GridItem key={i}>Item {i}</GridItem>
    ))
  },
  parameters: {
    layout: 'padded'
  }
};

export const Responsive = {
  args: {
    responsive: {
      sm: 2,
      md: 3,
      lg: 4
    },
    gap: 4,
    children: [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
      <GridItem key={i}>Item {i}</GridItem>
    ))
  }
};

export const DenseFlow = {
  args: {
    columns: 4,
    flow: 'dense',
    gap: 4,
    children: [1, 2, 3, 4, 5, 6].map(i => (
      <GridItem key={i}>Item {i}</GridItem>
    ))
  }
};
