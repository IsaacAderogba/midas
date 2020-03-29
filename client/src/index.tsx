// TODO - learn about service workers and React.StrictMode
// modules
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "./~reusables/contexts/ThemeProvider";

import { ApolloProvider } from "./~reusables/contexts/ApolloProvider";
import { BrowserRouter as RouterProvider } from "react-router-dom";

// components
import App from "./App";

// helpers
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import { AuthProvider } from "./~reusables/contexts/AuthProvider";
import { UIProvider } from "./~reusables/contexts/UIProvider";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider>
      <ThemeProvider>
        <RouterProvider>
          <UIProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </UIProvider>
        </RouterProvider>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
