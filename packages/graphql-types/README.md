# MongoDB GraphQL Types
MongoDB GraphQL scalar types.

## Installation
```
yarn add @parameter1/mongodb-graphql-types
```

## Usage
Definitions with `.graphql` file
```graphql
scalar ObjectID

type SomeType {
  _id: ObjectID!
}
```

Definitions with `graphql-tag`
```js
import gql from 'graphql-tag';

export default gql`

scalar ObjectID

type SomeType {
  _id: ObjectID!
}

`;

```

Resolvers
```js
import { GraphQLObjectId } from '@parameter1/mongodb-grapql-types';

export default {
  ObjectID: GraphQLObjectId,
}
```
