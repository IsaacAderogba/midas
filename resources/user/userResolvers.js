const { userQueryKeys, userResolverKeys } = require("./userUtils");
const { extendType, arg } = require("nexus");
const {
  AuthUser,
  LoginInput,
  RegisterInput,
  User,
  UserInput
} = require("./userTypes");

const Query = extendType({
  type: "Query",
  definition(t) {
    t.field(userQueryKeys.loginUser, {
      type: AuthUser,
      nullable: true,
      args: {
        loginInput: LoginInput
      },
      resolve: async (parent, args, { dataSources }) => {
        return await dataSources.userAPI.loginUser({
          ...args.loginInput
        });
      }
    });

    t.field(userQueryKeys.user, {
      type: User,
      nullable: true,
      resolve: (parent, args, { user, dataSources }) => {
        return dataSources.userAPI.readUser({ id: user.id });
      }
    });
  }
});

const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field(userResolverKeys.registerUser, {
      type: AuthUser,
      nullable: true,
      args: {
        registerInput: arg({ type: RegisterInput })
      },
      resolve: (parent, args, { dataSources }) => {
        return dataSources.userAPI.registerUser(args.registerInput);
      }
    });
    t.field(userResolverKeys.updateUser, {
      type: User,
      nullable: true,
      args: {
        userInput: arg({ type: UserInput })
      },
      resolve: (parent, args, { dataSources, user }) => {
        return dataSources.userAPI.updateUser(
          { id: user.id },
          { ...args.userInput }
        );
      }
    });
    t.field(userResolverKeys.deleteUser, {
      type: "Boolean",
      nullable: false,
      resolve: (parent, args, { dataSources, user }) => {
        return dataSources.userAPI.deleteUser({ id: user.id });
      }
    });
  }
});

module.exports = {
  UserQuery: Query,
  UserMutation: Mutation
};
