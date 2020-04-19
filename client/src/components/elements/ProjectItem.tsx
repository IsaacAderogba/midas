// modules
import React, { useState } from "react";
import { css } from "styled-components/macro";
//@ts-ignore
import ReactTimeAgo from "react-time-ago";
import { withRouter, RouteComponentProps } from "react-router-dom";

// components
import { H5, P3 } from "../atoms/Text";
import { EllipsisOutlined } from "@ant-design/icons";
import { Card, Dropdown, Menu, Input } from "antd";
import { Flex, Box } from "../atoms/Layout";

// helpers
import {
  GetProjectsQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../../generated/graphql";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";

interface IProjectItem extends RouteComponentProps {
  project?: GetProjectsQuery["projects"][0];
  loading?: boolean;
}

const _ProjectItem: React.FC<IProjectItem> = ({
  project,
  loading,
  history,
}) => {
  const [isInput, setInput] = useState(false);
  const [title, setTitle] = useState(project?.title);
  const { fontSizes, colors, space, fontWeights } = useTheme();
  const [updateProject] = useUpdateProjectMutation({
    variables: { projectInput: { title }, where: { id: project?.id } },
  });
  const [deleteProject] = useDeleteProjectMutation({
    variables: { where: { id: project?.id } },
  });

  return (
    <Card
      loading={loading}
      bodyStyle={{ padding: 0 }}
      css={css`
        flex: 1 1 280px;
        border-radius: ${(p) => p.theme.radii[2]}px;
        margin: ${(props) =>
          `0 ${props.theme.space[8]}px ${props.theme.space[8]}px 0`};
        border: 1px solid ${(p) => p.theme.colors.greys[9]};
        cursor: pointer;

        &:hover {
          box-shadow: ${(p) => p.theme.shadows.shallow};
          transition: box-shadow 120ms ease-in-out;
        }
      `}
    >
      {project ? (
        <Box onClick={() => history.push(`/app/project/${project.id}`)}>
          <Box
            width="100%"
            height="160px"
            borderBottom={`1px solid ${colors.greys[9]}`}
          >
            <img
              css={css`
                width: 100%;
                height: 100%;
                object-fit: contain;
              `}
              alt={project.title}
              src={
                project.thumbnailPhotoURL ||
                "https://res.cloudinary.com/isaacaderogba/image/upload/v1587228543/plain-white-background-1480544970glP_hhtvgo.jpg"
              }
            />
          </Box>
          <Box padding={`${space[5]}px ${space[5]}px`}>
            {isInput ? (
              <Input
                style={{
                  color: colors.title,
                  fontSize: `${fontSizes[3]}px`,
                  fontWeight: fontWeights[4],
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setInput(false);
                    updateProject();
                  }
                }}
                onBlur={() => {
                  setInput(false);
                  updateProject();
                }}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                autoFocus
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            ) : (
              <H5
                css={css`
                  &:hover {
                    cursor: text;
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  setInput(true);
                }}
              >
                {title}
              </H5>
            )}
            <Flex
              marginTop={`${space[2]}px`}
              justifyContent="space-between"
              alignItems="center"
            >
              <P3 color={colors.lightText}>
                {project.updatedAt && (
                  <ReactTimeAgo
                    date={new Date(parseInt(project.updatedAt))}
                    className="comm-time"
                  />
                )}
              </P3>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          setInput(true);
                        }}
                      >
                        Update project
                      </Box>
                    </Menu.Item>
                    <Menu.Item>
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject();
                        }}
                      >
                        Delete project
                      </Box>
                    </Menu.Item>
                  </Menu>
                }
              >
                <EllipsisOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{ fontSize: fontSizes[5] }}
                  rotate={90}
                />
              </Dropdown>
            </Flex>
          </Box>
        </Box>
      ) : (
        <Box></Box>
      )}
    </Card>
  );
};

export const ProjectItem = withRouter(_ProjectItem);
