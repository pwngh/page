import React from 'react';
import { fn } from '@storybook/test';
import { Form } from '../../react/components/Form.jsx';
import { Button } from '../../react/components/Button.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix.jsx';

const mockFormFields = (
  <>
    <input type="text" name="name" placeholder="Name" className="border p-2 rounded" />
    <input type="email" name="email" placeholder="Email" className="border p-2 rounded" />
    <Button type="submit">Submit</Button>
  </>
);

export default {
  title: 'Components/Form',
  decorators: [withRemixMocks({})],
  component: Form,
  parameters: {
    docs: {
      description: {
        component: 'A form component that handles both Remix and standard HTML form submissions with consistent styling.'
      }
    }
  },
  argTypes: {
    method: {
      control: 'select',
      options: ['get', 'post', 'put', 'patch', 'delete']
    },
    target: {
      control: 'select',
      options: ['_self', '_blank', '_parent', '_top']
    }
  }
};

export const RemixForm = {
  args: {
    action: '/submit',
    method: 'post',
    children: mockFormFields,
    onSubmit: fn((e) => e.preventDefault())
  },
  parameters: {
    layout: 'padded'
  }
};

export const ExternalForm = {
  args: {
    action: 'https://api.example.com/submit',
    method: 'post',
    children: mockFormFields,
    target: '_self'
  },
  parameters: {
    layout: 'padded'
  }
};

export const ValidatedForm = {
  args: {
    action: '/submit',
    method: 'post',
    noValidate: false,
    children: mockFormFields
  },
  parameters: {
    layout: 'padded'
  }
};
