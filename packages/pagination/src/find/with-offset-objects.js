import orderBy from 'lodash.orderby';
import { sluggify } from '@parameter1/slug';
import Joi from 'joi';
import { get } from '@parameter1/object-path';
import { isFunction as isFn } from '@parameter1/utils';
import sift from 'sift';
import { PaginationCursor } from '../cursor.js';
import props from '../props.js';

/**
 * @typedef {import("@parameter1/mongodb-core").Document} Document
 *
 * @typedef FindWithObjectsParams
 * @prop {string} [idPath] The path that contains the unique identifier of each document.
 *                                 Defaults to `node._id`
 * @prop {import("sift").Query} [query] A MongoDB-like query to filter the documents using `sift`.
 * @prop {FindWithObjectsParamsSort[]} [sort]
 * @prop {number} [limit=10]
 * @prop {number} [offset=0]
 *
 * @typedef FindWithObjectsParamsSort
 * @prop {string} field
 * @prop {number} order
 *
 * @param {Document[]|Function} docs The documents to process, either as an array of objects or a
 *                                   function that returns an array of objects.
 * @param {FindWithObjectsParams} params
 */
export async function findWithOffsetObjects(docs, params) {
  Joi.attempt(docs, Joi.alternatives().try(
    Joi.array().items(Joi.object()),
    Joi.func(),
  ));
  const {
    idPath,
    query,
    sort,
    limit,
    offset,
  } = Joi.attempt(params, Joi.object({
    idPath: Joi.string().trim().default('node._id'),
    query: props.query,
    sort: Joi.array().items(
      Joi.object({
        field: props.sortField.required(),
        order: props.sortOrder.required(),
      }),
    ).default([]),
    limit: props.limit,
    offset: props.offset,
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

  const slice = () => allEdges.slice(offset, limit + offset);

  return {
    totalCount: allEdges.length,
    edges: slice(),
    pageInfo: {
      startOffset: offset,
      endOffset: () => {
        if (!allEdges.length) return null;
        return offset + slice().length;
      },
      hasNextPage: allEdges.length > offset + limit,
      hasPreviousPage: () => {
        if (!offset) return false;
        const index = (offset + limit) - 1;
        return Boolean(allEdges[index]);
      },
      endCursor: async () => {
        const sliced = slice();
        const lastEdge = sliced[sliced.length - 1];
        return lastEdge ? lastEdge.cursor : '';
      },
      startCursor: async () => {
        const sliced = slice();
        const [firstEdge] = sliced;
        return firstEdge ? firstEdge.cursor : '';
      },
    },
  };
}
