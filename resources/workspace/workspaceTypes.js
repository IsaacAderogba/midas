const { objectType, inputObjectType } = require("nexus");
// const { WorkspaceUser } = require("../workspace_user/workspaceUserTypes");

const Workspace = objectType({
  name: "Workspace",
  definition(t) {
    t.id("id", { nullable: false });
    t.string("name", { nullable: false });
    t.string("url", { nullable: false });
    t.string("photoURL", { nullable: true });
    t.string("photoId", { nullable: true });
    t.string("trialStartedAt", { nullable: true });
    t.int("seats", { nullable: false });
    t.list.field("workspaceUsers", {
      type: 'WorkspaceUser', // using the actual type introduces a circular dependecy
      nullable: false,
      resolve: async (workspace, args, { dataSources }) => {
        return dataSources.workspaceUserAPI.readWorkspaceUsers({
          workspaceId: workspace.id
        });
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
