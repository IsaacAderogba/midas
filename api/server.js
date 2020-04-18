require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const cloudinary = require("cloudinary");
const { makeSchema, asNexusMethod } = require("nexus");
const express = require("express");
const { GraphQLUpload, ApolloServer } = require("apollo-server-express");
const { applyMiddleware } = require("graphql-middleware");
const path = require("path");
const app = express();
const httpServer = require("http").createServer(app);
const {
  redisCache,
  redisClient,
  redisPubSub,
} = require("./services/redis/redis");


const UserAPI = require("./resources/user/userDataSource");
const WorkspaceAPI = require("./resources/workspace/workspaceDataSource");
const WorkspaceUserAPI = require("./resources/workspace_user/workspaceUserDataSource");
const ProjectAPI = require("./resources/project/projectDataSource");

const { Query, Mutation, Middleware, Subscription } = require("./resources");

const Upload = asNexusMethod(GraphQLUpload, 'upload')

const schema = makeSchema({
  types: [Upload, Query, Mutation, Subscription],
  outputs: {
    schema: __dirname + "/generated/schema.graphql",
    typegen: __dirname + "/generated/typings.ts",
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(helmet());
app.use(cors());
app.use(express.json());

const schemaWithMiddleware = applyMiddleware(schema, ...Middleware);
const apolloServer = new ApolloServer({
  schema: schemaWithMiddleware,
  context: async ({ req, payload, connection }) => {
    if (connection) {
      return {
        ...connection.context,
        redisClient,
        pubsub: redisPubSub,
        user:
          payload && payload.authorization
            ? await UserAPI.authenticateUser(payload.authorization)
            : connection.context.user,
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
      redisClient,
      pubsub: redisPubSub,
      user: await UserAPI.authenticateUser(req.headers.authorization),
    };
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      console.log("Subscription client connected");
      const user = await UserAPI.authenticateUser(
        connectionParams.authorization
      );

      return { user };
    },
    onDisconnect: async (webSocket, context) => {
      console.log("Subscription client disconnected.");
    },
    path: "/subscriptions",
  },
  cache: redisCache,
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
