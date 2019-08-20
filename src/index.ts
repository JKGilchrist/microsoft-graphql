require("dotenv").config();
import { ApolloServer } from 'apollo-server';
import schema from "./schema";
import getToken from "./auth";

const env = process.env;

async function start() {
  const server = new ApolloServer({
    schema,
    context: async (req) => ({
      ...req,
      access_token: (await getToken(env.DIRECTORY_ID, env.APP_ID, env.APP_SECRET))['access_token'],
      token_expire_time: null,
    })
  });

  server.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000`),
  );
}


start(); 