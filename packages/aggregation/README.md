# MongoDB Aggregation Utilities

## Installation
```
yarn add @parameter1/mongodb-aggregation
```

## Usage
```js
import { AggregationOperators, Pipeline } from '@parameter1/mongodb-aggregation';
import { MongoClient } from '@parameter1/mongodb-core';

const { $toLower } = AggregationOperators;

const pipeline = new Pipeline()
  .$match({ foo: 'bar' }),
  .$set({
    foo: $toLower('$foo'),
  });

const client = new MongoClient('mongodb://some-server:27071');
const collection = client.db('test').collection('foo');

await collection.aggregation(pipeline.toArray());
```
