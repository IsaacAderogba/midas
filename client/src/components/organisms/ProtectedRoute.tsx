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
import { FullPageSpinner } from "../atoms/FullPageSpinner";

interface IProtectedRoute extends RouteComponentProps {
  component: React.FC<RouteComponentProps>;
  path: string;
  exact?: boolean;
}

const ProtectedRoute: React.FC<IProtectedRoute> = ({
  component: Component,
  ...rest
}) => {
  const { isLoading, user } = useAuthStore(state => ({
    user: state.user,
    isLoading: state.isLoading
  }));

  if (isLoading) return <FullPageSpinner />;

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
