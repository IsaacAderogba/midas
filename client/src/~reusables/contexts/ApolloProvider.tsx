// modules
import React from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import { ApolloProvider as ApolloContextProvider } from "@apollo/react-hooks";

// helpers
import {
  LOCAL_STORAGE_WORKSPACE_KEY,
  LOCAL_STORAGE_TOKEN_KEY
} from "../constants/constants";

const authLink = setContext((_, { headers }) => {
  const workspaceId = localStorage.getItem(LOCAL_STORAGE_WORKSPACE_KEY);
  const jwt = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  let token = "";
  if (workspaceId && jwt) {
    token = `${workspaceId} ${jwt}`;
  }

  return {
    headers: {
      ...headers,
      authorization: token
    }
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    authLink,
    new HttpLink({
      uri: "/graphql",
      credentials:
        process.env.NODE_ENV === "development" ? "include" : "same-origin"
    })
  ]),
  cache: new InMemoryCache()
});

export const ApolloProvider: React.FC = ({ children }) => {
  return (
    <ApolloContextProvider client={client}>{children}</ApolloContextProvider>
  );
};
