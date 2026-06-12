// @ts-check

import mysql from 'mysql2/promise';
import { ERROR_MESSAGES } from '../shared/constants.js';
import { validateConfig, createDbError, formatError } from '../shared/utils.js';

/**
 * Default MySQL connection options
 * @type {import('mysql2').ConnectionOptions}
 */
const DEFAULT_OPTIONS = {
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: 'Z',
  dateStrings: true,
  multipleStatements: false,
  namedPlaceholders: true
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

/**
 * @typedef {Object} PageDbClient
 * @property {import('mysql2/promise').Pool} pool - Live connection pool.
 * @property {string} database - Schema name queries run against.
 * @property {string} projectId - Project scope applied to every query.
 * @property {() => Promise<void>} disconnect - Drains and closes the pool.
 * @property {<T>(fn: (connection: import('mysql2/promise').PoolConnection) => Promise<T>) => Promise<T>} withTransaction - Runs fn inside a transaction; commits on success, rolls back on error.
 */

/**
 * Open a MySQL connection pool scoped to one project's pages.
 *
 * Verifies connectivity with up to three pings (linear backoff) before
 * resolving; on persistent failure the pool is closed and a formatted
 * error object is thrown.
 *
 * @param {import('../shared/types').DBConfig & { credentials: import('../shared/types').MySQLCredentials }} config - Validated with validateConfig; `options` overrides the package pool defaults.
 * @returns {Promise<PageDbClient>} Connected client handle for createMethods, createLoader, and createActions.
 * @throws {Error} INVALID_CONFIG when the config shape is incomplete.
 */
export const createClient = async (config) => {
  if (!validateConfig(config)) {
    throw createDbError(
      ERROR_MESSAGES.DB_CONNECTION,
      'INVALID_CONFIG'
    );
  }

  const { credentials, database, projectId, options = {} } = config;

  const poolConfig = {
    ...DEFAULT_OPTIONS,
    ...credentials,
    ...options
  };

  const pool = await mysql.createPool(poolConfig);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      break;
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        await pool.end();
        throw formatError(error, ERROR_MESSAGES.DB_CONNECTION);
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
    }
  }

  /**
   * Drain and close the pool; in-flight queries complete first.
   * @returns {Promise<void>}
   */
  const disconnect = async () => {
    try {
      await pool.end();
    } catch (error) {
      throw formatError(error, 'Failed to disconnect from MySQL');
    }
  };

  /**
   * Run fn on a dedicated connection inside a transaction.
   *
   * Commits when fn resolves, rolls back when it rejects; the connection
   * is always released.
   *
   * @template T
   * @param {(connection: import('mysql2/promise').PoolConnection) => Promise<T>} fn - Receives the transactional connection; must use it for every statement.
   * @returns {Promise<T>} Whatever fn resolves with.
   */
  const withTransaction = async (fn) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await fn(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw formatError(error, ERROR_MESSAGES.DB_WRITE);
    } finally {
      connection.release();
    }
  };

  return {
    pool,
    database,
    projectId,
    disconnect,
    withTransaction
  };
};
