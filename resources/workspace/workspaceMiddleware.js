const { shield, and } = require("graphql-shield");
const {
  workspaceQueryKeys,
  workspaceResolverKeys
} = require("./workspaceUtils");
const {
  isAuthenticated,
  hasWorkspacePrivileges,
  hasViewerPrivileges,
  hasOwnerPrivileges,
  hasAdminPrivileges
} = require("../permissions");

const WorkspacePermissions = shield(
  {
    Query: {
      [workspaceQueryKeys.workspace]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasViewerPrivileges
      ),
      [workspaceQueryKeys.workspaces]: and(isAuthenticated, hasViewerPrivileges)
    },
    Mutation: {
      [workspaceResolverKeys.createWorkspace]: and(isAuthenticated),
      [workspaceResolverKeys.updateWorkspace]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasAdminPrivileges
      ),
      [workspaceResolverKeys.deleteWorkspace]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasOwnerPrivileges
      )
    }
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
