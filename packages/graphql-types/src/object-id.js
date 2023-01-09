import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language/index.js';
import { ObjectId } from '@parameter1/mongodb-bson';

const pattern = /^[0-9a-f]{24}$/i;

const createError = (value) => new TypeError(`The provided value "${value}" is not a valid ObjectID.`);

const createFromString = (value) => {
  if (value && typeof value === 'object' && pattern.test(value)) {
    return ObjectId.createFromHexString(`${value}`);
  }
  if (typeof value !== 'string' || !pattern.test(value)) {
    throw createError(value);
  }
  return ObjectId.createFromHexString(value);
};

export const GraphQLObjectId = new GraphQLScalarType({
  name: 'ObjectID',
  description: 'MongoDB ObjectID type.',
  parseValue(value) {
    return createFromString(value);
  },
  serialize(value) {
    if (value instanceof ObjectId) return value.toHexString();
    try {
      return createFromString(value);
    } catch (e) {
      return null;
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return createFromString(ast.value);
    throw createError(ast.value);
  },
});
