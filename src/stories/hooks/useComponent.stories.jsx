import React, { useEffect, useState } from 'react';
import { useComponent } from '../../react/hooks/useComponent.js';
import { withPage } from '../../../.storybook/decorators/page.jsx';

/** Live demo harness for `useComponent` (a single component's CRUD). */
function UseComponentDemo() {
  const { component, isSubmitting, updateComponent, deleteComponent, refreshComponent } =
    useComponent('title-1');
  const [n, setN] = useState(1);

  // useComponent reads its own fetcher data — load on mount.
  useEffect(() => {
    refreshComponent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-xl space-y-4">
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">useComponent(&apos;title-1&apos;)</h2>
        <pre className="overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
          {JSON.stringify({ component, isSubmitting }, null, 2)}
        </pre>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => refreshComponent()}
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          refreshComponent()
        </button>
        <button
          type="button"
          onClick={() => {
            updateComponent({ content: `Edited title #${n}` });
            setN((v) => v + 1);
          }}
          className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600"
        >
          updateComponent(content)
        </button>
        <button
          type="button"
          onClick={() => deleteComponent()}
          className="rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
        >
          deleteComponent()
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Targets the seed page&apos;s <code>title-1</code>. Press <strong>Reset</strong>{' '}
        in the bar to restore deleted components.
      </p>
    </div>
  );
}

export default {
  title: 'Hooks/useComponent',
  component: UseComponentDemo,
  decorators: [withPage()],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Manages one component with streaming-aware reads and ' +
          '`updateComponent` / `deleteComponent` / `refreshComponent`.',
      },
    },
  },
};

export const Default = {};
