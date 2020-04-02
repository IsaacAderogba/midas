const { extendType, idArg } = require("nexus");
const {
  projectMutationKeys,
  projectQueryKeys,
  projectSubscriptionKeys
} = require("./projectUtils");
const {
  NewProjectInput,
  Project,
  ProjectInput,
  ProjectWhere
} = require("./projectTypes");

const Query = extendType({
  type: "Query",
  definition(t) {
    t.field(projectQueryKeys.project, {
      type: Project,
      nullable: true,
      args: {
        where: ProjectWhere
      },
      resolve: (parent, { where }, { dataSources }) => {
        return dataSources.projectAPI.readProject(where);
      }
    });
    t.list.field(projectQueryKeys.projects, {
      type: Project,
      nullable: true,
      resolve: (parent, { where }, { dataSources }) => {
        return dataSources.projectAPI.readProjects(where);
      }
    });
  }
});

const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field(projectMutationKeys.createProject, {
      type: Project,
      nullable: true,
      args: {
        newProjectInput: NewProjectInput
      },
      resolve: (parent, { newProjectInput }, { dataSources }) => {
        return dataSources.projectAPI.createProject(newProjectInput);
      }
    });
    t.field(projectMutationKeys.updateProject, {
      type: Project,
      nullable: true,
      args: {
        projectInput: ProjectInput,
        where: ProjectWhere
      },
      resolve: (parent, { projectInput, where }, { dataSources }) => {
        return dataSources.projectAPI.updateProject(where, projectInput);
      }
    });
    t.field(projectMutationKeys.deleteProject, {
      type: Project,
      nullable: true,
      args: {
        projectId: idArg({ required: true })
      },
      resolve: (parent, { projectId }, { dataSources }) => {
        return dataSources.projectAPI.deleteProject({ id: projectId });
      }
    });
  }
});

module.exports = {
  ProjectQuery: Query,
  ProjectMutation: Mutation
};
