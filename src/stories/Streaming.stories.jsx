import React, { useMemo, useRef, useState } from 'react';
import { createRemixStub } from '@remix-run/testing';
import { ComponentRenderer } from '../react/components/ComponentRenderer.jsx';
import { COMPONENT_TYPES } from '../shared/constants.js';

/** A small page the demo streams in after a delay. */
const DEMO_COMPONENTS = [
  { id: 'title-1', type: COMPONENT_TYPES.TITLE, content: 'Streamed in just now', props: { size: 'xl' } },
  {
    id: 'paragraph-1',
    type: COMPONENT_TYPES.PARAGRAPH,
    content:
      'ComponentRenderer accepts a deferred promise as `data.components`. Until ' +
      'it resolves, each boundary shows a delayed skeleton — no flash on fast loads.',
    props: { size: 'md' },
  },
  {
    id: 'grid-1',
    type: COMPONENT_TYPES.GRID,
    props: { columns: 2, gap: 4 },
    components: [
      { id: 'text-1', type: COMPONENT_TYPES.TEXT, content: 'Independent Suspense boundaries.' },
      { id: 'text-2', type: COMPONENT_TYPES.TEXT, content: 'Skeletons sized per component type.' },
    ],
  },
];

const streamAfter = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(DEMO_COMPONENTS), ms));

/**
 * Minimal stub providing the Remix router context ComponentRenderer needs
 * (it uses useFetcher / useAsyncValue), with no loader gating — so this story
 * is independent of the page-source selector. Stable across re-renders so an
 * in-flight stream isn't restarted.
 */
function WithStreamStub(Story) {
  const storyRef = useRef(Story);
  storyRef.current = Story;
  const Stub = useMemo(
    () =>
      createRemixStub([
        {
          path: '/',
          Component: function StreamRoot() {
            const StoryNow = storyRef.current;
            return <StoryNow />;
          },
        },
      ]),
    []
  );
  return <Stub initialEntries={['/']} />;
}

function StreamingDemo() {
  const [data, setData] = useState(() => ({ components: streamAfter(1500) }));

  return (
    <div className="max-w-3xl space-y-4 p-2">
      <button
        type="button"
        onClick={() => setData({ components: streamAfter(1500) })}
        className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
      >
        Stream again
      </button>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <ComponentRenderer data={data} />
      </div>
    </div>
  );
}

export default {
  title: 'Page/Streaming',
  component: StreamingDemo,
  decorators: [WithStreamStub],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "Demonstrates ComponentRenderer's streaming support: `data.components` " +
          'is a promise, so a delayed `PageSkeleton` shows until it resolves. ' +
          '"Stream again" restarts the deferred load.',
      },
    },
  },
};

export const Default = {};

export const NeverResolves = {
  render: () => (
    <div className="max-w-3xl rounded-lg border border-gray-200 bg-white p-6">
      <ComponentRenderer data={{ components: new Promise(() => {}) }} />
    </div>
  ),
};
