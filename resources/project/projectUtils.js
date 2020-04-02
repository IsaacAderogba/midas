const { UserInputError } = require("apollo-server-express");

const projectQueryKeys = {

}

const projectMutationKeys = {

}

const projectSubscriptionKeys = {

}

const projectErrors = {
  ProjectNotFound: new UserInputError("Project not found")
}

module.exports = {
  projectQueryKeys,
  projectMutationKeys,
  projectSubscriptionKeys,
  projectErrors
}