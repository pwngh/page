/**
 * Logical store names and index definitions for page data.
 */
export const DB = {
  COLLECTIONS: {
    PROJECTS: 'projects',
    PAGES: 'pages',
    COMPONENTS: 'components'
  },
  INDEXES: {
    PAGES: [
      { key: { projectId: 1, slug: 1 }, unique: true },
      { key: { updatedAt: -1 } }
    ],
    COMPONENTS: [
      { key: { pageId: 1, order: 1 } },
      { key: { pageId: 1, type: 1 } }
    ]
  }
};

/**
 * Component type identifiers accepted by validateComponent.
 */
export const COMPONENT_TYPES = {
  ACCORDION: 'accordion',
  ASPECT_RATIO: 'aspect_ratio',
  BANNER: 'banner',
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
  CONTAINER: 'container',
  DIVIDER: 'divider',
  FORM: 'form',
  GRID: 'grid',
  IMAGE: 'image',
  INPUT: 'input',
  LINK: 'link',
  LIST: 'list',
  MEGA_MENU: 'mega_menu',
  PARAGRAPH: 'paragraph',
  RADIO: 'radio',
  SECTION: 'section',
  SELECT: 'select',
  SPACE: 'space',
  STACK: 'stack',
  TEXT: 'text',
  TEXTAREA: 'textarea',
  TITLE: 'title'
};

/**
 * Fallback page metadata applied when a page is created without meta.
 */
export const DEFAULT_META = {
  title: 'Untitled Page',
  description: 'No description provided'
};

export const SIZE_MAPPINGS = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

export const COLOR_MAPPINGS = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  error: 'text-red-600'
};

export const CONTAINER_MAX_WIDTHS = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full'
};

export const GRID_COLUMNS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12'
};

/**
 * Spacing scale (Tailwind step to rem value).
 */
export const SPACING = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem'
};

/**
 * Per-type default props merged under caller props by mergeComponentProps.
 */
export const DEFAULT_COMPONENT_PROPS = {
  title: {
    size: 'lg',
    align: 'left'
  },
  text: {
    size: 'md',
    weight: 'normal'
  },
  button: {
    variant: 'primary',
    size: 'md'
  },
  list: {
    type: 'unordered'
  },
  container: {
    maxWidth: 'lg',
    padding: SPACING[4]
  },
  grid: {
    columns: 12,
    gap: 4
  },
  section: {
    padding: SPACING[8]
  }
};

/**
 * User-facing error messages keyed by failure class.
 */
export const ERROR_MESSAGES = {
  // Database Errors
  DB_CONNECTION: 'Failed to connect to database',
  DB_QUERY: 'Database query failed',
  DB_WRITE: 'Database write operation failed',

  // Validation
  INVALID_PAGE: 'Invalid page data provided',
  INVALID_COMPONENT: 'Invalid component type provided',
  MISSING_REQUIRED_PROPS: 'Missing required component properties',

  // Not Found
  PAGE_NOT_FOUND: 'Page not found',
  COMPONENT_NOT_FOUND: 'Component not found'
};
