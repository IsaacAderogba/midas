const { objectType, inputObjectType, enumType } = require("nexus");
const { Workspace } = require("../workspace/workspaceTypes");
const { WorkspaceUser } = require("../workspace_user/workspaceUserTypes");
const { MutationType } = require("../types");

const ProjectInviteShareStatus = enumType({
  name: "ProjectInviteShareStatus",
  members: ["people_invited"],
});

const ProjectInviteSharePrivileges = enumType({
  name: "ProjectInviteSharePrivileges",
  members: ["can_view"],
});

const Project = objectType({
  name: "Project",
  definition(t) {
    t.id("id", { nullable: false });
    t.string("uuid", { nullable: false });
    t.id("workspaceId", { nullable: false });
    t.id("workspaceUserId", { nullable: false });
    t.string("title", { nullable: false });
    t.string("thumbnailPhotoURL", { nullable: true });
    t.string("thumbnailPhotoID", { nullable: true });
    t.field("inviteShareStatus", {
      type: ProjectInviteShareStatus,
      nullable: false,
    });
    t.field("inviteSharePrivileges", {
      type: ProjectInviteSharePrivileges,
      nullable: false,
    });
    t.string("elements", { nullable: true });
    t.string("state", { nullable: true });
    t.string("createdAt", { nullable: false });
    t.string("updatedAt", { nullable: false });
    t.field("workspace", {
      type: Workspace,
      resolve: async (project, args, { dataSources }) => {
        return dataSources.workspaceAPI.readWorkspace({
          id: project.workspaceId,
        });
      },
    });
    t.field("workspaceUser", {
      type: WorkspaceUser,
      resolve: async (project, args, { dataSources }) => {
        return dataSources.workspaceUserAPI.readWorkspaceUser({
          id: project.workspaceUserId,
        });
      },
    });
  },
});

const ProjectSubscriptionPayload = objectType({
  name: "ProjectSubscriptionPayload",
  definition(t) {
    t.field("mutation", { type: MutationType, nullable: false });
    t.field("data", { type: Project, nullable: false });
    t.list.string("updatedFields", { nullable: false });
  },
});

const NewProjectInput = inputObjectType({
  name: "NewProjectInput",
  definition(t) {
    // workspaceId and workspaceUserId will be passed in through the context
    t.string("workspaceUserId", { required: true });
    t.string("title", { required: true });
    t.string("thumbnailPhotoURL", { required: false });
    t.string("thumbnailPhotoID", { required: false });
    t.field("inviteShareStatus", {
      type: ProjectInviteShareStatus,
      required: false,
    });
    t.field("inviteSharePrivileges", {
      type: ProjectInviteSharePrivileges,
      required: false,
    });
  },
});

const ProjectInput = inputObjectType({
  name: "ProjectInput",
  definition(t) {
    // middleware to check if it's completely empty
    t.string("workspaceUserId", { required: false });
    t.string("title", { required: false });
    t.string("thumbnailPhotoURL", { required: false });
    t.string("thumbnailPhotoID", { required: false });
    t.field("inviteShareStatus", {
      type: ProjectInviteShareStatus,
      required: false,
    });
    t.field("inviteSharePrivileges", {
      type: ProjectInviteSharePrivileges,
      required: false,
    });
    t.string("elements", { required: false });
    t.string("state", { required: false });
  },
});

const ProjectWhere = inputObjectType({
  name: "ProjectWhere",
  definition(t) {
    t.id("id", { required: false });
    t.string("uuid", { required: false });
    t.id("workspaceUserId", { required: false });
    t.id("workspaceId", { required: false });
  },
});

module.exports = {
  Project,
  ProjectInput,
  NewProjectInput,
  ProjectWhere,
  ProjectSubscriptionPayload,
};
