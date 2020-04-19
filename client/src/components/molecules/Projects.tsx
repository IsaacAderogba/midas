// modules
import React, { useEffect, useState } from "react";
import { css } from "styled-components/macro";

// components
import { Empty } from "antd";
import { ProjectItem } from "../elements/ProjectItem";

// helpers
import {
  useGetProjectsLazyQuery,
  ProjectsDocument,
  ProjectsSubscription,
  MutationType,
} from "../../generated/graphql";
import { useWorkspaceStore } from "../../~reusables/contexts/WorkspaceProvider";
import { Maybe } from "../../~reusables/utils/types";

export const Projects = () => {
  const [initLoading, setInitLoading] = useState(true);
  const workspace = useWorkspaceStore((state) => state.workspace);
  let unsubscribeFromMore: Maybe<() => void> = null;

  const [
    getProjects,
    { loading, subscribeToMore, data },
  ] = useGetProjectsLazyQuery({
    fetchPolicy: "network-only",
    onError(err) {
      setInitLoading(false);
    },
    onCompleted(data) {
      setInitLoading(false);
      if (data && data.projects) {
        unsubscribeFromMore = subscribeToMore<ProjectsSubscription>({
          document: ProjectsDocument,
          updateQuery(prev, { subscriptionData: { data } }) {
            if (!data.projects || !data.projects.data) return prev;

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
        });
      }
    },
  });

  useEffect(() => {
    if (workspace?.id) {
      getProjects();
    } else {
      setInitLoading(false);
    }
    return () => {
      if (unsubscribeFromMore) unsubscribeFromMore();
    };
  }, [workspace?.id, getProjects, unsubscribeFromMore]);

  if (initLoading || loading || (data && data.projects.length)) {
    return (
      <section
        css={css`
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;
        `}
      >
        {data
          ? data.projects.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))
          : [1, 2, 3].map((num) => <ProjectItem key={num} loading={true} />)}
      </section>
    );
  }

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <Empty />
    </div>
  );
};
