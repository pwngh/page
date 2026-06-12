import React from 'react';
import { Divider } from '../../react/components/Divider.jsx';

export default {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    docs: {
      description: {
        component: 'A versatile divider component that supports horizontal and vertical orientations with customizable styles and optional labels.'
      }
    }
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted']
    },
    weight: {
      control: 'select',
      options: ['thin', 'medium', 'thick']
    },
    labelPosition: {
      control: 'radio',
      options: ['start', 'center', 'end']
    }
  }
};

const Template = (args) => <Divider {...args} />;

export const Horizontal = Template.bind({});
Horizontal.args = {
  orientation: 'horizontal',
  variant: 'solid',
  weight: 'thin'
};

export const Vertical = Template.bind({});
Vertical.args = {
  orientation: 'vertical',
  variant: 'solid',
  weight: 'thin'
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  orientation: 'horizontal',
  variant: 'solid',
  weight: 'thin',
  label: 'Section Divider',
  labelPosition: 'center'
};

export const Dashed = Template.bind({});
Dashed.args = {
  orientation: 'horizontal',
  variant: 'dashed',
  weight: 'medium'
};

export const Thick = Template.bind({});
Thick.args = {
  orientation: 'horizontal',
  variant: 'solid',
  weight: 'thick'
};
