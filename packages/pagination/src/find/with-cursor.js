// import { attempt, PropTypes, validateAsync } from '@mindful-cms/prop-types';
import { EJSON } from '@parameter1/mongodb-bson';
import Joi from 'joi';
import { mongoCollectionProp } from '@parameter1/mongodb-prop-types';
import { invertSort } from '../utils/invert-sort.js';
import { createCursorQuery } from '../utils/create-cursor-query.js';
import { PaginationCursor } from '../cursor.js';
import props from '../props.js';

/**
 * @typedef {import("@parameter1/mongodb-core").Collection} Collection
 * @typedef {import("@parameter1/mongodb-core").Document} Document
 * @typedef {import("@parameter1/mongodb-core").Filter} Filter
 */

const prepareQueryOptions = ({
  direction,
  sort,
  limit,
  projection,
} = {}) => {
  const $sort = {
    [sort.field]: sort.order,
    _id: sort.order, // always include id, last.
  };
  return {
    // invert the sort when doing before queries
    sort: direction === 'BEFORE' ? invertSort($sort) : $sort,
    limit: limit + 1, // peek for another record
    projection: { ...projection, _id: 1 },
  };
};

/**
 *
 * @param {Collection} collection
 * @param {object} params
 * @returns {Promise<object>}
 */
const executeQuery = async (collection, {
  query,
  options,
  direction,
  limit,
} = {}) => {
  const results = await collection.find(query, options).toArray();
  if (direction === 'BEFORE') results.reverse();
  const hasMoreResults = results.length > limit;
  // Remove the extra model that was queried to peek for the next/previous page.
  const fnName = direction === 'BEFORE' ? 'shift' : 'pop';
  if (hasMoreResults) results[fnName]();
  return { hasMoreResults, results };
};

const buildEdges = async ({ runQuery, formatEdgeFn }) => {
  const { results } = await runQuery();
  const formatter = typeof formatEdgeFn === 'function' ? formatEdgeFn : (edge) => edge;
  return results.map((node) => (formatter({
    node,
    cursor: () => PaginationCursor.encode(node._id),
  })));
};

/**
 * @typedef FindWithCursorParams
 * @prop {Filter} [query]
 * @prop {FindWithCursorParamsSort} sort
 * @prop {number} [limit=10]
 * @prop {string} [cursor]
 * @prop {string} [direction=AFTER]
 * @prop {Document} [projection]
 * @prop {function} [formatEdgeFn]
 *
 * @typedef FindWithCursorParamsSort
 * @prop {string} [field=_id]
 * @prop {number} [order=1]
 *
 * @param {Collection} collection
 * @param {FindWithCursorParams} params
 */
export async function findWithCursor(collection, params) {
  Joi.attempt(collection, mongoCollectionProp.required());
  /** @type {FindWithCursorParams} */
  const {
    query,
    sort,
    limit,
    cursor,
    direction,
    projection,
    formatEdgeFn,
  } = Joi.attempt(params, Joi.object({
    query: props.query,
    sort: props.sort,
    limit: props.limit,
    cursor: props.edgeCursor,
    direction: props.cursorDirection,
    projection: props.projection,
    formatEdgeFn: Joi.func(),
  }).default());

  const queryOptions = prepareQueryOptions({
    direction,
    sort,
    limit,
    projection,
  });

  // build the query criteria when a cursor value is present.
  const cursorQuery = await createCursorQuery(collection, { cursor, direction, sort });
  // build the final pagination query
  const paginationQuery = cursorQuery ? { $and: [cursorQuery, query] } : query;

  let promise;
  const runQuery = () => {
    if (promise) return promise;
    promise = executeQuery(collection, {
      query: paginationQuery,
      options: queryOptions,
      direction,
      limit,
    });
    return promise;
  };

  const hasAnotherPage = async (search, replace) => {
    if (!cursor) return false;
    const { results } = await runQuery();
    if (!results.length) return false;
    // cursor exists, check for previous document.
    const pageQuery = EJSON.parse(EJSON.stringify(cursorQuery)
      .replace(search, replace));
    const doc = await collection.findOne({ $and: [pageQuery, query] }, {
      projection: { _id: 1 },
      sort: queryOptions.sort, // must use prepared sort (handle inversion)
    });
    return Boolean(doc);
  };

  return {
    // use the base query, not the cursor query, to count all docs
    totalCount: () => collection.countDocuments(query),
    edges: () => buildEdges({ runQuery, formatEdgeFn }),
    pageInfo: {
      hasNextPage: async () => {
        if (direction === 'AFTER') {
          const { hasMoreResults } = await runQuery();
          return hasMoreResults;
        }
        // in before mode, check for next page.
        return hasAnotherPage(/"\$lt":/g, '"$gte":');
      },
      hasPreviousPage: async () => {
        if (direction === 'BEFORE') {
          const { hasMoreResults } = await runQuery();
          return hasMoreResults;
        }
        // in after mode, check for previous page.
        return hasAnotherPage(/"\$gt":/g, '"$lte":');
      },
      startCursor: async () => {
        const { results } = await runQuery();
        const [firstNode] = results;
        return firstNode ? PaginationCursor.encode(firstNode._id) : '';
      },
      endCursor: async () => {
        const { results } = await runQuery();
        const lastNode = results[results.length - 1];
        return lastNode ? PaginationCursor.encode(lastNode._id) : '';
      },
    },
  };
}
