const { objectType, inputObjectType, enumType } = require("nexus");
const { Workspace } = require("../workspace/workspaceTypes");
const { WorkspaceUser } = require("../workspace_user/workspaceUserTypes");
const { MutationType } = require("../types");

const CanvasSceneEnum = {
  SCENE_UPDATE: "SCENE_UPDATE",
  MOUSE_LOCATION: "MOUSE_LOCATION",
  CLIENT_CONNECT: "CLIENT_CONNECT",
  CLIENT_DISCONNECT: "CLIENT_DISCONNECT",
};

const CanvasScene = enumType({
  name: "CanvasScene",
  members: [
    CanvasSceneEnum.SCENE_UPDATE,
    CanvasSceneEnum.MOUSE_LOCATION,
    CanvasSceneEnum.CLIENT_CONNECT,
    CanvasSceneEnum.CLIENT_DISCONNECT,
  ],
});

const CollaboratorPayload = objectType({
  name: "CollaboratorPayload",
  definition(t) {
    t.string("userId", { nullable: false });
    t.string("firstName", { nullable: true });
    t.string("lastName", { nullable: true });
    t.string("email", { nullable: true });
    t.string("avatarURL", { nullable: true });
    t.string("color", { nullable: true });
    t.field("canvasScene", { type: CanvasScene, nullable: false });
    t.float("pointerCoordX", { nullable: true });
    t.float("pointerCoordY", { nullable: true });
  },
});

const CollaboratorPayloadInput = inputObjectType({
  name: "CollaboratorPayloadInput",
  definition(t) {
    t.string("userId", { required: true });
    t.string("firstName", { required: false });
    t.string("lastName", { required: false });
    t.string("email", { required: false });
    t.string("avatarURL", { required: false });
    t.string("color", { required: false });
    t.field("canvasScene", { type: CanvasScene, required: true });
    t.float("pointerCoordX", { required: false });
    t.float("pointerCoordY", { required: false });
  },
});

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
    t.string("createdAt", { nullable: false });
    t.string("updatedAt", { nullable: false });
    t.list.field("collaborators", { type: CollaboratorPayload, nullable: true });
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
  },
});

const ProjectWhere = inputObjectType({
  name: "ProjectWhere",
  definition(t) {
    t.id("id", { required: false });
    t.id("workspaceUserId", { required: false });
    t.id("workspaceId", { required: false });
  },
});

const ProjectSubscriptionPayload = objectType({
  name: "ProjectSubscriptionPayload",
  definition(t) {
    t.field("mutation", { type: MutationType, nullable: true });
    t.field("collaboratorPayload", { type: CollaboratorPayload, nullable: true });
    t.field("data", { type: Project, nullable: true });
    t.list.string("updatedFields", { nullable: true });
  },
});

module.exports = {
  Project,
  ProjectInput,
  NewProjectInput,
  ProjectWhere,
  ProjectSubscriptionPayload,
  CollaboratorPayloadInput,
  CanvasSceneEnum,
};
