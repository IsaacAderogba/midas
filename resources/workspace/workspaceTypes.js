const { objectType, inputObjectType } = require("nexus");

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
