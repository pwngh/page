import { useFetcher, useAsyncValue } from '@remix-run/react';
import { createUrlWithParams } from '../../shared/utils.js';

/**
 * @typedef {Object} UseComponentOptions
 * @property {string} [endpoint] - Custom endpoint; defaults to `/components/{componentId}`.
 * @property {Object} [initialData] - Component data that takes precedence over streamed or fetched data.
 * @property {Object} [params] - Base query parameters merged into every refresh request.
 * @property {boolean} [awaitStreaming] - Prefer the streamed value from a surrounding <Await> boundary.
 */

/**
 * @typedef {Object} UseComponentResult
 * @property {string} componentId - Identifier the hook was called with.
 * @property {Object|undefined} component - Resolved component data: initialData, then the streamed value (when awaitStreaming), then the latest fetch result.
 * @property {boolean} isLoading - True while a refresh is in flight.
 * @property {boolean} isSubmitting - True while an update or delete is in flight.
 * @property {Object|undefined} lastSubmission - Response data from the most recent fetcher call.
 * @property {(data: Object) => Promise<void>} updateComponent - POSTs a JSON update to the endpoint.
 * @property {() => Promise<void>} deleteComponent - Issues a DELETE request to the endpoint.
 * @property {(queryParams?: Object) => void} refreshComponent - Reloads component data, merging `options.params` with `queryParams`.
 * @property {import('@remix-run/react').FetcherWithComponents<*>} fetcher - Underlying Remix fetcher for advanced use.
 * @property {string} endpoint - Endpoint used for reads and submissions.
 */

/**
 * Manage a single component's data with streaming-aware reads and CRUD submissions.
 *
 * Data resolves in priority order: `options.initialData`, the surrounding
 * <Await> streamed value (when `options.awaitStreaming` is set), then this
 * hook's own fetcher data. The consuming app must expose CRUD routes at the
 * resolved endpoint for the mutation helpers to work.
 *
 * @param {string} componentId - Component identifier; builds the default `/components/{componentId}` endpoint.
 * @param {UseComponentOptions} [options]
 * @returns {UseComponentResult} Component data plus update, delete, and refresh operations.
 */
export function useComponent(componentId, options = {}) {
  const fetcher = useFetcher();
  const streamedValue = useAsyncValue();

  const endpoint = options.endpoint || `/components/${componentId}`;

  const componentData =
    options.initialData || (options.awaitStreaming && streamedValue) || fetcher.data;

  const updateComponent = async (data) => {
    return fetcher.submit(
      { ...data },
      {
        method: 'POST',
        action: endpoint,
        encType: 'application/json'
      }
    );
  };

  const deleteComponent = async () => {
    return fetcher.submit(
      null,
      {
        method: 'DELETE',
        action: endpoint
      }
    );
  };

  const refreshComponent = (queryParams = {}) => {
    const url = createUrlWithParams(endpoint, {
      ...options.params,
      ...queryParams
    });
    fetcher.load(url);
  };

  return {
    componentId,
    component: componentData,
    isLoading: fetcher.state === 'loading',
    isSubmitting: fetcher.state === 'submitting',
    lastSubmission: fetcher.data,

    updateComponent,
    deleteComponent,
    refreshComponent,

    fetcher,
    endpoint
  };
}
