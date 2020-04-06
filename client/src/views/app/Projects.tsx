// modules
import React, { useEffect, useState } from "react";
import gql from "graphql-tag";

// components

// helpers
import { Project } from "../../~reusables/utils/fragments";
import {
  useGetProjectsLazyQuery,
  GetProjectsQuery,
  ProjectsDocument,
  ProjectsSubscription,
  MutationType,
} from "../../generated/graphql";
import { useAppStore } from "../../~reusables/contexts/AppProvider";
import { Maybe } from "../../~reusables/utils/types";

export const Projects = () => {
  const workspace = useAppStore((state) => state.workspace);
  let unsubscribeFromMore: Maybe<() => void> = null;

  const [
    getProjects,
    { loading, subscribeToMore, data },
  ] = useGetProjectsLazyQuery({
    fetchPolicy: "network-only",
    onCompleted(data) {
      if (data && data.projects) {
        unsubscribeFromMore = subscribeToMore<ProjectsSubscription>({
          document: ProjectsDocument,
          updateQuery(prev, { subscriptionData: { data } }) {
            if (!data.projects) return prev;

            const projectData = data.projects.data;
            switch (data.projects.mutation) {
              case MutationType.Created:
                return Object.assign({}, prev, {
                  projects: [projectData, ...prev.projects],
                });
              case MutationType.Updated:
                return Object.assign({}, prev, {
                  projects: prev.projects.map((project) =>
                    project.id === projectData.id ? projectData : project
                  ),
                });
              case MutationType.Deleted:
                return Object.assign({}, prev, {
                  projects: prev.projects.filter(
                    (project) => project.id !== projectData.id
                  ),
                });
              default:
                return prev;
            }
          },
          onError(err) {
            console.log(err);
          },
        });
      }
    },
  });

  useEffect(() => {
    if (workspace) {
      getProjects();
    }

    return () => {
      if (unsubscribeFromMore) {
        unsubscribeFromMore();
      }
    };
  }, [workspace, getProjects]);

  if (loading) return <div>loading</div>;
  if (!data || !data.projects.length) return <div>No projects</div>;

  return (
    <section>
      {data.projects.map((project) => (
        <div key={project.id}>{project.title}</div>
      ))}
    </section>
  );
};

export const getProjects = gql`
  query getProjects($where: ProjectWhere) {
    projects(where: $where) {
      ...projectsAttributes
    }
  }
  ${Project.fragments.projectsAttributes}
`;

export const projectsSubscription = gql`
  subscription projects {
    projects {
      mutation
      data {
        ...projectsAttributes
      }
    }
  }
  ${Project.fragments.projectsAttributes}
`;
