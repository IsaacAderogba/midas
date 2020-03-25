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

module.exports = {
  Query: [UserQuery, WorkspaceQuery],
  Mutation: [UserMutation, WorkspaceMutation],
  Middleware: [
    UserPermissions,
    UserMiddleware,
    WorkspacePermissions,
    WorkspaceMiddleware
  ]
};
