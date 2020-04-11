// modules
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import { Landing } from "./views/marketing/Landing";
import ProtectedRoute from "./components/organisms/ProtectedRoute";
import { Sidebar } from "./components/~layout/Sidebar";
import { AppProvider } from "./~reusables/contexts/AppProvider";
import { ElementsProvider } from "./~reusables/contexts/CanvasProvider";
import { Workspace } from "./views/app/Workspace";

// helpers
import { styled } from "./~reusables/contexts/ThemeProvider";
import { SIDEBAR_WIDTH } from "./~reusables/constants/dimensions";
import { Canvas } from "./views/canvas/Canvas";

export const AppRouter = () => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(routeProps) => <Landing {...routeProps} />}
      />
      <ProtectedRoute path="/app" component={ProtectedAppRouter} />
      <Redirect to="/" />
    </Switch>
  );
};

const ProtectedAppRouter: React.FC = () => {
  // provider for deciding which app?
  return (
    <AppProvider>
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
          path="/app/canvas/:uuid"
          render={(routeProps) => {
            return (
              <ElementsProvider {...routeProps}>
                <Canvas />
              </ElementsProvider>
            );
          }}
        />
        <Redirect to="/app/workspace" />
      </Switch>
    </AppProvider>
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
