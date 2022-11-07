import { EJSON } from '@parameter1/mongodb-bson';

export class PaginationCursor {
  static decode(str) {
    return EJSON.parse(Buffer.from(str, 'base64url').toString('utf8'));
  }

  static encode(obj) {
    return Buffer.from(EJSON.stringify(obj), 'utf8').toString('base64url');
  }
}
