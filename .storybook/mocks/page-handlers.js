/**
 * Store-backed Remix routes for the Storybook RemixStub.
 *
 * These match what the *hooks* actually submit (not the server-side
 * `intent`-based contract in `src/node/api.js`), so the bundled hooks work
 * unchanged in Storybook:
 *   - `usePage`     reads `useLoaderData()` → root `/` loader returns `{ page, components }`;
 *                   `updatePage` POSTs JSON to `/`, `deletePage` DELETEs `/`, `refreshPage` GETs `/`.
 *   - `useComponent`  reads `fetcher.data` → `/components/:componentId` loader/action returns the component.
 *   - `useComponents` reads `fetcher.data` → `/pages/:pageId/components` returns the components array;
 *                     reorder lives at `/pages/:pageId/components/reorder`.
 *   - `useDoActionHandler` POSTs form-data to `/_api/doAction`, which echoes it back.
 *
 * A read failure (the `notFound` scenario) returns `{ __pageError }`; a write
 * failure (the `writeError` scenario) returns `{ __actionError }`. After any
 * action, Remix revalidates the root loader, so the page reflects the change.
 */

/** Parse a request body as JSON or form-data based on its content type. */
async function readBody(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) {
    try {
      return await request.json();
    } catch {
      return {};
    }
  }
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

/** Root `/` loader → the dashboard payload `usePage` reads. */
export function createRootLoader(store) {
  return async function loader() {
    try {
      const page = await store.getPage();
      return { page, components: page.components };
    } catch (error) {
      return { __pageError: error?.message || 'Page not found' };
    }
  };
}

/** Root `/` action → `usePage.updatePage` (POST JSON) and `deletePage` (DELETE). */
export function createRootAction(store) {
  return async function action({ request }) {
    try {
      if (request.method === 'DELETE') {
        return await store.deletePage();
      }
      const data = await readBody(request);
      const page = await store.updatePage(null, data);
      return { page };
    } catch (error) {
      return { __actionError: error?.message || 'Action failed' };
    }
  };
}

/** The resource routes the component hooks submit to. */
export function createResourceRoutes(store) {
  const componentRoute = {
    path: '/components/:componentId',
    loader: async ({ params }) => {
      try {
        const page = await store.getPage();
        return page.components.find((c) => c.id === params.componentId) || null;
      } catch (error) {
        return { __pageError: error?.message };
      }
    },
    action: async ({ request, params }) => {
      try {
        if (request.method === 'DELETE') {
          await store.removeComponent(params.componentId);
          return { success: true };
        }
        const data = await readBody(request);
        return await store.updateComponent(params.componentId, data);
      } catch (error) {
        return { __actionError: error?.message || 'Action failed' };
      }
    },
  };

  const componentsRoute = {
    path: '/pages/:pageId/components',
    loader: async () => {
      try {
        return await store.getComponents();
      } catch (error) {
        return { __pageError: error?.message };
      }
    },
    action: async ({ request }) => {
      try {
        const data = await readBody(request);
        if (request.method === 'PUT') {
          // bulkUpdateComponents submits { updates: [{ id, ...patch }] }.
          for (const u of data.updates || []) {
            await store.updateComponent(u.id, u);
          }
        } else {
          await store.addComponent(data);
        }
        return await store.getComponents();
      } catch (error) {
        return { __actionError: error?.message || 'Action failed' };
      }
    },
  };

  const reorderRoute = {
    path: '/pages/:pageId/components/reorder',
    action: async ({ request, params }) => {
      try {
        const { componentIds } = await readBody(request);
        return await store.reorderComponents(params.pageId, componentIds);
      } catch (error) {
        return { __actionError: error?.message || 'Action failed' };
      }
    },
  };

  const doActionRoute = {
    path: '/_api/doAction',
    action: async ({ request }) => {
      const received = await readBody(request);
      return { ok: true, received };
    },
  };

  return [componentRoute, componentsRoute, reorderRoute, doActionRoute];
}
