import Joi from 'joi';

export default {
  query: Joi.object().default({}),
  limit: Joi.number().min(1).default(10),
  offset: Joi.number().min(0).default(0),
  sort: Joi.object({
    field: Joi.string().default('_id'),
    order: Joi.number().valid(1, -1).default(1),
  }).default(),
  projection: Joi.object(),
  edgeCursor: Joi.string(),
  cursorDirection: Joi.string().uppercase().allow('BEFORE', 'AFTER').default('AFTER'),
  sortField: Joi.string(),
  sortOrder: Joi.number().valid(1, -1),
};
