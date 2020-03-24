const { shield } = require("graphql-shield");
const { userQueryKeys, userResolverKeys, userErrors } = require("./userUtils");
const UserAPI = require("./userDataSource");
const { isAuthenticated } = require("../permissions");

async function validUserMiddleware(resolve, parent, args, context, info) {
  const validUser = await UserAPI.getUser({ id: context.user.id });
  if (!validUser) throw userErrors.UserNotFound;

  return resolve(parent, args, context, info);
}

async function emailExistsMiddleware(resolve, parent, args, context, info) {
  const { email } = args.registerInput;
  const validUser = await UserAPI.getUser({ email });
  if (validUser) throw userErrors.UserAlreadyExists;

  return resolve(parent, args, context, info);
}

const UserPermissions = shield({
  Query: {
    [userQueryKeys.user]: isAuthenticated
  },
  Mutation: {
    [userResolverKeys.updateUser]: isAuthenticated,
    [userResolverKeys.deleteUser]: isAuthenticated
  }
});

const UserMiddleware = {
  Query: {
    [userQueryKeys.user]: validUserMiddleware
  },
  Mutation: {
    [userResolverKeys.updateUser]: validUserMiddleware,
    [userResolverKeys.deleteUser]: validUserMiddleware,
    [userResolverKeys.registerUser]: emailExistsMiddleware
  }
};

module.exports = {
  UserPermissions,
  UserMiddleware
};
