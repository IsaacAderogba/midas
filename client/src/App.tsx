// modules
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import { Landing } from "./views/marketing/Landing";
import ProtectedRoute from "./components/organisms/ProtectedRoute";

// helpers

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route
          exact
          path="/"
          render={routeProps => <Landing {...routeProps} />}
        />
        <ProtectedRoute path="/app" component={ProtectedApp} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
};

const ProtectedApp: React.FC = () => {
  return <div>Protected App</div>;
};

export default App;
