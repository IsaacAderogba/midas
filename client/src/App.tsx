// modules
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import { Landing } from "./views/marketing/Landing";

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
        <Redirect to="/" />
      </Switch>
    </div>
  );
};

export default App;
