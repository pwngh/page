// @ts-check

import { json, defer } from '@remix-run/node';
import { ERROR_MESSAGES } from '../shared/constants.js';
import {
  validateComponent,
  mergeComponentProps,
  formatError,
  createDbError
} from '../shared/utils.js';

/**
 * Create the streaming loader helpers for Remix page routes.
 *
 * @param {import('./client.js').PageDbClient} db - Connected client; reserved for loaders that query directly.
 * @param {ReturnType<import('./methods').createMethods>} methods - Data-access layer the loaders delegate to.
 * @returns {{ loadPage: (identifier: string) => Promise<ReturnType<typeof defer>> }} Loader helpers keyed by use case.
 */
export const createLoader = (db, methods) => {
  /**
   * Load a page and stream it to the route via defer().
   *
   * Failures are thrown as json() responses so Remix error boundaries
   * receive a formatted payload: 404 when the page is missing, 500 otherwise.
   *
   * @param {string} identifier - Page ID or slug.
   */
  const loadPage = async (identifier) => {
    try {
      const page = await methods.getPage(identifier);

      return defer({ page: { ...page } });
    } catch (error) {
      throw json(
        formatError(error, ERROR_MESSAGES.PAGE_NOT_FOUND),
        { status: error.code === 'NOT_FOUND' ? 404 : 500 }
      );
    }
  };

  return { loadPage };
};

/**
 * Maps each form-submitted component type to a builder that shapes its raw
 * payload into `{ content?, props, components? }`, merging type defaults.
 * @type {Record<string, (data: any) => Promise<any>>}
 */
const componentHandlers = {
  // Base Components
  text: async (data) => ({
    content: data.content,
    props: mergeComponentProps('text', {
      size: data.size,
      color: data.color,
      weight: data.weight
    })
  }),

  title: async (data) => ({
    content: data.content,
    props: mergeComponentProps('title', {
      size: data.size,
      color: data.color,
      align: data.align
    })
  }),

  paragraph: async (data) => ({
    content: data.content,
    props: mergeComponentProps('paragraph', {
      size: data.size,
      color: data.color
    })
  }),

  button: async (data) => ({
    content: data.label,
    props: mergeComponentProps('button', {
      variant: data.variant,
      size: data.size,
      onClick: data.onClick
    })
  }),

  list: async (data) => ({
    props: mergeComponentProps('list', {
      type: data.type,
      items: data.items
    })
  }),

  image: async (data) => ({
    props: mergeComponentProps('image', {
      src: data.src,
      alt: data.alt,
      width: data.width,
      height: data.height
    })
  }),

  link: async (data) => ({
    content: data.content,
    props: mergeComponentProps('link', {
      href: data.href,
      external: data.external
    })
  }),

  // Layout Components
  container: async (data) => ({
    props: mergeComponentProps('container', {
      maxWidth: data.maxWidth,
      padding: data.padding
    }),
    components: data.components
  }),

  grid: async (data) => ({
    props: mergeComponentProps('grid', {
      columns: data.columns,
      gap: data.gap
    }),
    components: data.components?.map(comp => ({
      ...comp,
      props: {
        ...comp.props,
        gridItem: {
          colSpan: comp.colSpan,
          rowSpan: comp.rowSpan
        }
      }
    }))
  }),

  section: async (data) => ({
    props: mergeComponentProps('section', {
      background: data.background,
      padding: data.padding
    }),
    components: data.components
  }),

  divider: async (data) => ({
    props: mergeComponentProps('divider', data)
  }),

  // Form Components
  form: async (data) => ({
    props: mergeComponentProps('form', {
      action: data.action,
      method: data.method
    }),
    components: data.components
  }),

  input: async (data) => ({
    props: mergeComponentProps('input', {
      type: data.type,
      name: data.name,
      label: data.label,
      placeholder: data.placeholder,
      required: data.required
    })
  }),

  select: async (data) => ({
    props: mergeComponentProps('select', {
      name: data.name,
      label: data.label,
      options: data.options,
      required: data.required
    })
  }),

  textarea: async (data) => ({
    props: mergeComponentProps('textarea', {
      name: data.name,
      label: data.label,
      rows: data.rows,
      required: data.required
    })
  }),

  checkbox: async (data) => ({
    props: mergeComponentProps('checkbox', {
      name: data.name,
      label: data.label,
      checked: data.checked
    })
  }),

  radio: async (data) => ({
    props: mergeComponentProps('radio', {
      name: data.name,
      label: data.label,
      value: data.value,
      checked: data.checked
    })
  }),

  // Utility Components
  'aspect_ratio': async (data) => ({
    props: mergeComponentProps('aspect_ratio', {
      ratio: data.ratio
    }),
    components: [data.component]
  }),

  stack: async (data) => ({
    props: mergeComponentProps('stack', {
      direction: data.direction,
      spacing: data.spacing,
      align: data.align
    }),
    components: data.components
  })
};

/**
 * Generate a page-unique component id in the `<type>-<n>` format.
 *
 * n is the smallest positive integer that does not collide with an
 * existing id, so removed components' ids are reused (e.g. with
 * ["title-1", "title-3"] present, the next title becomes "title-2").
 *
 * @param {string} type - Component type used as the id prefix.
 * @param {import('../shared/types').ComponentBase[]} components - The page's existing components, checked for collisions.
 * @returns {string} New id such as "title-1" or "grid-2".
 */
