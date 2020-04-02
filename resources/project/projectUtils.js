const { UserInputError } = require("apollo-server-express");

const projectQueryKeys = {
  project: 'project',
  projects: "projects"
}

const projectMutationKeys = {
  createProject: "createProject",
  updateProject: "updateProject",
  deleteProject: "deleteProject"
}

const projectSubscriptionKeys = {
  // projectSub
  // projectsSub
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