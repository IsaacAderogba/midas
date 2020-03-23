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
    t.field(userQueryKeys.helloWorld, {
      type: "String",
      resolve: () => {
        return "Hello World";
      }
    });

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
      resolve: async (parent, args, { dataSources, userId }) => {
        return await dataSources.userAPI.getUser({ id: userId });
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
      resolve: async (parent, args, { dataSources }) => {
        return await dataSources.userAPI.registerUser(args.registerInput);
      }
    });
    t.field(userResolverKeys.updateUser, {
      type: User,
      nullable: true,
      args: {
        userInput: arg({ type: UserInput })
      },
      resolve: async (parent, args, { dataSources, userId }) => {
        return await dataSources.userAPI.updateUser(
          { id: userId },
          { ...args.userInput }
        );
      }
    });
    t.field(userResolverKeys.deleteUser, {
      type: User,
      nullable: true,
      resolve: async (parent, args, { dataSources, userId }) => {
        return await dataSources.userAPI.deleteUser({ id: userId });
      }
    });
  }
});

module.exports = {
  UserQuery: Query,
  UserMutation: Mutation
};
