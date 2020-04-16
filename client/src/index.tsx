// TODO - learn about service workers and React.StrictMode
// modules
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "./~reusables/contexts/ThemeProvider";

import { ApolloProvider } from "./~reusables/contexts/ApolloProvider";
import { BrowserRouter as RouterProvider } from "react-router-dom";

// components
import { AppRouter } from "./AppRouter";

// helpers
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import AuthProvider from "./~reusables/contexts/AuthProvider";
import { UIProvider } from "./~reusables/contexts/UIProvider";

ReactDOM.render(
  <ApolloProvider>
    <RouterProvider>
      <AuthProvider>
        <ThemeProvider>
          <UIProvider>
            <AppRouter />
          </UIProvider>
        </ThemeProvider>
      </AuthProvider>
    </RouterProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.register();
