import Joi from 'joi';
import { ClientSession, Collection, MongoClient } from '@parameter1/mongodb-core';

export const mongoClientProp = Joi.object().instance(MongoClient);
export const mongoCollectionProp = Joi.object().instance(Collection);
export const mongoSessionProp = Joi.object().instance(ClientSession);
