const { shield } = require("graphql-shield");
const { userQueryKeys, userMutationKeys, userErrors } = require("./userUtils");
const UserAPI = require("./userDataSource");
const { isAuthenticated } = require("../permissions");

async function validUserMiddleware(resolve, parent, args, context, info) {
  const validUser = await UserAPI.readUser({ id: context.user.id });
  if (!validUser) throw userErrors.UserNotFound;

  return resolve(parent, args, context, info);
}

async function emailExistsMiddleware(resolve, parent, args, context, info) {
  const { email } = args.registerInput;
  const validUser = await UserAPI.readUser({ email });
  if (validUser) throw userErrors.UserAlreadyExists;

  return resolve(parent, args, context, info);
}

const UserPermissions = shield(
  {
    Query: {
      [userQueryKeys.user]: isAuthenticated
    },
    Mutation: {
      [userMutationKeys.updateUser]: isAuthenticated,
      [userMutationKeys.deleteUser]: isAuthenticated
    }
  },
  {
    debug: process.env.DB_ENV === "development" ? true : true
  }
);

const UserMiddleware = {
  Query: {
    [userQueryKeys.user]: validUserMiddleware
  },
  Mutation: {
    [userMutationKeys.updateUser]: validUserMiddleware,
    [userMutationKeys.deleteUser]: validUserMiddleware,
    [userMutationKeys.registerUser]: emailExistsMiddleware
  }
};

module.exports = {
  UserPermissions,
  UserMiddleware
};
