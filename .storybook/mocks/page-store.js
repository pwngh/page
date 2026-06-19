/**
 * In-memory mock "page CMS" for Storybook.
 *
 * Stands in for the mysql-backed data-access layer (`src/node/methods.js`):
 * one project holding one page whose components are an embedded list. State is
 * mutable — `updatePage` / `addComponent` / `updateComponent` /
 * `removeComponent` / `reorderComponents` change what later reads return — so
 * the hooks (`usePage`, `useComponent`, `useComponents`) and the
 * `ComponentRenderer` behave exactly as they would against a real backend.
 *
 * The method surface mirrors `createMethods`, and `addComponent` reuses the
 * `<type>-<n>` smallest-unused id scheme from `src/node/api.js`
 * (`generateComponentId`) so ids look real.
 */

import { COMPONENT_TYPES, DEFAULT_META } from '../../src/shared/constants.js';

const PROJECT_ID = 'proj_demo';
const PAGE_ID = 'p1';

/** A small but representative landing page used by most scenarios. */
function seedComponents() {
  return [
    {
      id: 'title-1',
      type: COMPONENT_TYPES.TITLE,
      content: 'Acme Cloud',
      props: { size: 'xl', align: 'left' },
    },
    {
      id: 'paragraph-1',
      type: COMPONENT_TYPES.PARAGRAPH,
      content:
        'Ship faster with a component-driven page builder. Edit this page live ' +
        'from the panel on the right — add, reorder, and remove components.',
      props: { size: 'md' },
    },
    {
      id: 'grid-1',
      type: COMPONENT_TYPES.GRID,
      props: { columns: 2, gap: 4 },
      components: [
        {
          id: 'text-1',
          type: COMPONENT_TYPES.TEXT,
          content: 'Fast by default — streaming reads with skeleton fallbacks.',
          props: { size: 'md' },
        },
        {
          id: 'text-2',
          type: COMPONENT_TYPES.TEXT,
          content: 'Type-safe component schema with sensible per-type defaults.',
          props: { size: 'md' },
        },
      ],
    },
    { id: 'divider-1', type: COMPONENT_TYPES.DIVIDER, props: {} },
    {
      id: 'button-1',
      type: COMPONENT_TYPES.BUTTON,
      content: 'Get started',
      props: { variant: 'primary', size: 'md' },
    },
  ];
}

/** Build the seed page record (shape matches `getPage`'s camelCase output). */
function seedPage(components) {
  return {
    id: PAGE_ID,
    projectId: PROJECT_ID,
    slug: 'home',
    meta: { ...DEFAULT_META, title: 'Acme Cloud', description: 'Marketing home page' },
    components,
    settings: { theme: 'light' },
    createdAt: '2026-06-01T12:00:00Z',
  };
}

/**
 * Scenarios the store can start in. `read`/`write` flags drive the error
 * states; `slow` exaggerates latency to exercise streaming fallbacks.
 * @type {Record<string, {label: string, components?: () => any[], read?: 'notFound', write?: boolean, latency?: number}>}
 */
export const SCENARIOS = {
  page: { label: 'Landing page', components: seedComponents },
  empty: { label: 'Empty page', components: () => [] },
  slow: { label: 'Slow (streaming)', components: seedComponents, latency: 2200 },
  notFound: { label: 'Page not found (404)', read: 'notFound' },
  writeError: { label: 'Write fails (400)', components: seedComponents, write: true },
};

/** Resolve after `ms`, imitating a database round-trip. */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Smallest-unused `<type>-<n>` id, mirroring `generateComponentId`. */
function generateComponentId(type, components) {
  const existing = new Set(components.map((c) => c.id));
  let n = 1;
  while (existing.has(`${type}-${n}`)) n += 1;
  return `${type}-${n}`;
}

