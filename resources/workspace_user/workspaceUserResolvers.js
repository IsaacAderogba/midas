const { extendType } = require("nexus");
const {
  workspaceUserQueryKeys,
  workspaceUserResolverKeys
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
      resolve: (parent, { where }, { dataSources }) => {
        return dataSources.workspaceUserAPI.readWorkspaceUser(where);
      }
    });
  }
});

const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field(workspaceUserResolverKeys.createWorkspaceUser, {
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
    t.field(workspaceUserResolverKeys.updateWorkspaceUser, {
      type: WorkspaceUser,
      nullable: true,
      args: {
        where: WorkspaceUserWhere,
        workspaceUserInput: WorkspaceUserInput
      },
      resolve: (parent, { where, workspaceUserInput }, { dataSources }) => {
        return dataSources.workspaceUserAPI.updateWorkspaceUser(
          where,
          workspaceUserInput
        );
      }
    });
    t.field(workspaceUserResolverKeys.deleteWorkspaceUser, {
      type: "Boolean",
      nullable: false,
      args: {
        where: WorkspaceUserWhere
      },
      resolve: (parent, { where }, { dataSources }) => {
        return dataSources.workspaceUserAPI.deleteWorkspaceUser(where);
      }
    });
  }
});

module.exports = {
  WorkspaceUserQuery: Query,
  WorkspaceUserMutation: Mutation
};
