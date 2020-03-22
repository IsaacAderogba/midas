const {
  userMiddlewares: { userMiddleware },
  userResolvers: { userQuery }
} = require("./user");

module.exports = {
  Query: [userQuery],
  Mutation: [],
  Middleware: [userMiddleware]
};
