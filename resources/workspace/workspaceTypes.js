const { objectType, inputObjectType } = require("nexus");

const Workspace = objectType({
  name: "Workspace",
  definition(t) {
    t.id("id", {
      nullable: false,
      resolve: async ({ workspaceId }, args, { dataSources }) => {
        const { id } = await dataSources.workspaceAPI.readWorkspace({
          id: workspaceId
        });
        return id;
      }
    });
    t.string("name", {
      nullable: false,
      resolve: async ({ workspaceId }, args, { dataSources }) => {
        const { name } = await dataSources.workspaceAPI.readWorkspace({
          id: workspaceId
        });
        return name;
      }
    });
    t.string("url", {
      nullable: false,
      resolve: async ({ workspaceId }, args, { dataSources }) => {
        const { url } = await dataSources.workspaceAPI.readWorkspace({
          id: workspaceId
        });
        return url;
      }
    });
    t.string("photoURL", {
      nullable: true,
      resolve: async ({ workspaceId }, args, { dataSources }) => {
        const { photoURL } = await dataSources.workspaceAPI.readWorkspace({
          id: workspaceId
        });
        return photoURL;
      }
    });
    t.string("photoId", {
      nullable: true,
      resolve: async ({ workspaceId }, args, { dataSources }) => {
        const { photoId } = await dataSources.workspaceAPI.readWorkspace({
          id: workspaceId
        });
        return photoId;
      }
    });
    t.string("trialStartedAt", {
      nullable: true,
      resolve: async ({ workspaceId }, args, { dataSources }) => {
        const { trialStartedAt } = await dataSources.workspaceAPI.readWorkspace(
          {
            id: workspaceId
          }
        );
        return trialStartedAt;
      }
    });
    t.int("seats", {
      nullable: false,
      resolve: async ({ workspaceId }, args, { dataSources }) => {
        const { seats } = await dataSources.workspaceAPI.readWorkspace({
          id: workspaceId
        });
        return seats;
      }
    });
  }
});

const NewWorkspaceInput = inputObjectType({
  name: "NewWorkspaceInput",
  definition(t) {
    t.string("name");
    t.string("url");
    t.string("photoURL", { required: false });
  }
});

const WorkspaceInput = inputObjectType({
  name: "WorkspaceInput",
  definition(t) {
    t.string("name");
    t.string("photoURL", { required: false });
  }
});

module.exports = {
  Workspace,
  NewWorkspaceInput,
  WorkspaceInput
};
