const { UserMiddleware } = require("./user/userMiddlewares");
const { UserQuery, UserMutation } = require("./user/userResolvers");

module.exports = {
  Query: [UserQuery],
  Mutation: [UserMutation],
  Middleware: [UserMiddleware]
};
