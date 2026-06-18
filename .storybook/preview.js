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
  },
  decorators: [
    (Story) => {
      resetRemixMocks();
      return <Story />;
    },
  ],
};

export default preview;
