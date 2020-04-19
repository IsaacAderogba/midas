const { shield, and } = require("graphql-shield");
const {
  workspaceQueryKeys,
  workspaceMutationKeys,
  workspaceErrors,
} = require("./workspaceUtils");
const {
  isAuthenticated,
  hasWorkspacePrivileges,
  hasViewerPrivileges,
  hasOwnerPrivileges,
  hasAdminPrivileges,
} = require("../permissions");

async function workspaceAlreadyExistsMiddleware(
  resolve,
  parent,
  args,
  context,
  info
) {
  const { dataSources } = context;
  const workspaceExists = await dataSources.workspaceAPI.readWorkspace({
    url: args.newWorkspaceInput.url,
  });
  if (workspaceExists) throw workspaceErrors.WorkspaceURLAlreadyExists;

  return resolve(parent, args, context, info);
}

async function validWorkspaceMiddleware(resolve, parent, args, context, info) {
  const { dataSources, user } = context;
  const validWorkspace = await dataSources.workspaceAPI.readWorkspace({
    id: user.workspaceId,
  });
  if (!validWorkspace) throw workspaceErrors.WorkspaceNotFound;

  return resolve(parent, args, context, info);
}

const WorkspacePermissions = shield(
  {
    Query: {
      [workspaceQueryKeys.workspace]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasViewerPrivileges
      ),
      [workspaceQueryKeys.workspaces]: and(
        isAuthenticated,
        hasViewerPrivileges
      ),
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
      ),
    },
  },
  {
    debug: process.env.DB_ENV === "development" ? true : true,
  }
);

// workspace, update workspace, delete workspace
const WorkspaceMiddleware = {
  Query: {
    [workspaceQueryKeys.workspace]: validWorkspaceMiddleware,
  },
  Mutation: {
    [workspaceMutationKeys.createWorkspace]: workspaceAlreadyExistsMiddleware,
    [workspaceMutationKeys.updateWorkspace]: validWorkspaceMiddleware,
    [workspaceMutationKeys.deleteWorkspace]: validWorkspaceMiddleware,
  },
};

module.exports = {
  WorkspacePermissions,
  WorkspaceMiddleware,
};
