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
