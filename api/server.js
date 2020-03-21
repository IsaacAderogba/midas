require("dotenv").config();
require("../services/redis");
const { makeSchema } = require("nexus");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const app = express();
const schema = makeSchema({
  types: [],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/typings.ts"
  }
});

app.use(express.json());
const server = new ApolloServer({ schema });
server.applyMiddleware({ app });

module.exports = app;