export const generateComponentId = (type, components) => {
  const existingIds = new Set(components.map(c => c.id));
  let n = 1;
  while (existingIds.has(`${type}-${n}`)) {
    n += 1;
  }
  return `${type}-${n}`;
};

/**
 * Create the Remix action handlers for page and component CRUD.
 *
 * @param {import('./client.js').PageDbClient} db - Connected client; reserved for actions that query directly.
 * @param {ReturnType<import('./methods').createMethods>} methods - Data-access layer the actions delegate to.
 * @returns {{
 *   handleComponentAction: (request: Request, params: { pageId: string, componentId?: string }) => Promise<Response>,
 *   handlePageAction: (request: Request, params: { pageId?: string }) => Promise<Response>
 * }} Action handlers to call from Remix route actions.
 */
export const createActions = (db, methods) => {
  /**
   * Handle a component mutation submitted as form data.
   *
   * The form's `intent` field selects the operation:
   * - 'update': parses the `data` field (JSON) through the `type`'s handler,
   *   validates the result, and overwrites the component → `{ component }`.
   * - 'add': builds the component the same way but generates its id in the
   *   `<type>-<n>` format (lowest n unused on the page) and appends it to
   *   the page → `{ page }`.
   * - 'remove': drops params.componentId from the page → `{ page }`.
   * - 'reorder': applies the `componentIds` field (JSON array of ids in the
   *   desired order) → `{ components }`.
   *
   * Unknown types, failed validation, and unknown intents are thrown as
   * json() responses with status 400 and a formatted error payload.
   *
   * @param {Request} request - Form data request carrying `intent`, `type`, and the intent's payload fields.
   * @param {{ pageId: string, componentId?: string }} params - Route params; componentId is required for 'update' and 'remove'.
   * @returns {Promise<Response>} json() response with the intent's result shape.
   */
  const handleComponentAction = async (request, params) => {
    const { pageId, componentId } = params;
    const formData = await request.formData();
    const intent = formData.get('intent');
    const type = formData.get('type');

    try {
      if (!componentHandlers[type]) {
        throw createDbError(
          ERROR_MESSAGES.INVALID_COMPONENT,
          'VALIDATION_ERROR',
          { type }
        );
      }

      switch (intent) {
        case 'update': {
          const data = JSON.parse(formData.get('data'));
          const componentData = await componentHandlers[type](data);

          const component = {
            id: componentId,
            pageId,
            type,
            ...componentData
          };

          if (!validateComponent(component)) {
            throw createDbError(
              ERROR_MESSAGES.INVALID_COMPONENT,
              'VALIDATION_ERROR',
              { component }
            );
          }

          const updated = await methods.updateComponent(componentId, component);
          return json({ component: updated });
        }

        case 'add': {
          const data = JSON.parse(formData.get('data'));
          const componentData = await componentHandlers[type](data);

          const components = await methods.getComponents(pageId);

          const component = {
            id: generateComponentId(type, components),
            pageId,
            type,
            ...componentData
          };

          if (!validateComponent(component)) {
            throw createDbError(
              ERROR_MESSAGES.INVALID_COMPONENT,
              'VALIDATION_ERROR',
              { component }
            );
          }

          const page = await methods.updatePage(pageId, {
            components: [...components, component]
          });

          return json({ page });
        }

        case 'remove': {
          const components = (await methods.getComponents(pageId))
            .filter(c => c.id !== componentId);

          const page = await methods.updatePage(pageId, { components });
          return json({ page });
        }

        case 'reorder': {
          const componentIds = JSON.parse(formData.get('componentIds'));
          const components = await methods.reorderComponents(pageId, componentIds);
          return json({ components });
        }

        default:
          throw new Error('Invalid component action');
      }
    } catch (error) {
      throw json(
        formatError(error, ERROR_MESSAGES.DB_WRITE),
        { status: 400 }
      );
    }
  };

  /**
   * Handle a page mutation submitted as form data.
   *
   * The form's `intent` field selects the operation:
   * - 'create': inserts the `data` field (JSON page fields) → `{ page }`.
   * - 'update': applies the `data` field to params.pageId → `{ page }`.
   * - 'delete': soft-deletes params.pageId → `{ success: true }`.
   *
   * Failures and unknown intents are thrown as json() responses with
   * status 400 and a formatted error payload.
   *
   * @param {Request} request - Form data request carrying `intent` and, for create/update, a JSON `data` field.
   * @param {{ pageId?: string }} params - Route params; pageId is required for 'update' and 'delete'.
   * @returns {Promise<Response>} json() response with the intent's result shape.
   */
  const handlePageAction = async (request, params) => {
    const { pageId } = params;
    const formData = await request.formData();
    const intent = formData.get('intent');

    try {
      switch (intent) {
        case 'create': {
          const data = JSON.parse(formData.get('data'));
          const page = await methods.createPage(data);
          return json({ page });
        }

        case 'update': {
          const data = JSON.parse(formData.get('data'));
          const page = await methods.updatePage(pageId, data);
          return json({ page });
        }

        case 'delete': {
          await methods.deletePage(pageId);
          return json({ success: true });
        }

        default:
          throw new Error('Invalid page action');
      }
    } catch (error) {
      throw json(
        formatError(error, ERROR_MESSAGES.DB_WRITE),
        { status: 400 }
      );
    }
  };

  return {
    handleComponentAction,
    handlePageAction
  };
};
