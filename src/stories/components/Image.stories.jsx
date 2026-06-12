import React from 'react';
import { Image } from '../../react/components/Image.jsx';

export default {
  title: 'Components/Image',
  component: Image,
  parameters: {
    docs: {
      description: {
        component: 'An image component with loading states, error handling, and responsive behavior.'
      }
    }
  },
  argTypes: {
    fit: {
      control: 'select',
      options: ['contain', 'cover', 'fill', 'none']
    },
    rounded: {
      control: 'select',
      options: [false, true, 'full']
    }
  }
};

export const Default = {
  args: {
    src: 'https://logosbynick.com/wp-content/uploads/2018/03/final-logo-example.png',
    alt: 'Example image',
    width: 400,
    height: 300,
    fit: 'cover'
  },
  parameters: {
    layout: 'padded'
  }
};

export const LazyLoaded = {
  args: {
    src: '/api/placeholder/800/600',
    alt: 'Lazy loaded image',
    width: 800,
    height: 600,
    lazy: true
  }
};

export const RoundedVariants = {
  render: () => (
    <div className="space-y-4">
      <Image
        src="/api/placeholder/200/200"
        alt="Regular corners"
        width={200}
        height={200}
      />
      <Image
        src="/api/placeholder/200/200"
        alt="Rounded corners"
        width={200}
        height={200}
        rounded
      />
      <Image
        src="/api/placeholder/200/200"
        alt="Circle"
        width={200}
        height={200}
        rounded="full"
      />
    </div>
  )
};

export const ErrorState = {
  args: {
    src: 'invalid-url.jpg',
    alt: 'Invalid image',
    width: 400,
    height: 300
  }
};
