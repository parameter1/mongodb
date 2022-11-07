# MongoDB Dataloader
Dataloaders for MongoDB collections - primarily for use in GraphQL servers (but other applications can apply). Supports document projection and foreign field control.

## Installation
```
yarn add @parameter1/mongodb-dataloader
```

## Usage
```js
import { MongoDBDataLoader } from '@parameter1/mongodb-dataloader';
import { MongoClient } from '@parameter1/mongodb-core';

const client = new MongoClient('mongodb://some-server:27071');
const collection = client.db('test').collection('foo');

const loader = new MongoDBDataLoader({ name: 'foo', collection });

// load one by `_id`
await loader.load({ value: new ObjectId() });

// load many by `_id`
await loader.loadMany({ values: [new Object(), new ObjectId()] });
```
