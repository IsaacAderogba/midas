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

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider>
      <ThemeProvider>
        <RouterProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </RouterProvider>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();
