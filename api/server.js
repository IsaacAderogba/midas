// TODO - review helmet and cors
// TODO - allow signup with google etc. (see Tandem)
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const { makeSchema } = require("nexus");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { RedisPubSub } = require("graphql-redis-subscriptions");
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

const PubSub = new RedisPubSub(process.env.REDIS_URL);
const schemaWithMiddleware = applyMiddleware(schema, ...Middleware);
const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        ...connection.context,
        pubsub: PubSub,
        user: connection.context.user,
        dataSources: {
          userAPI: UserAPI,
          workspaceAPI: WorkspaceAPI,
          workspaceUserAPI: WorkspaceUserAPI,
          projectAPI: ProjectAPI,
        },
      };
    }

    return {
      req,
      pubsub: PubSub,
      user: await UserAPI.authenticateUser(req.headers.authorization),
    };
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      console.log("Subscription client connected");
      const user = await UserAPI.authenticateUser(
        connectionParams.authorization
      );
      if (!user) throw new Error("User unauthenticated");
      return { user };
    },
    onDisconnect: async (webSocket, context) => {
      console.log("Subscription client disconnected.");
    },
    path: "/subscriptions",
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
