const {
  userMiddlewares: { userMiddleware },
  userResolvers: { userQuery, userMutation }
} = require("./user");

module.exports = {
  Query: [userQuery],
  Mutation: [userMutation],
  Middleware: [userMiddleware]
};
