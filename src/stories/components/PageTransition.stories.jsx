import React from 'react';
import { PageTransition } from '../../react/components/PageTransition.jsx';
import { withRemixMocks } from '../../../.storybook/mocks/remix';

export default {
  title: 'Components/PageTransition',
  component: PageTransition,
  decorators: [withRemixMocks({})],
  parameters: {
    docs: {
      description: {
        component: 'A wrapper component that provides page transition animations between route changes'
      }
    }
  }
};

const ExampleContent = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold">Example Page Content</h1>
    <p className="text-gray-600">
      This is an example of content that will be animated during page transitions.
    </p>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-blue-100 p-4 rounded">Panel 1</div>
      <div className="bg-blue-100 p-4 rounded">Panel 2</div>
    </div>
  </div>
);

export const Default = {
  args: {
    children: <ExampleContent />
  }
};

export const CustomTransitionName = {
  args: {
    transitionName: 'custom-page',
    children: <ExampleContent />
  }
};

export const WithCustomStyles = {
  args: {
    children: <ExampleContent />,
    style: {
      backgroundColor: '#f8fafc',
      padding: '2rem',
      borderRadius: '0.5rem'
    }
  }
};

export const NestedContent = {
  render: () => (
    <PageTransition>
      <div className="space-y-8">
        <PageTransition transitionName="header">
          <header className="bg-blue-500 text-white p-4 rounded">
            <h1 className="text-xl">Header Section</h1>
          </header>
        </PageTransition>

        <PageTransition transitionName="main">
          <main className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Main Content</h2>
            <p>This section has its own transition.</p>
          </main>
        </PageTransition>

        <PageTransition transitionName="footer">
          <footer className="bg-gray-100 p-4 rounded">
            <p className="text-sm">Footer Section</p>
          </footer>
        </PageTransition>
      </div>
    </PageTransition>
  )
};
