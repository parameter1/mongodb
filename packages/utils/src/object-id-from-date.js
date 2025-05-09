import { ObjectId } from '@parameter1/mongodb-bson';

/**
 * @param {Date} value
 */
export function objectIdFromDate(date) {
  // hex seconds since epoch
  const hexSeconds = Math.floor(date.valueOf() / 1000).toString(16);
  return new ObjectId(`${hexSeconds}`.padEnd(24, '0'));
}
