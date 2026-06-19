import React from 'react';
import { resetRemixMocks } from './mocks/remix';
import './styles.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f3f4f6' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#111827' },
      ],
    },
  },
  decorators: [
    (Story) => {
      resetRemixMocks();
      return <Story />;
    },
  ],
};

export default preview;
