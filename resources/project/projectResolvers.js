const { extendType, idArg, arg } = require("nexus");
const {
  projectMutationKeys,
  projectQueryKeys,
  projectSubscriptionKeys,
} = require("./projectUtils");
const {
  NewProjectInput,
  Project,
  ProjectInput,
  ProjectWhere,
} = require("./projectTypes");

const Query = extendType({
  type: "Query",
  definition(t) {
    t.field(projectQueryKeys.project, {
      type: Project,
      nullable: true,
      args: {
        where: arg({ type: ProjectWhere, required: true }),
      },
      resolve: (parent, { where }, { dataSources }) => {
        return dataSources.projectAPI.readProject(where);
      },
    });
    t.list.field(projectQueryKeys.projects, {
      type: Project,
      nullable: true,
      args: {
        where: arg({ type: ProjectWhere, required: true })
      },
      resolve: (parent, { where }, { dataSources }) => {
        return dataSources.projectAPI.readProjects(where);
      },
    });
  },
});

const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field(projectMutationKeys.createProject, {
      type: Project,
      nullable: true,
      args: {
        newProjectInput: arg({ type: NewProjectInput, required: true }),
      },
      resolve: (parent, { newProjectInput }, { dataSources, user }) => {
        return dataSources.projectAPI.createProject({
          workspaceId: user.workspaceId,
          ...newProjectInput,
        });
      },
    });
    t.field(projectMutationKeys.updateProject, {
      type: Project,
      nullable: true,
      args: {
        projectInput: arg({ type: ProjectInput, required: true }),
        where: arg({ type: ProjectWhere, required: true }),
      },
      resolve: (parent, { projectInput, where }, { dataSources }) => {
        return dataSources.projectAPI.updateProject(where, projectInput);
      },
    });
    t.field(projectMutationKeys.deleteProject, {
      type: "Boolean",
      nullable: true,
      args: {
        projectId: idArg({ required: true }),
      },
      resolve: (parent, { projectId }, { dataSources }) => {
        return dataSources.projectAPI.deleteProject({ id: projectId });
      },
    });
  },
});

module.exports = {
  ProjectQuery: Query,
  ProjectMutation: Mutation,
};
