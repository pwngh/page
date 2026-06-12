import { Accordion } from '../../react/components/Accordion.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: 'An expandable Accordion component with customizable styling.'
      }
    }
  }
};

const accordionItems = [
  {
    id: '1',
    label: 'What is an accordion?',
    content: 'An accordion is a vertically stacked set of interactive headings that each reveal a section of content.'
  },
  {
    id: '2',
    label: 'When to use accordions?',
    content: 'Use accordions to organize related information in a limited space.'
  },
  {
    id: '3',
    label: 'Best practices',
    content: 'Keep headers short and descriptive. Ensure content is concise and focused.'
  }
];

// Base story with all variants
export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    items: accordionItems,
    multiple: false,
  },
  parameters: {
    variant: 'success',
    showIcon: true
  }
};

export const AccordionMultiple = {
  args: {
    items: accordionItems,
    multiple: true
  }
};

export const AccordionCustomStyles = {
  args: {
    items: accordionItems,
    textColor: 'text-blue-800',
    hoverColor: 'bg-blue-50',
    activeColor: 'bg-blue-100'
  }
};
