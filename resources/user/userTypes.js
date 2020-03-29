const { objectType, inputObjectType } = require("nexus");
const { Workspace } = require("../workspace/workspaceTypes");

const AuthUser = objectType({
  name: "AuthUser",
  definition(t) {
    t.id("userId");
    t.string("firstName");
    t.string("lastName");
    t.string("avatarURL", { nullable: true });
    t.string("token");
    t.boolean("isVerified");
    t.field("user", {
      type: User,
      nullable: false,
      resolve: (authUser, args, { dataSources }) => {
        return dataSources.userAPI.readUser({ id: authUser.userId });
      }
    });
  }
});

const User = objectType({
  name: "User",
  definition(t) {
    t.id("id", {
      nullable: false
    });
    t.string("firstName", {
      nullable: false
    });
    t.string("lastName", {
      nullable: false
    });
    t.string("email", {
      nullable: false
    });
    t.string("avatarURL", {
      nullable: true
    });
    t.boolean("isVerified", {
      nullable: false
    });
    t.boolean("photoId", {
      nullable: true
    });
    t.list.field("workspaces", {
      type: Workspace,
      nullable: true,
      resolve: async (user, args, { dataSources }) => {
        return dataSources.workspaceAPI.readWorkspaces({
          userId: user.id
        });
      }
    });
  }
});

const LoginInput = inputObjectType({
  name: "LoginInput",
  definition(t) {
    t.string("email", { required: true });
    t.string("password", { required: true });
  }
});

const RegisterInput = inputObjectType({
  name: "RegisterInput",
  definition(t) {
    t.string("firstName", { required: true });
    t.string("lastName", { required: true });
    t.string("email", { required: true });
    t.string("password", { required: true });
    t.string("avatarURL", { required: false });
  }
});

const UserInput = inputObjectType({
  name: "UserInput",
  definition(t) {
    // exclude email and password from being updated for now
    t.string("firstName", { required: false });
    t.string("lastName", { required: false });
    t.string("avatarURL", { required: false });
    t.string("isVerified", { required: false });
    t.string("photoId", { required: false });
  }
});

module.exports = {
  AuthUser,
  User,
  LoginInput,
  RegisterInput,
  UserInput
};
