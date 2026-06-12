import React, { useState } from 'react';
import { fn } from '@storybook/test';
import { Stepper } from '../../react/components/Stepper.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    docs: {
      description: {
        component: 'Multi-step progress indicator component with support for vertical/horizontal layouts and linear/non-linear progression.'
      }
    }
  }
};

const defaultSteps = [
  { label: 'Account', description: 'Personal information' },
  { label: 'Address', description: 'Shipping details' },
  { label: 'Payment', description: 'Card information' },
  { label: 'Review', description: 'Order summary' }
];

export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    steps: defaultSteps,
    activeStep: 1,
    onChange: fn()
  }
};

export const Vertical = {
  args: {
    steps: defaultSteps,
    activeStep: 1,
    orientation: 'vertical',
    onChange: fn()
  }
};

export const NonLinear = {
  args: {
    steps: defaultSteps,
    activeStep: 1,
    linear: false,
    onChange: fn()
  }
};

export const WithOptionalSteps = {
  args: {
    steps: [
      { label: 'Account', description: 'Personal information' },
      { label: 'Profile', description: 'Optional details', optional: true },
      { label: 'Payment', description: 'Card information' },
      { label: 'Review', description: 'Order summary' }
    ],
    activeStep: 1,
    onChange: fn()
  }
};

export const Interactive = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-4">
      <Stepper
        steps={defaultSteps}
        activeStep={activeStep}
        onChange={setActiveStep}
      />
      <div className="flex gap-2">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          onClick={() => setActiveStep(Math.min(defaultSteps.length - 1, activeStep + 1))}
          disabled={activeStep === defaultSteps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export const Disabled = {
  args: {
    steps: defaultSteps,
    activeStep: 1,
    disabled: true,
    onChange: fn()
  }
};
