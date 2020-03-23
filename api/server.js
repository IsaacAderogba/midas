// TODO - review helmet and cors
// TODO - allow signup with google etc. (see Tandem)
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const { makeSchema } = require("nexus");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { applyMiddleware } = require("graphql-middleware");
const { RedisCache } = require("apollo-server-cache-redis");
const path = require("path");
const server = express();

const UserAPI = require("../resources/user/userDataSource");
const { Query, Mutation, Middleware } = require("../resources");

// schema setup
const schema = makeSchema({
  types: [Query, Mutation],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/typings.ts"
  }
});

// server middlewares
server.use(helmet());
server.use(cors());
server.use(express.json());

const schemaWithMiddleware = applyMiddleware(schema, ...Middleware);
const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware,
  context: async ({ req, res }) => ({ req, res }),
  cache: new RedisCache(process.env.REDIS_URL),
  dataSources: () => ({
    userAPI: UserAPI
  })
});
apolloServer.applyMiddleware({ app: server });

server.use(express.static("public"));
server.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

module.exports = server;
