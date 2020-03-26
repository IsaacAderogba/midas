// TODO - use husky for commits
// TODO - check all nullable fields which I've been defaulting to true
const { extendType, arg } = require("nexus");
const {
  workspaceQueryKeys,
  workspaceResolverKeys
} = require("./workspaceUtils");
const {
  NewWorkspaceInput,
  Workspace,
  WorkspaceInput
} = require("./workspaceTypes");

const Query = extendType({
  type: "Query",
  definition(t) {
    t.field(workspaceQueryKeys.workspace, {
      type: Workspace,
      nullable: true,
      resolve: (parent, args, { dataSources, user }) => {
        return dataSources.workspaceAPI.readWorkspace({
          id: user.workspaceId
        });
      }
    });
    t.list.field(workspaceQueryKeys.workspaces, {
      type: Workspace,
      resolve: async (parent, args, { dataSources, user }) => {
        return await dataSources.workspaceAPI.readWorkspaces({
          userId: user.id
        });
      }
    });
  }
});

const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field(workspaceResolverKeys.createWorkspace, {
      type: Workspace,
      nullable: true,
      args: {
        newWorkspaceInput: arg({ type: NewWorkspaceInput })
      },
      resolve: (parent, { newWorkspaceInput }, { dataSources, user }) => {
        return dataSources.workspaceAPI.createWorkspaceBatch(
          { ...newWorkspaceInput },
          user.id
        );
      }
    });

    t.field(workspaceResolverKeys.updateWorkspace, {
      type: Workspace,
      nullable: true,
      args: {
        workspaceInput: arg({ type: WorkspaceInput })
      },
      resolve: (parent, { workspaceInput }, { dataSources, user }) => {
        return dataSources.workspaceAPI.updateWorkspace(
          { id: user.workspaceId },
          workspaceInput
        );
      }
    });

    t.field(workspaceResolverKeys.deleteWorkspace, {
      type: "Boolean",
      nullable: false,

      resolve: (parent, args, { dataSources, user }) => {
        return dataSources.workspaceAPI.deleteWorkspace({
          id: user.workspaceId
        });
      }
    });
  }
});

module.exports = {
  WorkspaceQuery: Query,
  WorkspaceMutation: Mutation
};
