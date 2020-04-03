// TODO - review helmet and cors
// TODO - allow signup with google etc. (see Tandem)
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const { makeSchema } = require("nexus");
const express = require("express");
const { ApolloServer, PubSub } = require("apollo-server-express");
const { applyMiddleware } = require("graphql-middleware");
const { RedisCache } = require("apollo-server-cache-redis");
const path = require("path");
const app = express();
const httpServer = require("http").createServer(app);

const UserAPI = require("../resources/user/userDataSource");
const WorkspaceAPI = require("../resources/workspace/workspaceDataSource");
const WorkspaceUserAPI = require("../resources/workspace_user/workspaceUserDataSource");
const ProjectAPI = require("../resources/project/projectDataSource");

const { Query, Mutation, Middleware, Subscription } = require("../resources");

// schema setup
const schema = makeSchema({
  types: [Query, Mutation, Subscription],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/typings.ts",
  },
});

// app middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

const schemaWithMiddleware = applyMiddleware(schema, ...Middleware);
const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware,
  context: async ({ req, connection }) => {
    // console.log(connection.context.authorization);
    const authorization = connection
      ? connection.context.authorization
      : req.headers.authorization;

    let context = {
      req,
      pubsub: new PubSub(),
      user: await UserAPI.authenticateUser(authorization),
    };

    if (connection) {
      context = {
        context,
        ...connection.context,
      };
    }

    return context;
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      console.log("Subscription client connected");
      return {
        authorization: connectionParams.authorization,
      };
    },
    onDisconnect: async (webSocket, context) => {
      console.log("Subscription client disconnected.");
    },
  },
  cache: new RedisCache(process.env.REDIS_URL),
  dataSources: () => ({
    userAPI: UserAPI,
    workspaceAPI: WorkspaceAPI,
    workspaceUserAPI: WorkspaceUserAPI,
    projectAPI: ProjectAPI,
  }),
  engine: {
    debugPrintReports: true,
    apiKey: process.env.ENGINE_METRICS_KEY,
  },
});
apolloServer.applyMiddleware({ app });
apolloServer.installSubscriptionHandlers(httpServer);

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

module.exports = httpServer;
