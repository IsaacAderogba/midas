const { shield } = require("graphql-shield");

// validWorkspaceUserPermissions isAuthenticated,
const WorkspaceUserPermissions = shield(
  {
    Query: {},
    Mutation: {}
  },
  {
    debug: process.env.DB_ENV === "development" ? true : false
  }
);

// validWorkspaceUserAccess
const WorkspaceUserMiddleware = {
  Query: {},
  Mutation: {}
};

module.exports = {
  WorkspaceUserPermissions,
  WorkspaceUserMiddleware
};
