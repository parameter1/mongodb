# MongoDB GraphQL Types
MongoDB GraphQL scalar types, such as `ObjectId`

## Installation
```
yarn add @parameter1/mongodb-graphql-types
```

## Usage
Definitions with `.graphql` file
```graphql
scalar EJSONObject
scalar ObjectID

type SomeType {
  _id: ObjectID!
  ejson: EJSONObject
}
```

Definitions with `graphql-tag`
```js
import gql from 'graphql-tag';

export default gql`

scalar EJSONObject
scalar ObjectID

type SomeType {
  _id: ObjectID!
  ejson: EJSONObject
}

`;

```

Resolvers
```js
import { GraphQLEJSONObject, GraphQLObjectId } from '@parameter1/mongodb-grapql-types';

export default {
  EJSONObject: GraphQLEJSONObject,
  ObjectID: GraphQLObjectId,
}
```
