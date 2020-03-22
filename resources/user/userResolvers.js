const { userQueryKeys } = require("./userUtils");
const { extendType, arg } = require("nexus");
const { AuthUser, UserInput } = require("./userTypes");
const UserController = require("./userControllers");

const Query = extendType({
  type: "Query",
  definition(t) {
    t.field(userQueryKeys.helloWorld, {
      type: "String",
      resolve: (parent, args) => {
        console.log(args);
        return "Hello World";
      }
    });
  }
});

const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("registerUser", {
      type: AuthUser,
      nullable: true,
      args: {
        userInput: arg({ type: UserInput })
      },
      resolve: async (parent, args) => {
        const user = await UserController.registerUser(args.userInput);
        return user;
      }
    });
  }
});

module.exports = {
  userQuery: Query,
  userMutation: Mutation
};
