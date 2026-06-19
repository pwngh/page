/**
 * Best-effort real-server adapter for Storybook.
 *
 * Lets a story run against a running page server instead of the in-memory
 * mock. Because there is no single canonical wire format for a consumer's
 * Remix app, this follows a simple convention: the server exposes a JSON page
 * endpoint at `${baseUrl}/api/page` that returns `{ page }` for GET and accepts
 * JSON writes. As with hilink's real-device mode, browsers enforce CORS, so a
 * direct fetch is usually blocked unless the server is reachable and
 * CORS-permissive — the decorator surfaces that as an "unreachable" card and
 * the device bar lets you fall back to the mock.
 */

const TIMEOUT = 4000;

async function call(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    signal: AbortSignal.timeout(TIMEOUT),
    ...options,
  });
  if (!response.ok) {
    const err = new Error(`Server responded ${response.status}`);
    err.code = response.status === 404 ? 'NOT_FOUND' : 'DB_QUERY';
    throw err;
  }
  return response.json();
}

/**
 * Create a real page store bound to a server origin. Exposes the same method
 * surface as the mock store, backed by live HTTP.
 * @param {{ baseUrl: string }} config
 * @returns {object}
 */
export function createRealPageStore({ baseUrl }) {
  const root = `${baseUrl.replace(/\/$/, '')}/api/page`;

  const getPage = async () => (await call(root)).page;
  const getComponents = async () => (await getPage()).components || [];

  const write = (method, body) => call(root, { method, body: body ? JSON.stringify(body) : undefined });

  return {
    isMock: false,
    baseUrl,
    getPage,
    getComponents,
    updatePage: (_id, update) => write('POST', { intent: 'update', ...update }),
    deletePage: () => write('DELETE'),
    addComponent: (data) => write('POST', { intent: 'add', ...data }),
    updateComponent: (id, update) => write('POST', { intent: 'update', componentId: id, ...update }),
    removeComponent: (id) => write('POST', { intent: 'remove', componentId: id }),
    reorderComponents: (_id, componentIds) => write('PUT', { intent: 'reorder', componentIds }),
  };
}
