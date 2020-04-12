// modules
import React, { useEffect } from "react";
import { css } from "styled-components/macro";

// components
import { H5, P3 } from "../../components/atoms/Text";
import { EllipsisOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { Link } from "react-router-dom";

// helpers
import {
  useGetProjectsLazyQuery,
  ProjectsDocument,
  ProjectsSubscription,
  GetProjectsQuery,
  MutationType
} from "../../generated/graphql";
import { useAppStore } from "../../~reusables/contexts/AppProvider";
import { Maybe } from "../../~reusables/utils/types";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";

export const Projects = () => {
  const workspace = useAppStore(state => state.workspace);
  let unsubscribeFromMore: Maybe<() => void> = null;

  const [
    getProjects,
    { loading, subscribeToMore, data }
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
                  projects: [projectData, ...prev.projects]
                });
              case MutationType.Updated:
                return Object.assign({}, prev, {
                  projects: prev.projects.map(project =>
                    project.id === projectData.id ? projectData : project
                  )
                });
              case MutationType.Deleted:
                return Object.assign({}, prev, {
                  projects: prev.projects.filter(
                    project => project.id !== projectData.id
                  )
                });
              default:
                return prev;
            }
          },
          onError(err) {
            console.log(err);
          }
        });
      }
    }
  });

  useEffect(() => {
    if (workspace) getProjects();
  }, [workspace, getProjects]);

  useEffect(() => {
    return () => {
      if (unsubscribeFromMore) unsubscribeFromMore();
    };
  }, [unsubscribeFromMore]);

  if (loading) return <div>loading</div>;
  if (!data || !data.projects.length) return <div>No projects</div>;

  return (
    <section
      css={css`
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
      `}
    >
      {data.projects.map(project => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </section>
  );
};

const ProjectItem: React.FC<{ project: GetProjectsQuery["projects"][0] }> = ({
  project: { title, updatedAt, uuid }
}) => {
  const { fontSizes, colors } = useTheme();

  return (
    <Card
      bodyStyle={{ padding: 0 }}
      css={css`
        flex: 1 1 280px;
        border-radius: ${p => p.theme.radii[2]}px;
        margin: ${props =>
          `0 ${props.theme.space[8]}px ${props.theme.space[8]}px 0`};
        border: 1px solid ${p => p.theme.colors.greys[9]};
        cursor: pointer;

        &:hover {
          box-shadow: ${p => p.theme.shadows.shallow};
          transition: box-shadow 120ms ease-in-out;
        }
      `}
    >
      <Link to={`/app/canvas/${uuid}`}>
        <section
          css={css`
            width: 100%;
            height: 160px;
          `}
        >
          <img
            css={css`
              width: 100%;
              height: 100%;
              object-fit: cover;
            `}
            alt="dummy"
            src={"https://via.placeholder.com/150"}
          />
        </section>
        <section
          css={css`
            padding: ${p => `${p.theme.space[5]}px ${p.theme.space[5]}px`};
          `}
        >
          <div>
            <H5>{title}</H5>
          </div>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <P3 color={colors.lightText}>{updatedAt}</P3>
            <EllipsisOutlined style={{ fontSize: fontSizes[4] }} rotate={90} />
          </div>
        </section>
      </Link>
    </Card>
  );
};
