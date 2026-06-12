import React, { useState } from 'react';
import { fn } from '@storybook/test';
import { Rating } from '../../react/components/Rating.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/Rating',
  component: Rating,
  parameters: {
    docs: {
      description: {
        component: 'A 5-star rating component with support for different sizes and states.'
      }
    }
  }
};

export const Default = {
  decorators: [withRemixMocks({})],
  args: {
    value: 3,
    onChange: fn()
  }
};

export const Sizes = {
  render: () => (
    <div className="space-y-4">
      <Rating value={4} onChange={() => {}} size="sm" />
      <Rating value={4} onChange={() => {}} size="md" />
      <Rating value={4} onChange={() => {}} size="lg" />
    </div>
  )
};

export const States = {
  render: () => (
    <div className="space-y-4">
      <Rating value={3} onChange={() => {}} readonly />
      <Rating value={3} onChange={() => {}} disabled />
    </div>
  )
};

export const Interactive = () => {
  const [rating, setRating] = useState(0);
  return (
    <div className="space-y-2">
      <Rating value={rating} onChange={setRating} />
      <p className="text-sm text-gray-500">Selected rating: {rating}</p>
    </div>
  );
};