/** Default content/props for a freshly added component of a given type. */
function scaffold(type) {
  switch (type) {
    case COMPONENT_TYPES.TITLE:
      return { content: 'New title', props: { size: 'lg' } };
    case COMPONENT_TYPES.PARAGRAPH:
      return { content: 'New paragraph text.', props: { size: 'md' } };
    case COMPONENT_TYPES.TEXT:
      return { content: 'New text.', props: { size: 'md' } };
    case COMPONENT_TYPES.BUTTON:
      return { content: 'Button', props: { variant: 'primary', size: 'md' } };
    case COMPONENT_TYPES.DIVIDER:
      return { props: {} };
    case COMPONENT_TYPES.IMAGE:
      return { props: { src: 'https://placehold.co/600x300', alt: 'Placeholder' } };
    default:
      return { content: '', props: {} };
  }
}

const notFoundError = () => {
  const err = new Error('Page not found');
  err.code = 'NOT_FOUND';
  return err;
};

const writeError = () => {
  const err = new Error('Database write operation failed (mock: writeError scenario)');
  err.code = 'DB_WRITE';
  return err;
};

/**
 * Create a stateful mock page store.
 * @param {Object} [options]
 * @param {keyof typeof SCENARIOS} [options.scenario='page']
 * @param {number} [options.latency] - Override the per-request latency in ms.
 * @returns {object} Store exposing the `createMethods` surface plus `isMock`.
 */
export function createPageStore({ scenario = 'page', latency } = {}) {
  const config = SCENARIOS[scenario] || SCENARIOS.page;
  const delay = latency ?? config.latency ?? 180;

  const state = {
    page: config.read === 'notFound' ? null : seedPage((config.components || seedComponents)()),
  };

  const assertReadable = async () => {
    await wait(delay);
    if (config.read === 'notFound' || !state.page) throw notFoundError();
  };

  const assertWritable = async () => {
    await assertReadable();
    if (config.write) throw writeError();
  };

  async function getPage() {
    await assertReadable();
    return { ...state.page, components: [...state.page.components] };
  }

  async function getComponents() {
    await assertReadable();
    return [...state.page.components];
  }

  async function updatePage(_pageId, update) {
    await assertWritable();
    state.page = {
      ...state.page,
      ...('slug' in update ? { slug: update.slug } : {}),
      ...('meta' in update ? { meta: { ...state.page.meta, ...update.meta } } : {}),
      ...('components' in update ? { components: update.components } : {}),
      ...('settings' in update ? { settings: { ...state.page.settings, ...update.settings } } : {}),
    };
    return getPage();
  }

  async function deletePage() {
    await assertWritable();
    state.page = null;
    return { success: true };
  }

  async function addComponent(componentData) {
    await assertWritable();
    const type = componentData.type;
    const component = {
      id: generateComponentId(type, state.page.components),
      type,
      ...scaffold(type),
      ...componentData,
    };
    state.page = { ...state.page, components: [...state.page.components, component] };
    return component;
  }

  async function updateComponent(componentId, update) {
    await assertWritable();
    const components = state.page.components.map((c) =>
      c.id === componentId ? { ...c, ...update } : c
    );
    state.page = { ...state.page, components };
    return components.find((c) => c.id === componentId) || null;
  }

  async function removeComponent(componentId) {
    await assertWritable();
    state.page = {
      ...state.page,
      components: state.page.components.filter((c) => c.id !== componentId),
    };
    return getPage();
  }

  async function reorderComponents(_pageId, componentIds) {
    await assertWritable();
    const byId = new Map(state.page.components.map((c) => [c.id, c]));
    const components = componentIds
      .map((id, index) => (byId.has(id) ? { ...byId.get(id), order: index } : null))
      .filter(Boolean);
    state.page = { ...state.page, components };
    return components;
  }

  return {
    isMock: true,
    scenario,
    getPage,
    getComponents,
    updatePage,
    deletePage,
    addComponent,
    updateComponent,
    removeComponent,
    reorderComponents,
  };
}
