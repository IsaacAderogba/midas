// Todo - write middleware to check for user existence
const { userQueryKeys } = require("./userUtils");

async function logUserMiddleware(resolve, parent, args, context, info) {
  const argsWithUser = { user: "Isaac", ...logUser() };
  return resolve(parent, argsWithUser, context, info);
}

function logUser() {
  return { user: "Isaac" };
}

const userMiddleware = {
  Query: {
    [userQueryKeys.helloWorld]: logUserMiddleware
  }
};

module.exports = {
  userMiddleware,
  logUserMiddleware,
  logUser
};
