import { fn } from '@storybook/test';
import { MegaMenu } from '../../react/components/MegaMenu.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

const menuItems = [
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    children: [
      {
        id: 'software',
        label: 'Software',
        children: [
          { id: 'web-apps', label: 'Web Applications', href: '/products/web' },
          { id: 'mobile-apps', label: 'Mobile Applications', href: '/products/mobile' },
          {
            id: 'github',
            label: 'GitHub Repository',
            href: 'https://github.com/example/repo'
          }
        ]
      },
      // ... rest of the menu items structure
    ]
  },
  // ... other top-level items
];

export default {
  title: 'Components/MegaMenu',
  component: MegaMenu,
  parameters: {
    docs: {
      description: {
        component: `A versatile MegaMenu component.`
      }
    }
  }
};

// Base story with all variants
export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    items: menuItems,
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    hoverColor: 'bg-gray-50',
    selectedColor: 'text-blue-600',
    activeColor: 'bg-gray-100',
    showIcon: true,
    onSelect: fn(),
  },
  parameters: {
    layout: 'padded'
  }
};
