const { shield, and } = require("graphql-shield");
const {
  workspaceQueryKeys,
  workspaceMutationKeys
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
      [workspaceMutationKeys.createWorkspace]: and(isAuthenticated),
      [workspaceMutationKeys.updateWorkspace]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasAdminPrivileges
      ),
      [workspaceMutationKeys.deleteWorkspace]: and(
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
