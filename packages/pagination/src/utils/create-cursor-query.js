import { get } from '@parameter1/object-path';
import Joi from 'joi';
import { mongoCollectionProp } from '@parameter1/mongodb-prop-types';
import props from '../props.js';
import { PaginationCursor } from '../cursor.js';

const opMap = new Map([
  [1, '$gt'],
  [-1, '$lt'],
]);

const arrayIndexPattern = /(^.+)(\.)(\d)/;

/**
 * @typedef {import("@parameter1/mongodb-core").Collection} Collection
 *
 * @typedef CreateCursorQueryParams
 * @prop {string} [cursor]
 * @prop {string} [direction=AFTER]
 * @prop {CreateCursorQueryParamsSort} sort
 *
 * @typedef CreateCursorQueryParamsSort
 * @prop {string} [field=_id]
 * @prop {number} [order=1]
 *
 * @param {Collection} collection
 * @param {CreateCursorQueryParams} params
 */
export async function createCursorQuery(collection, params) {
  Joi.attempt(collection, mongoCollectionProp.required());

  /** @type {CreateCursorQueryParams} */
  const { cursor, direction, sort } = Joi.attempt(params, Joi.object({
    cursor: props.edgeCursor,
    direction: props.cursorDirection,
    sort: props.sort,
  }).default());

  // no cursor provided. no additional query criteria is needed.
  if (!cursor) return null;
  const dir = direction === 'AFTER' ? 1 : -1;
  const id = PaginationCursor.decode(cursor);
  const { field, order } = sort;
  const op = opMap.get(order * dir);

  if (field === '_id') {
    // simple sort by id.
    return { _id: { [op]: id } };
  }

  // Compound sort.
  // Need to get the document so we can extract the field.
  // If the field contains an array position using dot notation, must use slice.
  // @see https://jira.mongodb.org/browse/SERVER-1831
  const matches = arrayIndexPattern.exec(field);
  const projection = {};
  if (matches && matches[1] && matches[3]) {
    projection[matches[1]] = { $slice: [Number(matches[3]), 1] };
  } else {
    projection[field] = 1;
  }

  // find the sort document
  const doc = await collection.findOne({ _id: id }, { projection });
  const value = get(doc, field);
  const $or = [
    { [field]: { [op]: value } },
    { [field]: { $eq: value }, _id: { [op]: id } },
  ];
  return { $or };
}
