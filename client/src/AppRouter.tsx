// modules
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import { Landing } from "./views/marketing/Landing";
import ProtectedRoute from "./components/organisms/ProtectedRoute";
import { Sidebar } from "./components/~layout/Sidebar";

// helpers
import { styled } from "./~reusables/contexts/ThemeProvider";
import { Workspace } from "./views/app/Workspace";
import { SIDEBAR_WIDTH } from "./~reusables/constants/dimensions";

export const AppRouter = () => {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={routeProps => <Landing {...routeProps} />}
      />
      <ProtectedRoute path="/app" component={ProtectedAppRouter} />
      <Redirect to="/" />
    </Switch>
  );
};

const ProtectedAppRouter: React.FC = () => {
  // provider for deciding which app?
  return (
    <Switch>
      <Route
        exact
        path={["/app"]}
        render={() => {
          return (
            <StyledProtectedApp>
              <Sidebar />
              <main className="main-app">
                <Route
                  exact
                  path="/app"
                  render={routeProps => <Workspace {...routeProps} />}
                />
              </main>
            </StyledProtectedApp>
          );
        }}
      />
      <Route
        exact
        path="/app/canvas/:canvasId"
        render={routeProps => {
          // TODO - investigate whether hashing makes sense for security
          // TODO - CanvasProvider
          // TODO - ProtectedCanvas
          return <div>Canvas</div>;
        }}
      />
      <Redirect to="/app" />
    </Switch>
  );
};

const StyledProtectedApp = styled.div`
  display: flex;

  .main-app {
    max-width: calc(100vw - ${SIDEBAR_WIDTH}px);
    width: calc(100vw - ${SIDEBAR_WIDTH}px);
    overflow-y: auto;
    height: 100vh;
    background: ${p => p.theme.colors.lightBackground};
  }

  @media only screen and (max-width: ${p => p.theme.breakpoints[1]}) {
    .main-app {
      max-width: 100vw;
      width: 100vw;
    }
  }
`;
