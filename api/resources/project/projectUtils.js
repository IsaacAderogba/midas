const { UserInputError } = require("apollo-server-express");

const projectQueryKeys = {
  project: "project",
  projects: "projects",
};

const projectMutationKeys = {
  createProject: "createProject",
  updateProject: "updateProject",
  deleteProject: "deleteProject",
};

const projectSubscriptionKeys = {
  projects: "projects",
  project: "project",
};

const projectSubscriptionChannels = {
  [projectSubscriptionKeys.projects]: (workspaceId) =>
    `workspace-${workspaceId}:${projectSubscriptionKeys.projects}`,
  [projectSubscriptionKeys.project]: (workspaceId, projectId) =>
    `workspace-${workspaceId}:${projectSubscriptionKeys.project}-${projectId}`,
};

const projectRedisKeys = {
  "projectCollaborators": (workspaceId, projectId) =>
  `workspace-${workspaceId}:${projectSubscriptionKeys.project}-${projectId}-collaborators`
}

const projectErrors = {
  ProjectNotFound: new UserInputError("Project not found"),
};

module.exports = {
  projectQueryKeys,
  projectMutationKeys,
  projectSubscriptionKeys,
  projectErrors,
  projectSubscriptionChannels,
  projectRedisKeys
};
