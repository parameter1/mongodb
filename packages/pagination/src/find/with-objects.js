import orderBy from 'lodash.orderby';
import { sluggify } from '@parameter1/slug';
import Joi, { attempt } from 'joi';
import { get } from '@parameter1/object-path';
import { isFunction as isFn } from '@parameter1/utils';
import sift from 'sift';
import { PaginationCursor } from '../cursor.js';
import props from '../props.js';

import edgesToReturn from './with-objects/edges-to-return.js';
import hasPreviousPage from './with-objects/has-previous-page.js';
import hasNextPage from './with-objects/has-next-page.js';

/**
 * @typedef {import("@parameter1/mongodb-core").Document} Document
 *
 * @typedef FindWithObjectsParams
 * @prop {string} [idPath] The path that contains the unique identifier of each document.
 *                                 Defaults to `node._id`
 * @prop {import("sift").Query} [query] A MongoDB-like query to filter the documents using `sift`.
 * @prop {FindWithObjectsParamsSort[]} [sort]
 * @prop {number} [limit=10]
 * @prop {string} [cursor]
 * @prop {string} [direction=AFTER]
 *
 * @typedef FindWithObjectsParamsSort
 * @prop {string} field
 * @prop {number} order
 *
 * @param {Document[]|Function} docs The documents to process, either as an array of objects or a
 *                                   function that returns an array of objects.
 * @param {FindWithObjectsParams} params
 */
export async function findWithObjects(docs, params) {
  attempt(docs, Joi.alternatives().try(
    Joi.array().items(Joi.object()),
    Joi.func(),
  ));
  const {
    idPath,
    query,
    sort,
    limit,
    cursor,
    direction,
  } = attempt(params, Joi.object({
    idPath: Joi.string().trim().default('node._id'),
    query: props.query,
    sort: Joi.array().items(
      Joi.object({
        field: props.sortField.required(),
        order: props.sortOrder.required(),
      }),
    ).default([]),
    limit: props.limit,
    cursor: props.edgeCursor,
    direction: props.cursorDirection,
  }).default());

  const sortFieldMap = sort.reduce((map, { field, order }) => {
    map.set(field, order === 1 ? 'asc' : 'desc');
    return map;
  }, new Map());
  if (!sortFieldMap.has(idPath)) sortFieldMap.set(idPath, 'asc');

  let allEdges = (isFn(docs) ? await docs() : (docs || []))
    // filter based on the query
    .filter(sift(query))
    // then apply the cursor
    .map((edge) => {
      const id = get(edge, idPath);
      if (!id) throw new Error(`Unable to extract a node ID using path ${idPath} for edge ${JSON.stringify(edge)}`);
      return { ...edge, cursor: PaginationCursor.encode(id) };
    });

  allEdges = orderBy(
    allEdges,
    [...sortFieldMap.keys()].map((path) => (o) => {
      const v = get(o, path);
      if (typeof v === 'string') return sluggify(v);
      return v;
    }),
    [...sortFieldMap.values()],
  );

  const {
    first,
    after,
    last,
    before,
  } = {
    ...(direction === 'AFTER' && {
      first: limit,
      after: cursor,
    }),
    ...(direction === 'BEFORE' && {
      last: limit,
      before: cursor,
    }),
  };

  const toReturn = edgesToReturn({
    allEdges,
    before,
    after,
    first,
    last,
  });

  return {
    totalCount: allEdges.length,
    edges: toReturn,
    pageInfo: {
      hasPreviousPage: () => hasPreviousPage({
        allEdges,
        before,
        after,
        first,
        last,
      }),
      hasNextPage: () => hasNextPage({
        allEdges,
        before,
        after,
        first,
        last,
      }),
      endCursor: async () => {
        const lastEdge = toReturn[toReturn.length - 1];
        return lastEdge ? lastEdge.cursor : '';
      },
      startCursor: async () => {
        const [firstEdge] = toReturn;
        return firstEdge ? firstEdge.cursor : '';
      },
    },
  };
}
