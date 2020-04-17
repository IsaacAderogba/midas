const { extendType, arg } = require("nexus");
const {
  workspaceUserQueryKeys,
  workspaceUserMutationKeys,
} = require("./workspaceUserUtils");
const {
  WorkspaceUser,
  WorkspaceUserInput,
  WorkspaceUserWhere,
  NewWorkspaceUserInput,
  InvitedWorkspaceUser,
  InvitedWorkspaceUserInput,
} = require("./workspaceUserTypes");
const { AuthUser, RegisterInput, LoginInput } = require("../user/userTypes");
const Mailer = require("../../services/email/Mailer");
const inviteTemplate = require("../../services/email/inviteTemplate");

const Query = extendType({
  type: "Query",
  definition(t) {
    t.field(workspaceUserQueryKeys.workspaceUser, {
      type: WorkspaceUser,
      nullable: true,
      args: {
        where: WorkspaceUserWhere,
      },
      resolve: (parent, { where }, { dataSources, user }) => {
        return dataSources.workspaceUserAPI.readWorkspaceUser({
          ...where,
          workspaceId: user.workspaceId,
        });
      },
    });
    t.list.field(workspaceUserQueryKeys.workspaceUsers, {
      type: WorkspaceUser,
      nullable: true,
      resolve: (parent, args, { dataSources, user }) => {
        return dataSources.workspaceUserAPI.readWorkspaceUsers({
          workspaceId: user.workspaceId,
        });
      },
    });
  },
});

const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field(workspaceUserMutationKeys.createWorkspaceUser, {
      type: WorkspaceUser,
      nullable: true,
      args: {
        newWorkspaceUserInput: NewWorkspaceUserInput,
      },
      resolve: (parent, { newWorkspaceUserInput }, { dataSources }) => {
        return dataSources.workspaceUserAPI.createWorkspaceUser(
          newWorkspaceUserInput
        );
      },
    });
    t.field(workspaceUserMutationKeys.updateWorkspaceUser, {
      type: WorkspaceUser,
      nullable: true,
      args: {
        where: WorkspaceUserWhere,
        workspaceUserInput: WorkspaceUserInput,
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
      },
    });
    t.field(workspaceUserMutationKeys.deleteWorkspaceUser, {
      type: "Boolean",
      nullable: false,
      args: {
        where: WorkspaceUserWhere,
      },
      resolve: (parent, { where }, { dataSources, user }) => {
        return dataSources.workspaceUserAPI.deleteWorkspaceUser({
          ...where,
          workspaceId: user.workspaceId,
        });
      },
    });
    t.field(workspaceUserMutationKeys.createInvitedWorkspaceUser, {
      type: InvitedWorkspaceUser,
      nullable: false,
      args: {
        invitedWorkspaceUserInput: InvitedWorkspaceUserInput,
      },
      resolve: async (
        parent,
        { invitedWorkspaceUserInput },
        { dataSources, user }
      ) => {
        const { firstName, lastName, workspaceUserId, workspaceId } = user;
        const invitedUser = await dataSources.workspaceUserAPI.createInvitedWorkspaceUser(
          { ...invitedWorkspaceUserInput, workspaceUserId, workspaceId }
        );
        const workspace = await dataSources.workspaceAPI.readWorkspace({
          id: workspaceId,
        });
        const subject = `${firstName} ${lastName} has invited you to join ${workspace.name}'s workspace`;
        const mailer = new Mailer(
          { ...invitedUser, subject },
          inviteTemplate(
            { firstName, lastName, workspaceName: workspace.name },
            invitedUser
          )
        );
        await mailer.send();
        return invitedUser;
      },
    });
    t.field(workspaceUserMutationKeys.acceptWorkspaceUserInvite, {
      type: AuthUser,
      nullable: false,
      args: {
        invitedWorkspaceUserInput: InvitedWorkspaceUserInput,
        registerInput: arg({ type: RegisterInput, required: false }),
        loginInput: arg({ type: LoginInput, required: false }),
      },
      resolve: async (
        parent,
        { invitedWorkspaceUserInput, registerInput, loginInput },
        { dataSources }
      ) => {
        let authUser;

        if (registerInput) {
          authUser = await dataSources.userAPI.registerUser(registerInput);
        } else {
          authUser = await dataSources.userAPI.loginUser(loginInput);
        }

        const validInvitee = await dataSources.workspaceUserAPI.readInvitedWorkspaceUser(
          invitedWorkspaceUserInput
        );

        if (!validInvitee) {
          return new Error("No invited user - make middleware");
        }

        const userToInsert = {
          workspaceId: validInvitee.workspaceId,
          role: validInvitee.role,
          userId: authUser.userId,
        };

        await dataSources.workspaceUserAPI.createWorkspaceUser(userToInsert);
        return authUser;
      },
    });
  },
});

module.exports = {
  WorkspaceUserQuery: Query,
  WorkspaceUserMutation: Mutation,
};
