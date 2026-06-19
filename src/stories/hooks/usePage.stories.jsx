import React, { useState } from 'react';
import { usePage } from '../../react/hooks/usePage.js';
import { withPage } from '../../../.storybook/decorators/page.jsx';

/**
 * Live demo harness for `usePage`. Reads the page from the route loader and
 * wires its CRUD helpers to buttons so you can drive the mock CMS.
 * `endpoint: '/'` aligns with the stub's root route (the default endpoint is
 * `window.location.pathname`, which is `/iframe.html` inside Storybook).
 */
function UsePageDemo() {
  const { page, components, isSubmitting, updatePage, deletePage, refreshPage } =
    usePage({ endpoint: '/' });
  const [n, setN] = useState(1);

  return (
    <div className="max-w-xl space-y-4">
      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-3 text-lg font-semibold">usePage()</h2>
        <pre className="overflow-auto rounded bg-gray-900 p-3 text-xs text-gray-100">
          {JSON.stringify(
            {
              title: page?.meta?.title,
              slug: page?.slug,
              components: components?.length ?? 0,
              isSubmitting,
            },
            null,
            2
          )}
        </pre>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => refreshPage()}
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
        >
          refreshPage()
        </button>
        <button
          type="button"
          onClick={() => {
            updatePage({ meta: { ...page?.meta, title: `Renamed page #${n}` } });
            setN((v) => v + 1);
          }}
          className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600"
        >
          updatePage(title)
        </button>
        <button
          type="button"
          onClick={() => deletePage()}
          className="rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
        >
          deletePage()
        </button>
      </div>
      <p className="text-xs text-gray-500">
        After <code>deletePage()</code> the page is gone and the loader shows the
        error card — press <strong>Reset</strong> in the bar to restore it.
      </p>
    </div>
  );
}

export default {
  title: 'Hooks/usePage',
  component: UsePageDemo,
  decorators: [withPage()],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Manages a page with streaming-aware reads and `updatePage` / ' +
          '`deletePage` / `refreshPage`. Buttons below submit the real intents ' +
          'to the route, mutating the mock CMS.',
      },
    },
  },
};

export const Default = {};
