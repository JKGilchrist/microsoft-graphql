require("dotenv").config();

import { ApolloServer, gql } from 'apollo-server';
import schema from "./schema";

const server = new ApolloServer({
  schema,
  context: async (req) => ({
    ...req,
    access_token: process.env.ACCESS_TOKEN,
    token_expire_time: null
  })
});

server.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000`),
)