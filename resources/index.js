const { UserPermissions, UserMiddleware } = require("./user/userMiddlewares");
const { UserQuery, UserMutation } = require("./user/userResolvers");
const {
  WorkspacePermissions,
  WorkspaceMiddleware,
} = require("./workspace/workspaceMiddleware");
const {
  WorkspaceQuery,
  WorkspaceMutation,
} = require("./workspace/workspaceResolvers");
const {
  WorkspaceUserPermissions,
  WorkspaceUserMiddleware,
} = require("./workspace_user/workspaceUserMiddleware");
const {
  WorkspaceUserQuery,
  WorkspaceUserMutation,
} = require("./workspace_user/workspaceUserResolvers");
const {
  ProjectMiddleware,
  ProjectPermissions,
} = require("./project/projectMiddleware");
const {
  ProjectQuery,
  ProjectMutation,
  ProjectSubscription,
} = require("./project/projectResolvers");

module.exports = {
  Query: [UserQuery, WorkspaceQuery, WorkspaceUserQuery, ProjectQuery],
  Mutation: [
    UserMutation,
    WorkspaceMutation,
    WorkspaceUserMutation,
    ProjectMutation,
  ],
  Subscription: [ProjectSubscription],
  Middleware: [
    UserPermissions,
    UserMiddleware,
    WorkspacePermissions,
    WorkspaceMiddleware,
    WorkspaceUserPermissions,
    WorkspaceUserMiddleware,
    ProjectPermissions,
    ProjectMiddleware,
  ],
};
