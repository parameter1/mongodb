# MongoDB Prop Types
Common prop type validators using Joi.

## Installation
```
yarn add @parameter1/mongodb-prop-types
```

## Usage
Prop type schemas.

```js
import { mongoClientProp, mongoCollectionProp, mongoSessionProp } from '@parameter1/mongodb-prop-types';

import { MongoClient } from '@parameter1/mongodb-core';
import Joi from 'joi';

const { attempt } = Joi

const client = new MongoClient('mongodb://some-server:27071');

// valid
attempt(client, mongoClientProp.required());
attempt(client.db('test').collection('foo'), mongoCollectionProp.required());
attempt(client.startSession(), mongoSessionProp.required());

```

Extending Joi to add `objectId` type.
```js
import Joi from 'joi';
import { objectIdType } from '@parameter1/mongodb-prop-types';

Joi.extend(objectIdType);

const someObjectId = new ObjectId();

// valid
attempt(someObjectId, Joi.objectId().required());

```
