import { Icon } from '../../react/components/Icon.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: `A versatile Icon component.`
      }
    }
  }
};

export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    name: 'arrow',
  },
  parameters: {
    layout: 'padded'
  }
};
