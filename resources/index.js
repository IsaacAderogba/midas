const { UserPermissions, UserMiddleware } = require("./user/userMiddlewares");
const { UserQuery, UserMutation } = require("./user/userResolvers");
const {
  WorkspacePermissions,
  WorkspaceMiddleware
} = require("./workspace/workspaceMiddleware");
const {
  WorkspaceQuery,
  WorkspaceMutation
} = require("./workspace/workspaceResolvers");
const {
  WorkspaceUserPermissions,
  WorkspaceUserMiddleware
} = require("./workspace_user/workspaceUserMiddleware");
const {
  WorkspaceUserQuery,
  WorkspaceUserMutation
} = require("./workspace_user/workspaceUserResolvers");

module.exports = {
  Query: [UserQuery, WorkspaceQuery, WorkspaceUserQuery],
  Mutation: [UserMutation, WorkspaceMutation, WorkspaceUserMutation],
  Middleware: [
    UserPermissions,
    UserMiddleware,
    WorkspacePermissions,
    WorkspaceMiddleware,
    WorkspaceUserPermissions,
    WorkspaceUserMiddleware
  ]
};
