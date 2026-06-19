import { useMemo } from 'react';
import { useLoaderData, useFetcher, useParams, useAsyncValue } from '@remix-run/react';
import { createUrlWithParams } from '../../shared/utils.js';

/**
 * @typedef {Object} UsePageOptions
 * @property {string} [endpoint] - Custom endpoint; defaults to `/pages/{pageId}` from the route params.
 * @property {Object} [initialData] - Page data that takes precedence over streamed or loader data.
 * @property {Object} [params] - Base query parameters merged into every refresh request.
 * @property {boolean} [awaitStreaming] - Prefer the streamed value from a surrounding <Await> boundary.
 */

/**
 * @typedef {Object} UsePageResult
 * @property {string|undefined} pageId - `pageId` route param, when the route defines one.
 * @property {Object|undefined} page - Resolved page data: initialData, then the streamed `page` (when awaitStreaming), then the loader's `page`.
 * @property {Array<Object>|undefined} components - Resolved components, following the same precedence as `page`.
 * @property {boolean} isLoading - True while a refresh is in flight.
 * @property {boolean} isSubmitting - True while an update or delete is in flight.
 * @property {Object|undefined} lastSubmission - Response data from the most recent fetcher call.
 * @property {(data: Object) => Promise<void>} updatePage - POSTs a JSON update to the endpoint.
 * @property {() => Promise<void>} deletePage - Issues a DELETE request to the endpoint.
 * @property {(queryParams?: Object) => void} refreshPage - Reloads page data, merging `options.params` with `queryParams`.
 * @property {import('@remix-run/react').FetcherWithComponents<*>} fetcher - Underlying Remix fetcher for advanced use.
 * @property {string} endpoint - Endpoint used for reads and submissions.
 */

/**
 * Manage a page's data and components with streaming-aware reads and CRUD submissions.
 *
 * Data resolves in priority order: `options.initialData`, the surrounding
 * <Await> streamed value (when `options.awaitStreaming` is set), then the
 * route loader data. Without a `pageId` route param or a custom endpoint,
 * the endpoint falls back to `window.location.pathname`, which is only
 * available in the browser.
 *
 * @param {UsePageOptions} [options]
 * @returns {UsePageResult} Page data plus update, delete, and refresh operations.
 */
export function usePage(options = {}) {
  const params = useParams();
  const fetcher = useFetcher();
  const routeData = useLoaderData();

  const streamedValue = useAsyncValue();

  const pageId = params.pageId;

  const endpoint =
    options.endpoint ||
    (pageId
      ? `/pages/${pageId}`
      : typeof window !== 'undefined'
        ? window.location.pathname
        : '/');

  const pageData = useMemo(() => {
    if (options.initialData) {
      return options.initialData;
    }
    if (options.awaitStreaming && streamedValue?.page) {
      return streamedValue.page;
    }
    return routeData?.page;
  }, [options.initialData, options.awaitStreaming, streamedValue, routeData]);

  const components = useMemo(() => {
    if (options.initialData?.components) {
      return options.initialData.components;
    }
    if (options.awaitStreaming && streamedValue?.components) {
      return streamedValue.components;
    }
    return routeData?.components;
  }, [options.initialData, options.awaitStreaming, streamedValue, routeData]);

  const updatePage = async (data) => {
    return fetcher.submit(
      { ...data },
      {
        method: 'POST',
        action: endpoint,
        encType: 'application/json'
      }
    );
  };

  const deletePage = async () => {
    return fetcher.submit(
      null,
      {
        method: 'DELETE',
        action: endpoint
      }
    );
  };

  const refreshPage = (queryParams = {}) => {
    const url = createUrlWithParams(endpoint, {
      ...options.params,
      ...queryParams
    });
    fetcher.load(url);
  };

  return {
    // Data
    pageId,
    page: pageData,
    components,
    isLoading: fetcher.state === 'loading',
    isSubmitting: fetcher.state === 'submitting',
    lastSubmission: fetcher.data,

    // Operations
    updatePage,
    deletePage,
    refreshPage,

    // Raw objects
    fetcher,
    endpoint
  };
}
