import { makeSchema } from 'nexus';
import * as path from 'path';

import Query from "./resolvers/Query";

import {
  User
} from "./types/Schema";

const schema = makeSchema({
  types: [
    Query,
    User,
  ],

  // Specify where Nexus should put the generated files
  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },

  // Configure nullability of input arguments: All arguments are non-nullable by default
  nonNullDefaults: {
    input: true,
    output: true,
  },

});


export default schema;