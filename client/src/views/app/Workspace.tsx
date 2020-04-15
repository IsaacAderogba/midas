// modules
import React from "react";
import { css } from "styled-components/macro";
import { RouteComponentProps, Route, Switch, Redirect } from "react-router-dom";

// components
import { Button } from "antd";
import { PageNav, PageNavItem } from "../../components/elements/PageNav";
import { Projects } from "../../components/molecules/Projects";

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";
import { H2 } from "../../components/atoms/Text";
import { useAppStore } from "../../~reusables/contexts/AppProvider";
import { useCreateProjectMutation } from "../../generated/graphql";
import { Members } from "../../components/molecules/Members";
import { Settings } from "../../components/molecules/Settings";

export const Workspace: React.FC<RouteComponentProps> = () => {
  const { workspace, isWorkspaceLoading, workspaceUser } = useAppStore(
    (state) => ({
      workspace: state.workspace,
      isWorkspaceLoading: state.isWorkspaceLoading,
      workspaceUser: state.workspaceUser,
    })
  );

  const [createProject, { loading, error }] = useCreateProjectMutation({
    variables: {
      newProjectInput: {
        title: "Untitled project",
        workspaceUserId: workspaceUser ? workspaceUser.id : "",
      },
    },
    update() {},
    onError() {},
  });

  return (
    <StyledWorkspace>
      <header
        css={css`
          background: ${(p) => p.theme.colors.white};
          padding: ${(p) => `${p.theme.space[7]}px ${p.theme.space[8]}px 0`};
          border-bottom: 1px solid ${(p) => p.theme.colors.greys[9]};
        `}
      >
        {workspace ? (
          <div
            css={css`
              display: flex;
              background: ${(p) => p.theme.colors.white};
              align-items: center;
              justify-content: space-between;
            `}
          >
            <H2>{workspace.name}</H2>
            <Button
              loading={loading}
              type="primary"
              onClick={() => createProject()}
            >
              New project
            </Button>
          </div>
        ) : (
          <div
            css={css`
              background: ${(p) => p.theme.colors.white};
            `}
          >
            <H2>{isWorkspaceLoading ? "" : "No workspace selected"}</H2>
          </div>
        )}
        <PageNav
          css={css`
            margin-top: ${(p) => p.theme.space[7]}px;
          `}
        >
          <PageNavItem name="Projects" link="/app/workspace" />
          <PageNavItem name="Members" link="/app/workspace/members" />
          <PageNavItem name="Settings" link="/app/workspace/settings" />
        </PageNav>
      </header>
      <section
        css={css`
          padding: ${(p) => `${p.theme.space[7]}px 0 0 ${p.theme.space[8]}px`};
        `}
      >
        <Switch>
          <Route exact path="/app/workspace" render={() => <Projects />} />
          <Route
            exact
            path="/app/workspace/members"
            render={() => <Members />}
          />
          <Route
            exact
            path="/app/workspace/settings"
            render={() => <Settings />}
          />
          <Redirect to="/app/workspace" />
        </Switch>
      </section>
    </StyledWorkspace>
  );
};

const StyledWorkspace = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  & > section {
    height: 100%;
  }
`;
