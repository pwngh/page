import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateConfig,
  formatError,
  createDbError,
  validateComponent,
  mergeComponentProps,
  createUrlWithParams,
  cn,
  createDeferred,
  formatValue
} from '../src/shared/utils.js';
import { DEFAULT_COMPONENT_PROPS } from '../src/shared/constants.js';

const validConfig = {
  database: 'app_db',
  projectId: '1',
  credentials: {
    host: 'localhost',
    port: 3306,
    user: 'app',
    password: 'secret',
    database: 'app_db'
  }
};

describe('validateConfig', () => {
  it('accepts a complete config', () => {
    assert.equal(validateConfig(validConfig), true);
  });

  it('rejects a missing config', () => {
    assert.equal(validateConfig(undefined), false);
    assert.equal(validateConfig({}), false);
  });

  it('rejects credentials with a non-numeric port', () => {
    const config = {
      ...validConfig,
      credentials: { ...validConfig.credentials, port: '3306' }
    };
    assert.equal(validateConfig(config), false);
  });

  it('rejects a config without a projectId', () => {
    const config = { ...validConfig };
    delete config.projectId;
    assert.equal(validateConfig(config), false);
  });
});

describe('formatError', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalEnv;
    }
  });

  it('preserves the error code and message', () => {
    const error = createDbError('Page not found', 'NOT_FOUND');
    const formatted = formatError(error);

    assert.equal(formatted.error, true);
    assert.equal(formatted.message, 'Page not found');
    assert.equal(formatted.code, 'NOT_FOUND');
  });

  it('prefers the custom message over the original', () => {
    const formatted = formatError(new Error('original'), 'friendly message');
    assert.equal(formatted.message, 'friendly message');
  });

  it('falls back to UNKNOWN_ERROR when the error has no code', () => {
    const formatted = formatError(new Error('boom'));
    assert.equal(formatted.code, 'UNKNOWN_ERROR');
  });

  it('includes the stack outside production', () => {
    process.env.NODE_ENV = 'development';
    const formatted = formatError(new Error('boom'));
    assert.equal(typeof formatted.details, 'string');
  });

  it('omits the stack in production', () => {
    process.env.NODE_ENV = 'production';
    const formatted = formatError(new Error('boom'));
    assert.equal(formatted.details, undefined);
  });
});

describe('createDbError', () => {
  it('returns an Error carrying code and metadata', () => {
    const error = createDbError('Invalid component', 'VALIDATION_ERROR', {
      componentId: 'text-1'
    });

    assert.ok(error instanceof Error);
    assert.equal(error.message, 'Invalid component');
    assert.equal(error.code, 'VALIDATION_ERROR');
    assert.deepEqual(error.metadata, { componentId: 'text-1' });
  });

  it('defaults metadata to an empty object', () => {
    assert.deepEqual(createDbError('boom', 'UNKNOWN').metadata, {});
  });
});

describe('validateComponent', () => {
  it('accepts a component with an id and a known type', () => {
    assert.equal(validateComponent({ id: 'text-1', type: 'text' }), true);
  });

  it('rejects a component without an id', () => {
    assert.equal(validateComponent({ type: 'text' }), false);
  });

  it('rejects an unknown type', () => {
    assert.equal(validateComponent({ id: 'x-1', type: 'bogus' }), false);
  });

  it('rejects missing input', () => {
    assert.equal(validateComponent(undefined), false);
    assert.equal(validateComponent(null), false);
  });
});

describe('mergeComponentProps', () => {
  it('fills in the registered defaults for the type', () => {
    const props = mergeComponentProps('button', {});
    assert.deepEqual(props, DEFAULT_COMPONENT_PROPS.button);
  });

  it('lets caller props win over defaults', () => {
    const props = mergeComponentProps('button', { variant: 'secondary' });
    assert.equal(props.variant, 'secondary');
    assert.equal(props.size, DEFAULT_COMPONENT_PROPS.button.size);
  });

  it('passes props through unchanged for types without defaults', () => {
    assert.deepEqual(mergeComponentProps('divider', { weight: 'thin' }), {
      weight: 'thin'
    });
  });

  it('does not mutate its inputs', () => {
    const input = { variant: 'secondary' };
    mergeComponentProps('button', input);
    assert.deepEqual(input, { variant: 'secondary' });
    assert.equal(DEFAULT_COMPONENT_PROPS.button.variant, 'primary');
  });
});

describe('createUrlWithParams', () => {
  it('appends params as a query string', () => {
    assert.equal(
      createUrlWithParams('/api/pages', { slug: 'home', limit: 10 }),
      '/api/pages?slug=home&limit=10'
    );
  });

  it('skips null and undefined values but keeps falsy ones', () => {
    assert.equal(
      createUrlWithParams('/api/pages', { a: null, b: undefined, c: 0, d: '' }),
      '/api/pages?c=0&d='
    );
  });

  it('returns the base URL untouched when nothing survives filtering', () => {
    assert.equal(createUrlWithParams('/api/pages', { a: null }), '/api/pages');
    assert.equal(createUrlWithParams('/api/pages'), '/api/pages');
  });
});

describe('cn', () => {
  it('joins class names and drops falsy values', () => {
    assert.equal(cn('a', false, null, undefined, 'b', ''), 'a b');
  });

  it('includes object keys whose values are truthy', () => {
    assert.equal(cn('btn', { active: true, disabled: false }), 'btn active');
  });

  it('flattens one array level', () => {
    assert.equal(cn(['a', 'b'], 'c'), 'a b c');
  });

  it('collapses repeated whitespace', () => {
    assert.equal(cn('a ', ' b', { ' c': true }), 'a b c');
  });
});

describe('createDeferred', () => {
  it('resolves the promise from outside', async () => {
    const { promise, resolve } = createDeferred();
    resolve('done');
    assert.equal(await promise, 'done');
  });

  it('rejects the promise from outside', async () => {
    const { promise, reject } = createDeferred();
    reject(new Error('nope'));
    await assert.rejects(promise, /nope/);
  });
});

describe('formatValue', () => {
  it('masks telephone numbers', () => {
    assert.equal(formatValue('5551234567', 'tel'), '555-123-4567');
    assert.equal(formatValue('(555) 123-4567', 'tel'), '555-123-4567');
  });

  it('groups card numbers in fours', () => {
    assert.equal(
      formatValue('4242424242424242', 'card-number'),
      '4242 4242 4242 4242'
    );
  });

  it('masks card expirations as MM/YY', () => {
    assert.equal(formatValue('1226', 'card-expiration'), '12/26');
    assert.equal(formatValue('12/26', 'card-expiration'), '12/26');
  });

  it('strips currency symbols and leading zeros from dollar values', () => {
    assert.equal(formatValue('$1,234.56', 'dollar'), '1234.56');
    assert.equal(formatValue('0042', 'dollar'), '42');
    assert.equal(formatValue('0.50', 'dollar'), '0.50');
  });

  it('passes unknown types and empty values through unchanged', () => {
    assert.equal(formatValue('hello', 'text'), 'hello');
    assert.equal(formatValue('', 'tel'), '');
  });
});
