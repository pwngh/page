import React from 'react';
import { createRemixStub } from '@remix-run/testing';

const mockState = {
  loaderData: null,
  actionData: null,
  navigationState: 'idle',
};

export const withRemixMocks = (mockData = {}) => function WithRemixMocks(Story) {
  mockState.loaderData = mockData;

  const RemixStub = createRemixStub([
    {
      id: 'root',
      path: '/',
      element: <Story/>,
      loader: () => mockState.loaderData,
    },
  ]);

  return <RemixStub/>;
};

export const resetRemixMocks = () => {
  mockState.loaderData = null;
  mockState.actionData = null;
  mockState.navigationState = 'idle';
};

export const setNavigationState = (state) => {
  mockState.navigationState = state;
};

export const setActionData = (data) => {
  mockState.actionData = data;
};
