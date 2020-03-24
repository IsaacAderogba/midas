const { UserMiddleware, UserPermissions } = require("./user/userMiddlewares");
const { UserQuery, UserMutation } = require("./user/userResolvers");

module.exports = {
  Query: [UserQuery],
  Mutation: [UserMutation],
  Middleware: [UserPermissions, UserMiddleware]
};
