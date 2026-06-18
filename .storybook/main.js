/**
 * @type {import('@storybook/react-webpack5').StorybookConfig}
 */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: {
          implementation: require.resolve('postcss'),
        },
      },
    },
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: true,
        viewport: true,
        toolbars: true
      }
    }
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  babel: async (options) => ({
    ...options,
    presets: [
      ['@babel/preset-react', {
        runtime: 'automatic'
      }]
    ]
  }),
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            ['@babel/preset-react', {
              runtime: 'automatic'
            }]
          ]
        }
      }]
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      os: require.resolve('os-browserify/browser'),
    };

    return config;
  },
  docs: {
    autodocs: true
  }
};

export default config;
