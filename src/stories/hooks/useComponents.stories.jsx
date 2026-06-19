import React, { useEffect } from 'react';
import { useComponents } from '../../react/hooks/useComponents.js';
import { COMPONENT_TYPES } from '../../shared/constants.js';
import { withPage } from '../../../.storybook/decorators/page.jsx';

const ADDABLE = [
  COMPONENT_TYPES.TITLE,
  COMPONENT_TYPES.PARAGRAPH,
  COMPONENT_TYPES.TEXT,
  COMPONENT_TYPES.BUTTON,
  COMPONENT_TYPES.DIVIDER,
  COMPONENT_TYPES.IMAGE,
];

/** Live demo harness for `useComponents` (page-level component collection). */
function UseComponentsDemo() {
  const { components, isSubmitting, addComponent, reorderComponents, refreshComponents } =
    useComponents('p1');

  // Components come from this hook's own fetcher — load them on mount.
  useEffect(() => {
    refreshComponents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = Array.isArray(components) ? components : [];

  const move = (index, delta) => {
    const next = [...list];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    reorderComponents(next.map((c) => c.id));
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">useComponents(&apos;p1&apos;)</h2>
          <span className="text-sm text-gray-500">
            {isSubmitting ? 'saving…' : `${list.length} components`}
          </span>
        </div>

        <ul className="divide-y divide-gray-100">
          {list.map((c, i) => (
            <li key={c.id} className="flex items-center justify-between py-2">
              <span className="font-mono text-sm">
                {c.id} <span className="text-gray-400">({c.type})</span>
              </span>
              <span className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="rounded border px-2 py-0.5 text-xs hover:bg-gray-100">
                  ↑
                </button>
                <button type="button" onClick={() => move(i, 1)} className="rounded border px-2 py-0.5 text-xs hover:bg-gray-100">
                  ↓
                </button>
              </span>
            </li>
          ))}
          {list.length === 0 && <li className="py-2 text-sm text-gray-500">No components.</li>}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {ADDABLE.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addComponent({ type })}
            className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            + {type}
          </button>
        ))}
        <button
          type="button"
          onClick={() => refreshComponents()}
          className="ml-auto rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600"
        >
          refresh
        </button>
      </div>
    </div>
  );
}

export default {
  title: 'Hooks/useComponents',
  component: UseComponentsDemo,
  decorators: [withPage()],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Manages a page's component collection with `addComponent`, " +
          '`reorderComponents`, and `bulkUpdateComponents`. Add and reorder ' +
          'below to mutate the mock CMS.',
      },
    },
  },
};

export const Default = {};
