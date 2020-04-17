// TODO - need protective middleware - especially for deletion
const { shield, and } = require("graphql-shield");
const {
  projectSubscriptionKeys,
  projectQueryKeys,
  projectMutationKeys,
  projectErrors,
} = require("./projectUtils");
const {
  isAuthenticated,
  hasWorkspacePrivileges,
  hasViewerPrivileges,
  hasAdminPrivileges,
  hasEditorPrivileges,
} = require("../permissions");

// TODO - Need to create custom privileges for interacting with project
async function validProjectMiddleware(resolve, parent, args, context, info) {
  const { dataSources } = context;
  const project = await dataSources.projectAPI.readProject(args.where);
  if (!project) throw projectErrors.ProjectNotFound;

  return resolve(parent, args, context, info);
}

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
    [projectSubscriptionKeys.project]: and(
      isAuthenticated,
      hasWorkspacePrivileges,
      hasViewerPrivileges
    ),
  },
});

const ProjectMiddleware = shield({
  Query: {
    [projectQueryKeys.project]: validProjectMiddleware,
  },
  Mutation: {
    [projectMutationKeys.updateProject]: validProjectMiddleware,
    [projectMutationKeys.deleteProject]: validProjectMiddleware,
  },
  Subscription: {
    [projectSubscriptionKeys.project]: validProjectMiddleware,
  },
});

module.exports = {
  ProjectPermissions,
  ProjectMiddleware,
};
