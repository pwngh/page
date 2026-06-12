import { useMemo } from 'react';
import { useFetcher, useAsyncValue } from '@remix-run/react';
import { createUrlWithParams } from '../../shared/utils.js';

/**
 * @typedef {Object} UseComponentsOptions
 * @property {string} [endpoint] - Custom endpoint; defaults to `/pages/{pageId}/components`.
 * @property {Object} [initialData] - Components data that takes precedence over streamed or fetched data.
 * @property {Object} [params] - Base query parameters merged into every refresh request.
 * @property {boolean} [awaitStreaming] - Prefer the streamed value from a surrounding <Await> boundary.
 */

/**
 * @typedef {Object} UseComponentsResult
 * @property {string} pageId - Page identifier the hook was called with.
 * @property {Array<Object>|undefined} components - Resolved components: initialData, then the streamed value (when awaitStreaming), then the latest fetch result.
 * @property {boolean} isLoading - True while a refresh is in flight.
 * @property {boolean} isSubmitting - True while a mutation is in flight.
 * @property {Object|undefined} lastSubmission - Response data from the most recent fetcher call.
 * @property {(componentData: Object) => Promise<void>} addComponent - POSTs a new component to the endpoint.
 * @property {(componentIds: string[]) => Promise<void>} reorderComponents - PUTs the full id list in its new order to `{endpoint}/reorder`.
 * @property {(updates: Array<Object>) => Promise<void>} bulkUpdateComponents - PUTs a batch of component updates to the endpoint.
 * @property {(queryParams?: Object) => void} refreshComponents - Reloads the component list, merging `options.params` with `queryParams`.
 * @property {import('@remix-run/react').FetcherWithComponents<*>} fetcher - Underlying Remix fetcher for advanced use.
 * @property {string} endpoint - Endpoint used for reads and submissions.
 */

/**
 * Manage a page's component collection with streaming-aware reads and batch mutations.
 *
 * Data resolves in priority order: `options.initialData`, the surrounding
 * <Await> streamed value (when `options.awaitStreaming` is set), then this
 * hook's own fetcher data. The consuming app must expose the collection
 * routes (including `{endpoint}/reorder`) for the mutation helpers to work.
 *
 * @param {string} pageId - Page identifier; builds the default `/pages/{pageId}/components` endpoint.
 * @param {UseComponentsOptions} [options]
 * @returns {UseComponentsResult} Components data plus add, reorder, bulk-update, and refresh operations.
 */
export function useComponents(pageId, options = {}) {
  const fetcher = useFetcher();
  const streamedValue = useAsyncValue();

  const endpoint = useMemo(() => {
    if (options.endpoint) return options.endpoint;
    return `/pages/${pageId}/components`;
  }, [options.endpoint, pageId]);

  const componentsData = useMemo(() => {
    if (options.initialData) {
      return options.initialData;
    }
    if (options.awaitStreaming && streamedValue) {
      return streamedValue;
    }
    return fetcher.data;
  }, [options.initialData, options.awaitStreaming, streamedValue, fetcher.data]);

  const addComponent = async (componentData) => {
    return fetcher.submit(
      { ...componentData },
      {
        method: 'POST',
        action: endpoint,
        encType: 'application/json'
      }
    );
  };

  const reorderComponents = async (componentIds) => {
    return fetcher.submit(
      { componentIds },
      {
        method: 'PUT',
        action: `${endpoint}/reorder`,
        encType: 'application/json'
      }
    );
  };

  const bulkUpdateComponents = async (updates) => {
    return fetcher.submit(
      { updates },
      {
        method: 'PUT',
        action: endpoint,
        encType: 'application/json'
      }
    );
  };

  const refreshComponents = (queryParams = {}) => {
    const url = createUrlWithParams(endpoint, {
      ...options.params,
      ...queryParams
    });
    fetcher.load(url);
  };

  return {
    pageId,
    components: componentsData,
    isLoading: fetcher.state === 'loading',
    isSubmitting: fetcher.state === 'submitting',
    lastSubmission: fetcher.data,

    addComponent,
    reorderComponents,
    bulkUpdateComponents,
    refreshComponents,

    fetcher,
    endpoint
  };
}

/**
 * Resolve a streamed <Await> value and pass it to a render-prop child.
 *
 * @param {Object} props
 * @param {(data: *) => import('react').ReactNode} props.children - Render function receiving the resolved value.
 */
export function ComponentsDataWrapper({ children }) {
  const data = useAsyncValue();
  return children(data);
}
