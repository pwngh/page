import React, { useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { ComponentRenderer } from '../react/components/ComponentRenderer.jsx';
import { usePage } from '../react/hooks/usePage.js';
import { useComponents } from '../react/hooks/useComponents.js';
import { COMPONENT_TYPES } from '../shared/constants.js';
import { withPage } from '../../.storybook/decorators/page.jsx';

const ADDABLE = [
  COMPONENT_TYPES.TITLE,
  COMPONENT_TYPES.PARAGRAPH,
  COMPONENT_TYPES.TEXT,
  COMPONENT_TYPES.BUTTON,
  COMPONENT_TYPES.DIVIDER,
  COMPONENT_TYPES.IMAGE,
];

/**
 * A live page editor wired end-to-end to the mock CMS: the left column renders
 * the page with `ComponentRenderer`; the right column edits it through
 * `usePage` (meta + delete) and `useComponents` (add + reorder), plus a
 * per-row delete. Every change mutates the store and revalidates, so the
 * preview updates in place. The data-layer analog of hilink's Dashboard.
 */
function PageAdmin() {
  const { page, isSubmitting, updatePage, deletePage } = usePage({ endpoint: '/' });
  const { addComponent, reorderComponents } = useComponents('p1');
  const removeFetcher = useFetcher();
  const [draftTitle, setDraftTitle] = useState(null);

  if (!page) {
    return <div className="p-6 text-gray-500">No page loaded.</div>;
  }

  const components = page.components || [];
  const title = draftTitle ?? page.meta?.title ?? '';

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= components.length) return;
    const ids = components.map((c) => c.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorderComponents(ids);
  };

  const remove = (id) =>
    removeFetcher.submit(null, { method: 'DELETE', action: `/components/${id}` });

  return (
    <div className="p-2">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Page Admin</h1>
        <span className="text-sm text-gray-500">{isSubmitting ? 'saving…' : 'ready'}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Live preview */}
        <div className="min-h-[300px] rounded-lg border border-gray-200 bg-white p-6">
          <ComponentRenderer data={page} />
        </div>

        {/* Editor */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Page meta</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
              />
              <button
                type="button"
                onClick={() => updatePage({ meta: { ...page.meta, title } })}
                className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => deletePage()}
                className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete page
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Components</h3>
            <ul className="mb-3 divide-y divide-gray-100">
              {components.map((c, i) => (
                <li key={c.id} className="flex items-center justify-between py-2">
                  <span className="font-mono text-sm">
                    {c.id} <span className="text-gray-400">({c.type})</span>
                  </span>
                  <span className="flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} className="rounded border px-2 py-0.5 text-xs hover:bg-gray-100">↑</button>
                    <button type="button" onClick={() => move(i, 1)} className="rounded border px-2 py-0.5 text-xs hover:bg-gray-100">↓</button>
                    <button type="button" onClick={() => remove(c.id)} className="rounded border border-red-200 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50">✕</button>
                  </span>
                </li>
              ))}
              {components.length === 0 && <li className="py-2 text-sm text-gray-500">No components — add one below.</li>}
            </ul>
            <div className="flex flex-wrap gap-2">
              {ADDABLE.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addComponent({ type })}
                  className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
                >
                  + {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default {
  title: 'Page/Admin',
  component: PageAdmin,
  decorators: [withPage()],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A live page editor composed from `ComponentRenderer`, `usePage`, and ' +
          '`useComponents`. Add, reorder, remove, rename, and delete — every ' +
          'change runs through the route actions and revalidates the preview. ' +
          'Drive the backend with the bar (mock scenario or a real server URL).',
      },
    },
  },
};

export const Default = {};
