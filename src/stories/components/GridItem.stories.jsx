import React from 'react';
import { Grid } from '../../react/components/Grid.jsx';
import { GridItem } from '../../react/components/GridItem.jsx';

export default {
  title: 'Components/GridItem',
  component: GridItem,
  parameters: {
    docs: {
      description: {
        component: 'A grid item component for use within Grid that supports column spanning and responsive behavior.'
      }
    }
  },
  argTypes: {
    span: {
      control: 'select',
      options: [1, 2, 3, 4, 6, 12]
    },
    start: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6]
    }
  }
};

const Item = ({ children, ...props }) => (
  <GridItem {...props}>
    <div className="bg-gray-200 p-4 rounded text-center">{children}</div>
  </GridItem>
);

export const Default = {
  render: () => (
    <Grid columns={12} gap={4}>
      <Item span={4}>Span 4</Item>
      <Item span={8}>Span 8</Item>
      <Item span={6}>Span 6</Item>
      <Item span={6}>Span 6</Item>
    </Grid>
  ),
  parameters: {
    layout: 'padded'
  }
};

export const WithStart = {
  render: () => (
    <Grid columns={12} gap={4}>
      <Item span={4} start={1}>Start 1</Item>
      <Item span={4} start={6}>Start 6</Item>
      <Item span={6} start={4}>Start 4</Item>
    </Grid>
  )
};

export const Responsive = {
  render: () => (
    <Grid columns={12} gap={4}>
      <Item responsive={{ sm: 2, md: 4, lg: 6 }}>Responsive Item</Item>
      <Item responsive={{ sm: 2, md: 4, lg: 6 }}>Responsive Item</Item>
      <Item span={12}>Full Width</Item>
    </Grid>
  )
};
