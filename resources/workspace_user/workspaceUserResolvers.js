const { extendType } = require("nexus");
const {
  workspaceUserQueryKeys,
  workspaceUserMutationKeys
} = require("./workspaceUserUtils");
const {
  WorkspaceUser,
  WorkspaceUserInput,
  WorkspaceUserWhere,
  NewWorkspaceUserInput
} = require("./workspaceUserTypes");

const Query = extendType({
  type: "Query",
  definition(t) {
    t.field(workspaceUserQueryKeys.workspaceUser, {
      type: WorkspaceUser,
      nullable: true,
      args: {
        where: WorkspaceUserWhere
      },
      resolve: (parent, { where }, { dataSources, user }) => {
        return dataSources.workspaceUserAPI.readWorkspaceUser({
          ...where,
          workspaceId: user.workspaceId
        });
      }
    });
    t.list.field(workspaceUserQueryKeys.workspaceUsers, {
      type: WorkspaceUser,
      nullable: true,
      resolve: (parent, args, { dataSources, user }) => {
        return dataSources.workspaceUserAPI.readWorkspaceUsers({
          workspaceId: user.workspaceId
        });
      }
    });
  }
});

const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field(workspaceUserMutationKeys.createWorkspaceUser, {
      type: WorkspaceUser,
      nullable: true,
      args: {
        newWorkspaceUserInput: NewWorkspaceUserInput
      },
      resolve: (parent, { newWorkspaceUserInput }, { dataSources }) => {
        return dataSources.workspaceUserAPI.createWorkspaceUser(
          newWorkspaceUserInput
        );
      }
    });
    t.field(workspaceUserMutationKeys.updateWorkspaceUser, {
      type: WorkspaceUser,
      nullable: true,
      args: {
        where: WorkspaceUserWhere,
        workspaceUserInput: WorkspaceUserInput
      },
      resolve: (
        parent,
        { where, workspaceUserInput },
        { dataSources, user }
      ) => {
        return dataSources.workspaceUserAPI.updateWorkspaceUser(
          { ...where, workspaceId: user.workspaceId },
          workspaceUserInput
        );
      }
    });
    t.field(workspaceUserMutationKeys.deleteWorkspaceUser, {
      type: "Boolean",
      nullable: false,
      args: {
        where: WorkspaceUserWhere
      },
      resolve: (parent, { where }, { dataSources, user }) => {
        return dataSources.workspaceUserAPI.deleteWorkspaceUser({
          ...where,
          workspaceId: user.workspaceId
        });
      }
    });
  }
});

module.exports = {
  WorkspaceUserQuery: Query,
  WorkspaceUserMutation: Mutation
};
