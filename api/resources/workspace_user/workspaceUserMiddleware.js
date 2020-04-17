const { shield, and } = require("graphql-shield");
const {
  workspaceUserQueryKeys,
  workspaceUserMutationKeys,
  workspaceUserErrors,
} = require("./workspaceUserUtils");
const {
  isAuthenticated,
  hasWorkspacePrivileges,
  hasViewerPrivileges,
  hasAdminPrivileges,
} = require("../permissions");

async function validAcceptWorkspaceUserInviteMiddleware(
  resolve,
  parent,
  args,
  context,
  info
) {
  const { dataSources } = context;
  const { invitedWorkspaceUserInput, registerInput, loginInput } = args;
  if (!registerInput && !loginInput)
    throw workspaceUserErrors.RegisterAndLoginInputEmpty;

  const validInvitee = await dataSources.workspaceUserAPI.readInvitedWorkspaceUser(
    invitedWorkspaceUserInput
  );

  if (!validInvitee) throw workspaceUserErrors.InvitedUserNotFound;

  return resolve(parent, args, context, info);
}

async function validWorkspaceUserMiddleware(
  resolve,
  parent,
  args,
  context,
  info
) {
  const { user, dataSources } = context;
  const workspaceUser = await dataSources.workspaceUserAPI.readWorkspaceUser({
    ...args.where,
    workspaceId: user.workspaceId,
  });

  if (!workspaceUser) throw workspaceUserErrors.WorkspaceUserNotFound;

  return resolve(parent, args, context, info);
}

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
      ),
    },
    Mutation: {
      [workspaceUserMutationKeys.createWorkspaceUser]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasAdminPrivileges
      ),
      [workspaceUserMutationKeys.updateWorkspaceUser]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasAdminPrivileges
      ),
      [workspaceUserMutationKeys.deleteWorkspaceUser]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasAdminPrivileges
      ),
      [workspaceUserMutationKeys.createInvitedWorkspaceUser]: and(
        isAuthenticated,
        hasWorkspacePrivileges,
        hasAdminPrivileges
      ),
    },
  },
  {
    debug: process.env.DB_ENV === "development" ? true : false,
  }
);

const WorkspaceUserMiddleware = {
  Query: {
    [workspaceUserQueryKeys.workspaceUser]: validWorkspaceUserMiddleware,
  },
  Mutation: {
    [workspaceUserMutationKeys.updateWorkspaceUser]: validWorkspaceUserMiddleware,
    [workspaceUserMutationKeys.deleteWorkspaceUser]: validWorkspaceUserMiddleware,
    [workspaceUserMutationKeys.acceptWorkspaceUserInvite]: validAcceptWorkspaceUserInviteMiddleware,
  },
};

module.exports = {
  WorkspaceUserPermissions,
  WorkspaceUserMiddleware,
};
