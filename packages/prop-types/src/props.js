import Joi from 'joi';
import { ClientSession, Collection, MongoClient } from '@parameter1/mongodb-core';

const { object } = Joi;

export const mongoClientProp = object().instance(MongoClient);
export const mongoCollectionProp = object().instance(Collection);
export const mongoSessionProp = object().instance(ClientSession);
