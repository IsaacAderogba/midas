// modules
import React from "react";
import {
  Route,
  Redirect,
  RouteComponentProps,
  withRouter
} from "react-router-dom";

// components

// helpers
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";
import { FullPageSpinner } from "../atoms/FullPageUtils";

interface IProtectedRoute extends RouteComponentProps {
  component: React.FC<RouteComponentProps>;
  path: string;
  exact?: boolean;
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({
  component: Component,
  ...rest
}) => {
  const { isUserLoading, user } = useAuthStore(state => ({
    user: state.user,
    isUserLoading: state.isUserLoading
  }));

  if (isUserLoading) return <FullPageSpinner />;

  return (
    <Route
      {...rest}
      render={routeProps =>
        user ? <Component {...routeProps} /> : <Redirect to="/login" />
      }
    />
  );
};

export default withRouter(ProtectedRoute);
