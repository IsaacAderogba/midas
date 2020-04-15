const { userQueryKeys, userMutationKeys, userErrors } = require("./userUtils");
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
    t.field(userMutationKeys.loginUser, {
      type: AuthUser,
      nullable: false,
      args: {
        loginInput: LoginInput
      },
      resolve: async (parent, args, { dataSources }) => {
        const user = await dataSources.userAPI.loginUser({
          ...args.loginInput
        });
        if(!user) throw userErrors.EmailPasswordWrong
        return user;
      }
    });
    t.field(userMutationKeys.registerUser, {
      type: AuthUser,
      nullable: false,
      args: {
        registerInput: arg({ type: RegisterInput })
      },
      resolve: (parent, args, { dataSources }) => {
        return dataSources.userAPI.registerUser(args.registerInput);
      }
    });
    t.field(userMutationKeys.updateUser, {
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
    t.field(userMutationKeys.deleteUser, {
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
