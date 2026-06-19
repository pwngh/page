/**
 * Storybook decorator that runs page stories against a selectable backend.
 *
 * Renders an in-canvas SourceBar (pick the in-memory mock CMS + a scenario, or
 * enter a real page-server base URL) above a fully wired Remix `RemixStub`. The
 * stub registers the routes the bundled hooks submit to, all backed by one
 * stateful store, so `usePage` / `useComponent` / `useComponents` and the
 * `ComponentRenderer` behave as they would in a real app: load, edit, add,
 * reorder, remove, save, and delete all mutate state and revalidate.
 *
 * Note: `usePage` derives its default endpoint from `window.location.pathname`
 * (which is `/iframe.html` inside Storybook), so stories using it should pass
 * an explicit `{ endpoint: '/' }` to line up with the stub's root route.
 */

import React, { useMemo, useRef, useState, useEffect, useSyncExternalStore } from 'react';
import { createRemixStub } from '@remix-run/testing';
import { useLoaderData } from '@remix-run/react';

import {
  subscribe,
  getSnapshot,
  getActiveStore,
  setSource,
  reload,
  resetStore,
} from '../mocks/page-source.js';
import { SCENARIOS } from '../mocks/page-store.js';
import { createRootLoader, createRootAction, createResourceRoutes } from '../mocks/page-handlers.js';

function usePageSource() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Card shown when the active store can't be read (notFound scenario or real CORS/network failure). */
function PageErrorCard({ message }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 shadow">
      <h2 className="mb-1 text-lg font-semibold">Page unavailable</h2>
      <p className="text-sm">{message}</p>
      <p className="mt-2 text-xs text-red-600">
        In a real Remix app this surfaces through the route&apos;s error boundary.
        For a real server in the browser, this is almost always a CORS or network
        block — switch back to the mock to keep exploring.
      </p>
    </div>
  );
}

const segBtn = (active) =>
  `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
    active ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
  }`;

/** The source selector bar rendered above every interactive story. */
function SourceBar() {
  const store = usePageSource();
  const isReal = store.source === 'real';
  const [baseUrl, setBaseUrl] = useState(store.baseUrl);

  useEffect(() => setBaseUrl(store.baseUrl), [store.baseUrl]);

  const applyReal = () => setSource({ source: 'real', baseUrl: baseUrl.trim() });

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-800">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold">Page data</span>

        <div className="inline-flex rounded-lg bg-gray-200 p-0.5">
          <button type="button" className={segBtn(!isReal)} onClick={() => setSource({ source: 'mock' })}>
            Mock CMS
          </button>
          <button type="button" className={segBtn(isReal)} onClick={applyReal}>
            Real server
          </button>
        </div>

        {!isReal ? (
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Scenario</span>
            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
              value={store.scenario}
              onChange={(e) => setSource({ scenario: e.target.value })}
            >
              {Object.entries(SCENARIOS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className="flex items-center gap-1 text-sm">
            <span className="text-gray-600">Base URL</span>
            <input
              type="text"
              value={baseUrl}
              placeholder="http://localhost:3000"
              onChange={(e) => setBaseUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyReal()}
              className="w-56 rounded-md border border-gray-300 bg-white px-2 py-1 font-mono"
            />
            <button
              type="button"
              onClick={applyReal}
              className="ml-1 rounded-md bg-blue-500 px-3 py-1 font-medium text-white hover:bg-blue-600"
            >
              Apply
            </button>
          </label>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={reload}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium hover:bg-gray-100"
            title="Re-read the page from the store"
          >
            Reload
          </button>
          {!isReal && (
            <button
              type="button"
              onClick={resetStore}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium hover:bg-gray-100"
              title="Reset mock edits back to the scenario defaults"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {isReal && (
        <p className="mt-2 text-xs text-gray-500">
          Reading from <span className="font-mono">{store.baseUrl || '…'}/api/page</span>.
          Browsers block cross-origin requests, so unless the server is reachable
          and CORS-permissive you&apos;ll see an &ldquo;unavailable&rdquo; card — that&apos;s expected.
        </p>
      )}
    </div>
  );
}

/**
 * Build the interactive decorator.
 * @param {Object} [options]
 * @param {boolean} [options.bar=true] - Render the SourceBar above the story.
 * @returns {(Story: React.ComponentType) => JSX.Element}
 */
export function withPage({ bar = true } = {}) {
  return function PageDecorator(Story) {
    const store = usePageSource();
    const activeStore = getActiveStore();

    const storyRef = useRef(Story);
    storyRef.current = Story;

    const Stub = useMemo(() => {
      return createRemixStub([
        {
          path: '/',
          loader: createRootLoader(activeStore),
          action: createRootAction(activeStore),
          Component: function StubRoot() {
            const data = useLoaderData();
            if (data && data.__pageError) return <PageErrorCard message={data.__pageError} />;
            const StoryNow = storyRef.current;
            return <StoryNow />;
          },
        },
        ...createResourceRoutes(activeStore),
      ]);
    }, [activeStore]);

    const signature =
      store.source === 'real' ? `real|${store.baseUrl}` : `mock|${store.scenario}`;

    return (
      <div>
        {bar && <SourceBar />}
        <Stub initialEntries={['/']} key={`${signature}:${store.nonce}`} />
      </div>
    );
  };
}

export { PageErrorCard };
