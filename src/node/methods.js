// @ts-check

import { DEFAULT_META, ERROR_MESSAGES } from '../shared/constants.js';
import {
  validateComponent,
  formatError,
  createDbError
} from '../shared/utils.js';

/** Throws a VALIDATION_ERROR when any component is missing an id or has an unknown type. */
const assertComponentsValid = (components) => {
  for (const component of components) {
    if (!validateComponent(component)) {
      throw createDbError(
        ERROR_MESSAGES.INVALID_COMPONENT,
        'VALIDATION_ERROR',
        { componentId: component.id }
      );
    }
  }
};

/**
 * Create the page data-access layer bound to a database client.
 *
 * Pages live in the `pages_ref` table with their components embedded as a
 * JSON column; deletes are soft (Page_Active = 0). Every method scopes its
 * queries to the client's projectId and throws a formatted error object
 * (see formatError) whose `code` distinguishes NOT_FOUND and
 * VALIDATION_ERROR from database failures.
 *
 * @param {import('./client.js').PageDbClient} db - Connected client from createClient.
 * @returns {Object} Page methods: createPage, getPage, updatePage, deletePage, getComponents, updateComponent, reorderComponents.
 */
export const createMethods = (db) => {
  /**
   * Insert a new page and return the stored record.
   *
   * Fills in DEFAULT_META, an empty component list, and empty settings for
   * anything not supplied; provided components are validated first.
   *
   * @param {Partial<import('../shared/types').PageData>} pageData - Page fields; projectId is taken from the client.
   * @returns {Promise<import('../shared/types').PageData>} The page as persisted, fetched by its new id.
   */
  const createPage = async (pageData) => {
    try {
      const page = {
        projectId: db.projectId,
        meta: { ...DEFAULT_META, ...pageData.meta },
        components: [],
        settings: {},
        ...pageData
      };

      if (page.components?.length) {
        assertComponentsValid(page.components);
      }

      const query = `
        INSERT INTO pages_ref (
          Project_Id,
          Page_Slug,
          Page_Meta,
          Page_Components,
          Page_Settings
        ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?
        )
      `;

      const values = [
        page.projectId,
        page.slug || null,
        JSON.stringify(page.meta),
        JSON.stringify(page.components),
        JSON.stringify(page.settings)
      ];

      const [result] = await db.pool.execute(query, values);
      const pageId = result.insertId;

      return getPage(pageId.toString());
    } catch (error) {
      throw formatError(error, ERROR_MESSAGES.DB_WRITE);
    }
  };

  /**
   * Fetch an active page by id or slug.
   *
   * @param {string} identifier - Page ID or slug; matched against both columns.
   * @returns {Promise<import('../shared/types').PageData>} The page row mapped to camelCase fields.
   */
  const getPage = async (identifier) => {
    try {
      const query = `
        SELECT
          Page_Id as id,
          Project_Id as projectId,
          Page_Slug as slug,
          Page_Meta as meta,
          Page_Components as components,
          Page_Settings as settings,
          Created_UTC_DateTime as createdAt
        FROM pages_ref
        WHERE Project_Id = ? AND (Page_Id = ? OR Page_Slug = ?) AND Page_Active = 1
      `;

      const [rows] = await db.pool.execute(query, [
        db.projectId,
        identifier,
        identifier
      ]);

      if (!rows.length) {
        throw createDbError(
          ERROR_MESSAGES.PAGE_NOT_FOUND,
          'NOT_FOUND',
          { identifier }
        );
      }

      return { ...rows[0] };
    } catch (error) {
      throw formatError(error, ERROR_MESSAGES.DB_QUERY);
    }
  };

  /**
   * Apply a partial update to an active page.
   *
   * Only the supplied fields (slug, meta, components, settings) are written;
   * an empty update returns the current page unchanged. Supplied components
   * are validated before the write.
   *
   * @param {string} pageId - Page to update.
   * @param {Partial<import('../shared/types').PageData>} update - Fields to overwrite; JSON fields are replaced whole, not merged.
   * @returns {Promise<import('../shared/types').PageData>} The page as stored after the update.
   */
  const updatePage = async (pageId, update) => {
    try {
      if (update.components?.length) {
        assertComponentsValid(update.components);
      }

      const updates = [];
      const values = [];

      if (update.slug !== undefined) {
        updates.push('Page_Slug = ?');
        values.push(update.slug);
      }

      if (update.meta !== undefined) {
        updates.push('Page_Meta = ?');
        values.push(JSON.stringify(update.meta));
      }

      if (update.components !== undefined) {
        updates.push('Page_Components = ?');
        values.push(JSON.stringify(update.components));
      }

      if (update.settings !== undefined) {
        updates.push('Page_Settings = ?');
        values.push(JSON.stringify(update.settings));
      }

      if (!updates.length) {
        return getPage(pageId);
      }

      const query = `
        UPDATE pages_ref
        SET ${updates.join(', ')}
        WHERE Page_Id = ? AND Project_Id = ? AND Page_Active = 1
      `;

      values.push(pageId, db.projectId);

      const [result] = await db.pool.execute(query, values);

      if (!result.affectedRows) {
        throw createDbError(
          ERROR_MESSAGES.PAGE_NOT_FOUND,
          'NOT_FOUND',
          { pageId }
        );
      }

      return getPage(pageId);
    } catch (error) {
      throw formatError(error, ERROR_MESSAGES.DB_WRITE);
    }
  };

  /**
   * Soft-delete a page by clearing its active flag.
   *
   * The row is retained; subsequent reads and writes no longer see it.
   *
   * @param {string} pageId - Page to delete.
   * @returns {Promise<void>} Resolves once the page is deactivated.
   */
  const deletePage = async (pageId) => {
    try {
      const query = `
        UPDATE pages_ref
        SET Page_Active = 0
        WHERE Page_Id = ? AND Project_Id = ? AND Page_Active = 1
      `;

      const [result] = await db.pool.execute(query, [pageId, db.projectId]);

      if (!result.affectedRows) {
        throw createDbError(
          ERROR_MESSAGES.PAGE_NOT_FOUND,
          'NOT_FOUND',
          { pageId }
        );
      }
    } catch (error) {
      throw formatError(error, ERROR_MESSAGES.DB_WRITE);
    }
  };

  /**
   * Read the component list of a page.
   *
   * @param {string} pageId - Page identifier.
   * @returns {Promise<import('../shared/types').ComponentBase[]>} Components in stored order; empty when the page is missing or has none.
   */
  const getComponents = async (pageId) => {
    try {
      const sqlQuery = `
        SELECT Page_Components as components
        FROM pages_ref
        WHERE Page_Id = ? AND Project_Id = ? AND Page_Active = 1
      `;

      const [rows] = await db.pool.execute(sqlQuery, [pageId, db.projectId]);

      if (!rows.length) {
        return [];
      }

      const components = rows[0].components;
      return Array.isArray(components) ? components : [];
    } catch (error) {
      throw formatError(error, ERROR_MESSAGES.DB_QUERY);
    }
  };

  /**
   * Merge an update into one component, transactionally.
   *
   * Locates the owning page by searching component ids across the project,
   * validates the merged component, and rewrites the page's component list
   * in a single transaction.
   *
   * @param {string} componentId - Component to update; must exist on an active page.
   * @param {Partial<import('../shared/types').ComponentBase>} update - Fields merged over the stored component.
   * @returns {Promise<import('../shared/types').ComponentBase>} The component after the merge.
   */
  const updateComponent = async (componentId, update) => {
    return db.withTransaction(async (connection) => {
      const pageQuery = `
        SELECT Page_Id, Page_Components
        FROM pages_ref
        WHERE Project_Id = ? AND Page_Active = 1
        AND JSON_CONTAINS(Page_Components, JSON_OBJECT('id', ?))
      `;

      const [pages] = await connection.execute(pageQuery, [db.projectId, componentId]);

      if (!pages.length) {
        throw createDbError(
          ERROR_MESSAGES.COMPONENT_NOT_FOUND,
          'NOT_FOUND',
          { componentId }
        );
      }

      const page = pages[0];
      const components = page.Page_Components || [];

      const componentIndex = components.findIndex(c => c.id === componentId);
      const updatedComponent = {
        ...components[componentIndex],
        ...update
      };

      if (!validateComponent(updatedComponent)) {
        throw createDbError(
          ERROR_MESSAGES.INVALID_COMPONENT,
          'VALIDATION_ERROR',
          { componentId }
        );
      }

      components[componentIndex] = updatedComponent;

      const updateQuery = `
        UPDATE pages_ref
        SET Page_Components = ?
        WHERE Page_Id = ? AND Project_Id = ? AND Page_Active = 1
      `;

      await connection.execute(updateQuery, [
        JSON.stringify(components),
        page.Page_Id,
        db.projectId
      ]);

      return updatedComponent;
    });
  };

  /**
   * Rewrite a page's component order, transactionally.
   *
   * Each component's `order` field is set to its index in componentIds;
   * ids missing from the page abort the transaction.
   *
   * @param {string} pageId - Page whose components are reordered.
   * @param {string[]} componentIds - Complete list of the page's component ids in the desired order.
   * @returns {Promise<import('../shared/types').ComponentBase[]>} The reordered component list as stored.
   */
  const reorderComponents = async (pageId, componentIds) => {
    return db.withTransaction(async (connection) => {
      const [pages] = await connection.execute(
        'SELECT Page_Components FROM pages_ref WHERE Page_Id = ? AND Project_Id = ? AND Page_Active = 1',
        [pageId, db.projectId]
      );

      if (!pages.length) {
        throw createDbError(
          ERROR_MESSAGES.PAGE_NOT_FOUND,
          'NOT_FOUND',
          { pageId }
        );
      }

      const components = pages[0].Page_Components || [];
      const reorderedComponents = componentIds.map((id, index) => {
        const component = components.find(c => c.id === id);
        if (!component) {
          throw createDbError(
            ERROR_MESSAGES.COMPONENT_NOT_FOUND,
            'NOT_FOUND',
            { componentId: id }
          );
        }
        return {
          ...component,
          order: index
        };
      });

      await connection.execute(
        'UPDATE pages_ref SET Page_Components = ? WHERE Page_Id = ? AND Project_Id = ? AND Page_Active = 1',
        [JSON.stringify(reorderedComponents), pageId, db.projectId]
      );

      return reorderedComponents;
    });
  };

  return {
    createPage,
    getPage,
    updatePage,
    deletePage,
    getComponents,
    updateComponent,
    reorderComponents
  };
};
