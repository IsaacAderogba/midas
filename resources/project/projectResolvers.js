const { extendType, idArg, arg } = require("nexus");
const {
  projectMutationKeys,
  projectQueryKeys,
  projectSubscriptionKeys,
  projectSubscriptionChannels,
} = require("./projectUtils");
const {
  NewProjectInput,
  Project,
  ProjectInput,
  ProjectWhere,
  ProjectSubscriptionPayload,
  CanvasPayloadInput,
} = require("./projectTypes");
const { MutationEnum } = require("../types");

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
      nullable: false,
      args: {
        where: arg({ type: ProjectWhere, required: false }),
      },
      resolve: (parent, { where = {} }, { dataSources, user }) => {
        return dataSources.projectAPI.readProjects({
          ...where,
          workspaceId: user.workspaceId,
        });
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
      resolve: async (
        parent,
        { newProjectInput },
        { dataSources, user, pubsub }
      ) => {
        const createdProject = await dataSources.projectAPI.createProject({
          workspaceId: user.workspaceId,
          ...newProjectInput,
        });

        pubsub.publish(projectSubscriptionChannels.projects(user.workspaceId), {
          [projectSubscriptionKeys.projects]: {
            mutation: MutationEnum.CREATED,
            data: createdProject,
            updatedFields: [],
          },
        });

        return createdProject;
      },
    });
    t.field(projectMutationKeys.updateProject, {
      type: Project,
      nullable: true,
      args: {
        canvasPayloadInput: arg({ type: CanvasPayloadInput, required: false }),
        projectInput: arg({ type: ProjectInput, required: true }),
        where: arg({ type: ProjectWhere, required: true }),
      },
      resolve: async (
        parent,
        { projectInput, where },
        { dataSources, user, pubsub }
      ) => {
        const updatedProject = await dataSources.projectAPI.updateProject(
          where,
          projectInput
        );

        pubsub.publish(projectSubscriptionChannels.projects(user.workspaceId), {
          [projectSubscriptionKeys.projects]: {
            mutation: MutationEnum.UPDATED,
            data: updatedProject,
            updatedFields: [],
          },
        });

        // pubsub.publish(
        //   projectSubscriptionChannels.project(user.workspaceId, where.id),
        //   {
        //     [projectSubscriptionKeys.project]: {
        //       mutation: MutationEnum.UPDATED,
        //       data: updatedProject,
        //       updatedFields: [],
        //     },
        //   }
        // );

        return updatedProject;
      },
    });
    t.field(projectMutationKeys.deleteProject, {
      type: Project,
      nullable: true,
      args: {
        projectId: idArg({ required: true }),
      },
      resolve: async (parent, { projectId }, { dataSources, pubsub, user }) => {
        const deletedProject = await dataSources.projectAPI.deleteProject({
          id: projectId,
        });

        pubsub.publish(projectSubscriptionChannels.projects(user.workspaceId), {
          [projectSubscriptionKeys.projects]: {
            mutation: MutationEnum.DELETED,
            data: deletedProject,
            updatedFields: [],
          },
        });

        return deletedProject;
      },
    });
  },
});

const Subscription = extendType({
  type: "Subscription",
  definition(t) {
    t.field(projectSubscriptionKeys.projects, {
      type: ProjectSubscriptionPayload,
      nullable: false,
      subscribe: (parent, args, { user, pubsub }) => {
        return pubsub.asyncIterator(
          projectSubscriptionChannels.projects(user.workspaceId)
        );
      },
      resolve: ({ projects }) => {
        return projects;
      },
    });
    t.field(projectSubscriptionKeys.project, {
      type: ProjectSubscriptionPayload,
      nullable: false,
      args: {
        where: arg({ type: ProjectWhere, required: true }),
      },
      subscribe: (parent, { where }, { user, pubsub }) => {
        console.log(
          "PROJECT CHANNEL",
          projectSubscriptionChannels.project(user.workspaceId, where.id)
        );
        return pubsub.asyncIterator(
          projectSubscriptionChannels.project(user.workspaceId, where.id)
        );
      },
      resolve: ({ project }, args, { pubsub, user }) => {
        console.log(user);

        return project;
      },
    });
  },
});

module.exports = {
  ProjectQuery: Query,
  ProjectMutation: Mutation,
  ProjectSubscription: Subscription,
};
