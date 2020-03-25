// TODO - use husky for commits
// TODO - check all nullable fields which I've been defaulting to true
const {
  workspaceQueryKeys,
  workspaceResolverKeys
} = require("./workspaceUtils");
const { extendType, arg, idArg } = require("nexus");
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
      args: {
        workspaceId: idArg({ required: true })
      },
      resolve: async (parent, { workspaceId }) => ({ workspaceId })
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
      resolve: async (parent, { newWorkspaceInput }, { dataSources, user }) => {
        const workspaceId = await dataSources.workspaceAPI.createWorkspaceBatch(
          { ...newWorkspaceInput },
          user.id
        );
        return { workspaceId };
      }
    });

    t.field(workspaceResolverKeys.updateWorkspace, {
      type: Workspace,
      nullable: true,
      args: {
        workspaceId: idArg({ required: true }),
        workspaceInput: arg({ type: WorkspaceInput })
      },
      resolve: async (
        parent,
        { workspaceInput, workspaceId },
        { dataSources }
      ) => {
        const id = await dataSources.workspaceAPI.updateWorkspace(
          { id: workspaceId },
          workspaceInput
        );
        return { workspaceId: id };
      }
    });

    t.field(workspaceResolverKeys.deleteWorkspace, {
      type: "Boolean",
      nullable: false,
      args: {
        workspaceId: idArg({ required: true })
      },
      resolve: async (parent, { workspaceId }, { dataSources }) => {
        return await dataSources.workspaceAPI.deleteWorkspace({
          id: workspaceId
        });
      }
    });
  }
});

module.exports = {
  WorkspaceQuery: Query,
  WorkspaceMutation: Mutation
};
