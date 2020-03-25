// TODO - use husky for commits
// TODO - check all nullable fields which I've been defaulting to true
const { extendType, arg, idArg } = require("nexus");
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
      args: {
        workspaceId: idArg({ required: true })
      },
      resolve: (parent, { workspaceId }, { dataSources }) => {
        return dataSources.workspaceAPI.readWorkspace({
          id: workspaceId
        });
      }
    });
    t.list.field(workspaceQueryKeys.workspaces, {
      type: Workspace,
      args: {
        userId: idArg({ required: true })
      },
      resolve: async (parent, { userId }, { dataSources }) => {
        return await dataSources.workspaceAPI.readWorkspaces({
          userId
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
        workspaceId: idArg({ required: true }),
        workspaceInput: arg({ type: WorkspaceInput })
      },
      resolve: (parent, { workspaceInput, workspaceId }, { dataSources }) => {
        return dataSources.workspaceAPI.updateWorkspace(
          { id: workspaceId },
          workspaceInput
        );
      }
    });

    t.field(workspaceResolverKeys.deleteWorkspace, {
      type: "Boolean",
      nullable: false,
      args: {
        workspaceId: idArg({ required: true })
      },
      resolve: (parent, { workspaceId }, { dataSources }) => {
        return dataSources.workspaceAPI.deleteWorkspace({
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
