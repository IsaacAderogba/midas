const { extendType, idArg, arg } = require("nexus");
const {
  projectMutationKeys,
  projectQueryKeys,
  projectSubscriptionKeys,
  projectSubscriptionChannels,
  projectRedisKeys,
} = require("./projectUtils");
const {
  NewProjectInput,
  Project,
  ProjectInput,
  ProjectWhere,
  ProjectSubscriptionPayload,
  CollaboratorPayloadInput,
  CanvasSceneEnum,
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
      resolve: async (
        parent,
        { where },
        { dataSources, user, redisClient }
      ) => {
        /**
         * The following fetches anyone that's currently collaborating on the
         * project
         */
        let collaborators = null;
        try {
          collaborators = await redisClient.hgetall(
            projectRedisKeys.projectCollaborators(user.workspaceId, where.id)
          );
          if (collaborators) {
            collaborators = Object.values(collaborators).map((c) =>
              JSON.parse(c)
            );
          }
        } catch (err) {
          console.log(err);
        }
        const project = await dataSources.projectAPI.readProject(where);

        return {
          ...project,
          collaborators,
        };
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
        collaboratorPayloadInput: arg({
          type: CollaboratorPayloadInput,
          required: false,
        }),
        projectInput: arg({ type: ProjectInput, required: false }),
        where: arg({ type: ProjectWhere, required: true }),
      },
      resolve: async (
        parent,
        { projectInput, where, collaboratorPayloadInput },
        { dataSources, user, pubsub, redisClient }
      ) => {
        let updatedProject = null;
        if (projectInput) {
          updatedProject = await dataSources.projectAPI.updateProject(
            where,
            projectInput ? projectInput : {}
          );
        }
        console.log("UPDATED PROJECT", updatedProject);

        pubsub.publish(projectSubscriptionChannels.projects(user.workspaceId), {
          [projectSubscriptionKeys.projects]: {
            mutation: MutationEnum.UPDATED,
            data: updatedProject,
            updatedFields: [],
          },
        });

        /**
         * The following enables real time collaborative editing on the web app.
         * We use Redis as a temporary data store to keep track of who is currently
         * collaborating
         */
        if (collaboratorPayloadInput) {
          const projectCollaboratorsRedisKey = projectRedisKeys.projectCollaborators(
            user.workspaceId,
            where.id
          );
          const { canvasScene } = collaboratorPayloadInput;
          switch (canvasScene) {
            case CanvasSceneEnum.CLIENT_CONNECT:
              try {
                const collaborator = await redisClient.hget(
                  projectCollaboratorsRedisKey,
                  user.workspaceId
                );
                if (!collaborator) {
                  await redisClient.hset(
                    projectCollaboratorsRedisKey,
                    user.workspaceId,
                    JSON.stringify(collaboratorPayloadInput)
                  );
                }
              } catch (err) {
                throw new Error(err);
              }
              break;
            case CanvasSceneEnum.CLIENT_DISCONNECT:
              try {
                await redisClient.hdel(
                  projectCollaboratorsRedisKey,
                  user.workspaceId
                );
              } catch (err) {
                throw new Error(err);
              }
              break;
            default:
              break;
          }
          pubsub.publish(
            projectSubscriptionChannels.project(user.workspaceId, where.id),
            {
              [projectSubscriptionKeys.project]: {
                mutation: MutationEnum.UPDATED,
                collaboratorPayload: collaboratorPayloadInput,
                data: updatedProject,
                updatedFields: [],
              },
            }
          );
        }

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
      resolve: ({ project }) => {
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
