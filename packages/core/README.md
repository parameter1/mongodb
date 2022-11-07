# MongoDB Core
A MongoDB wrapper containing core utilities.

## Installation
```
yarn add @parameter1/mongodb-core
```

## Usage
```js
import { MongoClient } from '@parameter1/mongodb-core';

const client = new MongoClient('mongodb://some-server:27071');

client.connect().then(() => console.log('connected'));
```
