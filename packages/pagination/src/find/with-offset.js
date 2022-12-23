import Joi from 'joi';
import { mongoCollectionProp } from '@parameter1/mongodb-prop-types';
import { PaginationCursor } from '../cursor.js';
import props from '../props.js';

/**
 * @typedef FindWithOffsetParams
 * @prop {Filter} [query]
 * @prop {FindWithOffsetParamsSort} sort
 * @prop {number} [limit=10]
 * @prop {number} [offset=10]
 * @prop {import("mongodb").Document} [projection]
 * @prop {function} [formatEdgeFn]
 * @prop {function} [onLoadEdgesFn]
 *
 * @typedef FindWithOffsetParamsSort
 * @prop {string} [field=_id]
 * @prop {number} [order=1]
 *
 * @param {import("mongodb").Collection} collection
 * @param {FindWithOffsetParams} params
 */
export async function findWithOffset(collection, params) {
  Joi.attempt(collection, mongoCollectionProp.required());
  /** @type {FindWithOffsetParams} */
  const {
    query,
    sort,
    limit,
    offset,
    projection,
    formatEdgeFn,
    onLoadEdgesFn,
  } = Joi.attempt(params, Joi.object({
    query: props.query,
    sort: props.sort,
    limit: props.limit,
    offset: props.offset,
    projection: props.projection,
    formatEdgeFn: Joi.func(),
    onLoadEdgesFn: Joi.func(),
  }).default());

  let promise;
  const runQuery = () => {
    if (!promise) {
      // console.log(limit, limit + 1 + (offset ? 1 : 0));
      // console.log(offset, offset ? offset - 1 : offset);
      promise = (async () => {
        /** @type {object[]} */
        const results = await collection.find(query, {
          limit: limit + 1 + (offset ? 1 : 0),
          projection,
          sort: {
            [sort.field]: sort.order,
            _id: sort.order, // always include id, last.
          },
          skip: offset ? offset - 1 : offset,
        }).toArray();

        let previous;
        if (offset) previous = results.shift();

        const hasPreviousResults = Boolean(previous);
        const hasMoreResults = results.length > limit;
        if (hasMoreResults) results.pop();
        return { hasMoreResults, hasPreviousResults, results };
      })();
    }
    return promise;
  };

  return {
    totalCount: () => collection.countDocuments(query),
    edges: async () => {
      const { results } = await runQuery();
      if (typeof onLoadEdgesFn === 'function') onLoadEdgesFn(results);
      const formatter = typeof formatEdgeFn === 'function' ? formatEdgeFn : (edge) => edge;
      return results.map((node) => (formatter({
        node,
        cursor: () => PaginationCursor.encode(node._id),
      })));
    },
    pageInfo: {
      hasNextPage: async () => {
        const { hasMoreResults } = await runQuery();
        return hasMoreResults;
      },
      hasPreviousPage: async () => {
        const { hasPreviousResults } = await runQuery();
        return hasPreviousResults;
      },
      startOffset: offset,
      endOffset: async () => {
        const { results } = await runQuery();
        return offset + results.length;
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
