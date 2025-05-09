import { EJSON } from '@parameter1/mongodb-bson';
import { GraphQLScalarType } from 'graphql';

function ensureObject(value) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(
      `EJSONObject cannot represent non-object value: ${value}`,
    );
  }
  return value;
}

export const GraphQLEJSONObject = new GraphQLScalarType({
  name: 'EJSONObject',
  description: 'The `EJSONObject` scalar type represents Extended-JSON (BSON) objects',
  serialize(value) {
    return EJSON.stringify(ensureObject(value));
  },
  parseValue(value) {
    return ensureObject(value);
  },
  parseLiteral() {
    throw new Error('Parsing literal EJSONObjects is not supported.');
  },
});
