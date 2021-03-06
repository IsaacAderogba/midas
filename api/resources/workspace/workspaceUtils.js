const { UserInputError } = require("apollo-server-express")

const workspaceQueryKeys = {
  workspace: 'workspace',
  workspaces: "workspaces"
}

const workspaceMutationKeys = {
  createWorkspace: "createWorkspace",
  updateWorkspace: "updateWorkspace",
  deleteWorkspace: 'deleteWorkspace'
}

const workspaceErrors = {
  WorkspaceURLAlreadyExists: new UserInputError("Workspace URL already exists"),
  WorkspaceNotFound: new UserInputError("Workspace not found")
}

module.exports = {
  workspaceQueryKeys,
  workspaceMutationKeys,
  workspaceErrors
}