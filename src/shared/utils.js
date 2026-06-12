import { COMPONENT_TYPES, DEFAULT_COMPONENT_PROPS } from './constants.js';

/**
 * Validate the configuration shape required to open a database client.
 *
 * @param {import('./types.js').DBConfig} config - Must include string database/projectId and complete MySQL credentials.
 * @returns {boolean} True when the config is safe to pass to createClient.
 */
export const validateConfig = (config) => {
  return Boolean(
    config &&
    typeof config.database === 'string' &&
    typeof config.projectId === 'string' &&
    typeof config.credentials === 'object' &&
    typeof config.credentials.host === 'string' &&
    typeof config.credentials.port === 'number' &&
    typeof config.credentials.user === 'string' &&
    typeof config.credentials.password === 'string' &&
    typeof config.credentials.database === 'string'
  );
};

/**
 * Normalize any error into a serializable response payload.
 *
 * Stack traces are included only outside production so internals never
 * leak into deployed error responses.
 *
 * @param {Error} error - Source error; its `code` is preserved when present.
 * @param {string} [customMessage] - Replaces the original error message when provided.
 * @returns {{ error: true, message: string, code: string, details: (string|undefined) }} Plain object safe to send to clients.
 */
export const formatError = (error, customMessage) => {
  return {
    error: true,
    message: customMessage || error.message,
    code: error.code || 'UNKNOWN_ERROR',
    details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
  };
};

/**
 * Create an Error tagged with a machine-readable code and context metadata.
 *
 * @param {string} message - Human-readable message, typically from ERROR_MESSAGES.
 * @param {string} code - Machine-readable code (e.g. 'NOT_FOUND', 'VALIDATION_ERROR') used for status mapping.
 * @param {Object} [metadata] - Context attached to the error (ids, offending values).
 * @returns {Error} Error carrying `code` and `metadata` properties.
 */
export const createDbError = (message, code, metadata = {}) => {
  const error = new Error(message);
  error.code = code;
  error.metadata = metadata;
  return error;
};

/**
 * Check that a component has an id and a recognized type.
 *
 * @param {import('./types.js').ComponentBase} component - Candidate component; `type` must be a COMPONENT_TYPES value.
 * @returns {boolean} True when the component may be persisted.
 */
export const validateComponent = (component) => {
  return Boolean(
    component &&
    component.id &&
    Object.values(COMPONENT_TYPES).includes(component.type)
  );
};

/**
 * Merge component props over the defaults registered for the type.
 *
 * @param {import('./types.js').ComponentType} type - Looks up DEFAULT_COMPONENT_PROPS; unknown types merge over nothing.
 * @param {Object} [props] - Caller props; win over defaults key-by-key.
 * @returns {Object} New props object; inputs are not mutated.
 */
export const mergeComponentProps = (type, props = {}) => {
  const defaultProps = DEFAULT_COMPONENT_PROPS[type] || {};
  return { ...defaultProps, ...props };
};

/**
 * Append query parameters to a URL, skipping null and undefined values.
 *
 * @param {string} baseUrl - URL without a query string.
 * @param {Object} [params] - Values are stringified; null/undefined entries are omitted.
 * @returns {string} The base URL, with `?key=value` pairs when any params survive filtering.
 */
export const createUrlWithParams = (baseUrl, params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      searchParams.append(key, value.toString());
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Join class names, dropping falsy values and flattening one array level.
 *
 * Object arguments contribute each key whose value is truthy, enabling
 * `cn('btn', { active: isActive })` conditionals.
 *
 * @param  {...(string|Object|boolean|undefined)} classes - Class names, conditionals, or arrays of either.
 * @returns {string} Single space-separated class string.
 */
export const cn = (...classes) => {
  return classes
    .flat()
    .filter(Boolean)
    .map(c => {
      if (typeof c === 'object') {
        return Object.entries(c)
          .filter(([_, value]) => Boolean(value))
          .map(([className]) => className)
          .join(' ')
      }
      return c
    })
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ');
};

/**
 * True when executing in a browser (window is defined).
 * @type {boolean}
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Create a promise whose resolve/reject are exposed to the caller.
 *
 * @returns {{ promise: Promise, resolve: Function, reject: Function }} The pending promise and its settle functions.
 */
export const createDeferred = () => {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

/**
 * Apply an input mask to a raw field value based on the input type.
 *
 * Supported types: 'tel' (555-123-4567), 'card-number' (groups of four),
 * 'card-expiration' (MM/YY), and 'dollar' (strips non-numeric characters
 * and leading zeros). Other types — and empty values — pass through unchanged.
 *
 * @param {string} value - Raw user input.
 * @param {string} type - Input type selecting the mask.
 * @returns {string} The masked value.
 */
export const formatValue = (value, type) => {
  if (!value) return value;

  switch (type) {
    case 'tel':
      return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
        .substring(0, 12);

    case 'card-number':
      return value
        .replace(/\D/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .substring(0, 19);

    case 'card-expiration':
      return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d{0,2})/, '$1/$2')
        .substring(0, 5);

    case 'dollar':
      return value
        .replace(/[^\d.]/g, '')
        .replace(/^0+(?=\d)/, '');

    default:
      return value;
  }
};
