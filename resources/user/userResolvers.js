const { userQueryKeys, userResolverKeys } = require("./userUtils");
const { extendType, arg } = require("nexus");
const { AuthUser, LoginInput, RegisterInput } = require("./userTypes");

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
        return await dataSources.userAPI.registerUser(args.userInput);
      }
    });
  }
});

module.exports = {
  UserQuery: Query,
  UserMutation: Mutation
};
