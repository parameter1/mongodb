# MongoDB Core
A MongoDB wrapper containing core utilities.

## Installation
```
yarn add @parameter1/mongodb-core
```

## Usage
Core
```js
import { MongoClient } from '@parameter1/mongodb-core';

const client = new MongoClient('mongodb://some-server:27071');

client.connect().then(() => console.log('connected'));
```

Utilities
```js
import { filterMongoURL, iterateMongoCursor, MongoClient } from '@parameter1/mongodb-core';

// strips user names and passwords from mongo URLs
const client = new MongoClient('mongodb://user:password@some-server:27071');
// logs `mongodb://*****:*****@some-server:27071`
console.log(filterMongoURL(client));


// iterates over a mongo cursor
const cursor = await client.db('test').collection('foo').findMany({});

await iterateMongoCursor(cursor, async (doc) => {
  // do things here... can await
  await someThing(doc);
});

```
