const { shield, and } = require("graphql-shield");
const {
  workspaceUserQueryKeys,
  workspaceUserResolverKeys
} = require("./workspaceUserUtils");
const {
  isAuthenticated,
  hasWorkspacePrivileges,
  hasViewerPrivileges,
  hasAdminPrivileges
} = require("../permissions");

// validWorkspaceUserPermissions isAuthenticated,
const WorkspaceUserPermissions = shield(
  {
    Query: {
      [workspaceUserQueryKeys.workspaceUser]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasViewerPrivileges
      ),
      [workspaceUserQueryKeys.workspaceUsers]: and(
        isAuthenticated,
        hasViewerPrivileges
      )
    },
    Mutation: {
      [workspaceUserResolverKeys.createWorkspaceUser]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasAdminPrivileges
      ),
      [workspaceUserResolverKeys.updateWorkspaceUser]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasAdminPrivileges
      ),
      [workspaceUserResolverKeys.deleteWorkspaceUser]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasAdminPrivileges
      )
    }
  },
  {
    debug: process.env.DB_ENV === "development" ? true : false
  }
);

const WorkspaceUserMiddleware = {
  Query: {},
  Mutation: {}
};

module.exports = {
  WorkspaceUserPermissions,
  WorkspaceUserMiddleware
};
