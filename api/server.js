// TODO - review helmet and cors
require("dotenv").config();
require("../services/redis");
const cors = require("cors");
const helmet = require("helmet");
const { makeSchema } = require("nexus");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const server = express();

// schema setup
const schema = makeSchema({
  types: [],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/typings.ts"
  }
});

// server middlewares
server.use(helmet());
server.use(cors());
server.use(express.json());

const apolloServer = new ApolloServer({ schema });
apolloServer.applyMiddleware({ app: server });

module.exports = server;
