const { objectType, inputObjectType, enumType } = require("nexus");
const { User } = require("../user/userTypes");
const { Workspace } = require("../workspace/workspaceTypes");
const { ROLES } = require("../permissions");

const WorkspaceUserRoles = enumType({
  name: "WorkspaceUserRoles",
  members: [...Object.keys(ROLES)],
});

const WorkspaceUserStatus = enumType({
  name: "WorkspaceUserStatus",
  members: ["active"],
});

const InvitedWorkspaceUser = objectType({
  name: "InvitedWorkspaceUser",
  definition(t) {
    t.string("workspaceUserId", { nullable: false });
    t.string("workspaceId", { nullable: false });
    t.string("email", { nullable: false });
    t.field("role", { type: WorkspaceUserRoles, nullable: false });
  },
});

const InvitedWorkspaceUserInput = inputObjectType({
  name: "InvitedWorkspaceUserInput",
  definition(t) {
    t.string("workspaceUserId", { required: true });
    t.string("workspaceId", { required: true });
    t.string("email", { required: true });
    t.field("role", { type: WorkspaceUserRoles, required: true });
  },
});

const WorkspaceUser = objectType({
  name: "WorkspaceUser",
  definition(t) {
    t.id("id", { nullable: false });
    t.id("workspaceId", { nullable: false });
    t.id("userId", { nullable: false });
    t.field("role", { type: WorkspaceUserRoles, nullable: false });
    t.string("lastSeen", { nullable: true });
    t.field("status", { type: WorkspaceUserStatus, nullable: false });
    t.field("user", {
      type: User,
      resolve: async (workspaceUser, args, { dataSources }) => {
        return dataSources.userAPI.readUser({ id: workspaceUser.userId });
      },
    });
    t.field("workspace", {
      type: Workspace,
      resolve: async (workspaceUser, args, { dataSources }) => {
        return dataSources.workspaceAPI.readWorkspace({
          id: workspaceUser.workspaceId,
        });
      },
    });
  },
});

// write middleware to check that where isn't empty
const WorkspaceUserWhere = inputObjectType({
  name: "WorkspaceUserWhere",
  definition(t) {
    t.id("userId", { required: false });
  },
});

const WorkspaceUserInput = inputObjectType({
  name: "WorkspaceUserInput",
  definition(t) {
    t.field("role", { type: WorkspaceUserRoles });
    t.field("status", { type: WorkspaceUserStatus });
  },
});

const NewWorkspaceUserInput = inputObjectType({
  name: "NewWorkspaceUserInput",
  definition(t) {
    t.int("workspaceId", { required: true });
    t.int("userId", { required: true });
    t.field("role", { type: WorkspaceUserRoles, required: true });
  },
});

module.exports = {
  WorkspaceUserRoles,
  WorkspaceUserStatus,
  WorkspaceUser,
  WorkspaceUserInput,
  NewWorkspaceUserInput,
  WorkspaceUserWhere,
  InvitedWorkspaceUser,
  InvitedWorkspaceUserInput,
};
