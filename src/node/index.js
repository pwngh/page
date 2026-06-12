// @ts-check

import { createClient } from './client.js';
import { createMethods } from './methods.js';
import { createLoader, createActions } from './api.js';

/**
 * Connect to MySQL and assemble the full page-building API.
 *
 * Convenience entry point that wires createClient, createMethods,
 * createLoader, and createActions together; call once at server startup
 * and share the result across routes.
 *
 * @param {import('../shared/types').DBConfig} config - Connection credentials plus the projectId that scopes all queries.
 * @returns {Promise<{
 *   client: Awaited<ReturnType<typeof createClient>>,
 *   methods: ReturnType<typeof createMethods>,
 *   loader: ReturnType<typeof createLoader>,
 *   actions: ReturnType<typeof createActions>
 * }>} The connected client with its data methods, loader, and action handlers.
 * @throws {Error} When config.credentials is missing.
 */
export async function createPageApi(config) {
  if (!config.credentials) {
    throw new Error('Database credentials are required');
  }

  const client = await createClient(config);
  const methods = createMethods(client);
  const loader = createLoader(client, methods);
  const actions = createActions(client, methods);

  return {
    client,
    methods,
    loader,
    actions
  };
}

export { createClient } from './client.js';
export { createMethods } from './methods.js';
export { createLoader, createActions } from './api.js';
