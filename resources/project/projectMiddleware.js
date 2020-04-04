// TODO - need protective middleware - especially for deletion
const { shield, and } = require("graphql-shield");
const {
  projectSubscriptionKeys,
  projectQueryKeys,
  projectMutationKeys,
} = require("./projectUtils");
const {
  isAuthenticated,
  hasWorkspacePrivileges,
  hasViewerPrivileges,
  hasAdminPrivileges,
  hasEditorPrivileges,
} = require("../permissions");

// TODO - Need to create custom privileges for interacting with project

const ProjectPermissions = shield({
  Query: {
    [projectQueryKeys.projects]: and(
      isAuthenticated,
      hasWorkspacePrivileges,
      hasViewerPrivileges
    ),
    [projectQueryKeys.project]: and(
      isAuthenticated,
      hasWorkspacePrivileges,
      hasViewerPrivileges
    ),
  },
  Mutation: {
    [projectMutationKeys.createProject]: and(
      isAuthenticated,
      hasWorkspacePrivileges,
      hasEditorPrivileges
    ),
    [projectMutationKeys.updateProject]: and(
      isAuthenticated,
      hasWorkspacePrivileges,
      hasEditorPrivileges
    ),
    [projectMutationKeys.deleteProject]: and(
      isAuthenticated,
      hasWorkspacePrivileges,
      hasAdminPrivileges
    ),
  },
  Subscription: {
    [projectSubscriptionKeys.projects]: and(
      isAuthenticated,
      hasWorkspacePrivileges,
      hasViewerPrivileges
    ),
  },
});

const ProjectMiddleware = shield({
  Query: {},
  Mutation: {},
  Subscription: {},
});

module.exports = {
  ProjectPermissions,
  ProjectMiddleware,
};
