import { makeSchema } from 'nexus';
import * as path from 'path';

//import { mergeSchemas } from "graphql-tools";

import Query from "./resolvers/Query";

import {
  User
} from "./types/Schema";

import BlankQuery from "./resolvers/BlankQuery";

const schema = makeSchema({
  // Provide all the GraphQL types we've implemented
  types: [
    BlankQuery, // If you don't put this it auto gives you all the prisma queries
    Query,
    User,
  ],

  // Specify where Nexus should put the generated files
  outputs: {
    schema: path.join(__dirname, './generated/mapping/schema.graphql'),
    typegen: path.join(__dirname, './generated/mapping/nexus.ts'),
  },

  // Configure nullability of input arguments: All arguments are non-nullable by default
  nonNullDefaults: {
    input: true,
    output: true,
  },

});


export default schema;