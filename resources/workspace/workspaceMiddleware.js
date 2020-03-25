const { shield } = require("graphql-shield");

// validWorkspacePermissions isAuthenticated,
const WorkspacePermissions = shield(
  {
    Query: {},
    Mutation: {}
  },
  {
    debug: process.env.DB_ENV === "development" ? true : false
  }
);

// validWorkspaceAccess
const WorkspaceMiddleware = {
  Query: {},
  Mutation: {}
};

module.exports = {
  WorkspacePermissions,
  WorkspaceMiddleware
};
