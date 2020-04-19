// modules
import React from "react";
import { Switch, Route, Redirect, RouteComponentProps } from "react-router-dom";

// components
import { Landing } from "./views/marketing/Landing";
import ProtectedRoute from "./components/organisms/ProtectedRoute";
import { Sidebar } from "./components/~layout/Sidebar";
import { WorkspaceProvider } from "./~reusables/contexts/WorkspaceProvider";
import { CanvasProvider } from "./~reusables/contexts/CanvasProvider";
import { ProjectProvider } from "./~reusables/contexts/ProjectProvider";
import { Workspace } from "./views/app/Workspace";
import { Project } from "./views/project/Project";
import { Invited } from "./views/marketing/Invited";

// helpers
import { styled } from "./~reusables/contexts/ThemeProvider";
import { SIDEBAR_WIDTH } from "./~reusables/constants/dimensions";

export const AppRouter = () => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(routeProps) => <Landing {...routeProps} />}
      />
      <Route
        exact
        path="/invite/:email/:role/:workspaceUserId/:workspaceId"
        render={(routeProps) => <Invited {...routeProps} />}
      />
      <ProtectedRoute path="/app" component={ProtectedAppRouter} />
      <Redirect to="/" />
    </Switch>
  );
};

const ProtectedAppRouter: React.FC<RouteComponentProps> = ({
  children,
  ...routeProps
}) => {
  // provider for deciding which app?
  return (
    <WorkspaceProvider {...routeProps}>
      <Switch>
        <Route
          exact
          path={[
            "/app/workspace",
            "/app/workspace/wireframes",
            "/app/workspace/members",
            "/app/workspace/settings",
          ]}
          render={() => {
            return (
              <StyledProtectedApp>
                <Sidebar />
                <main className="main-app">
                  <Route
                    path="/app/workspace"
                    render={(routeProps) => <Workspace {...routeProps} />}
                  />
                </main>
              </StyledProtectedApp>
            );
          }}
        />
        <Route
          exact
          path="/app/project/:id"
          render={(routeProps) => {
            return (
              <ProjectProvider {...routeProps}>
                <CanvasProvider {...routeProps}>
                  <Project />
                </CanvasProvider>
              </ProjectProvider>
            );
          }}
        />
        <Redirect to="/app/workspace" />
      </Switch>
    </WorkspaceProvider>
  );
};

const StyledProtectedApp = styled.div`
  display: flex;

  .main-app {
    max-width: calc(100vw - ${SIDEBAR_WIDTH}px);
    width: calc(100vw - ${SIDEBAR_WIDTH}px);
    overflow-y: auto;
    height: 100vh;
    background: ${(p) => p.theme.colors.lightBackground};
  }

  @media only screen and (max-width: ${(p) => p.theme.breakpoints[1]}) {
    .main-app {
      max-width: 100vw;
      width: 100vw;
    }
  }
`;
