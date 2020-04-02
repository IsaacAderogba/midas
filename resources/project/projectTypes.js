const { objectType, inputObjectType, enumType } = require("nexus");
const { Workspace } = require("../workspace/workspaceTypes");
const { WorkspaceUser } = require("../workspace_user/workspaceUserTypes");

const ProjectInviteShareStatus = enumType({
  name: "ProjectInviteShareStatus",
  members: ["people-invited"]
});

const ProjectInviteSharePrivileges = enumType({
  name: "ProjectInviteSharePrivileges",
  members: ["can-view"]
});

const Project = objectType({
  name: "Project",
  definition(t) {
    t.id("id", { nullable: false });
    t.id("workspaceId", { nullable: false });
    t.id("workspaceUserId", { nullable: false });
    t.string("title", { nullable: false });
    t.string("thumbnailPhotoURL", { nullable: true });
    t.string("thumbnailPhotoID", { nullable: true });
    t.field("inviteShareStatus", {
      type: ProjectInviteShareStatus,
      nullable: false
    });
    t.field("inviteSharePrivileges", {
      type: ProjectInviteSharePrivileges,
      nullable: false
    });
    t.string("createdAt", { nullable: false });
    t.string("updatedAt", { nullable: false });
    t.field("workspace", {
      type: Workspace,
      resolve: async (project, args, { dataSources }) => {
        return dataSources.workspaceAPI.readWorkspace({
          id: project.workspaceId
        });
      }
    });
    t.field("workspaceUser", {
      type: WorkspaceUser,
      resolve: async (project, args, { dataSources }) => {
        return dataSources.workspaceUserAPI.readWorkspaceUser({
          workspaceId: project.workspaceId,
          userId: project.workspaceUserId
        });
      }
    });
  }
});

const NewProjectInput = inputObjectType({
  name: "NewProjectInput",
  definition(t) {
    // workspaceId and workspaceUserId will be passed in through the context
    t.string("workspaceId", { required: true })
    t.string("workspaceUserId", { required: true })
    t.string("title", { required: true })
    t.string("thumbnailPhotoURL", { required: false })
    t.string("thumbnailPhotoID", { required: false })
    t.field("inviteShareStatus", {
      type: ProjectInviteShareStatus,
      required: false
    });
    t.field("inviteSharePrivileges", {
      type: ProjectInviteSharePrivileges,
      required: false
    });
  }
});

const ProjectInput = inputObjectType({
  name: "ProjectInput",
  definition(t) {
    // middleware to check if it's completely empty
    t.string("workspaceId", { required: false })
    t.string("workspaceUserId", { required: false })
    t.string("title", { required: false })
    t.string("thumbnailPhotoURL", { required: false })
    t.string("thumbnailPhotoID", { required: false })
    t.field("inviteShareStatus", {
      type: ProjectInviteShareStatus,
      required: false
    });
    t.field("inviteSharePrivileges", {
      type: ProjectInviteSharePrivileges,
      required: false
    });
  }
})

module.exports = {
  Project,
  ProjectInput,
  NewProjectInput
};
