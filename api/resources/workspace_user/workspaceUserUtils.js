const { UserInputError } = require("apollo-server-express");

const workspaceUserQueryKeys = {
  workspaceUser: "workspaceUser",
  workspaceUsers: "workspaceUsers",
};

const workspaceUserMutationKeys = {
  createWorkspaceUser: "createWorkspaceUser",
  updateWorkspaceUser: "updateWorkspaceUser",
  deleteWorkspaceUser: "deleteWorkspaceUser",
  createInvitedWorkspaceUser: "createInvitedWorkspaceUser",
  acceptWorkspaceUserInvite: "acceptWorkspaceUserInvite",
};

const workspaceUserErrors = {
  WorkspaceUserNotFound: new UserInputError("Workspace user not found"),
  InvitedUserNotFound: new UserInputError("Invited user not found"),
  RegisterAndLoginInputEmpty: new UserInputError(
    "Input for register or login fields must exist"
  ),
};

module.exports = {
  workspaceUserQueryKeys,
  workspaceUserMutationKeys,
  workspaceUserErrors,
};
