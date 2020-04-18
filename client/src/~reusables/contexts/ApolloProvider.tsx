// modules
import React from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { WebSocketLink } from "apollo-link-ws";
import { createUploadLink  } from 'apollo-upload-client';
import { getMainDefinition } from "apollo-utilities";
import { ApolloProvider as ApolloContextProvider } from "@apollo/react-hooks";

// helpers
import {
  getLocalStorageTokenKey,
  getAuthorizationToken,
} from "../utils/localStorage";

const wsLink = new WebSocketLink({
  uri:
    process.env.REACT_APP_GRAPHQL_SUBSCRIPTION_ENDPOINT ||
    "ws://localhost:5000/subscriptions",
  options: {
    reconnect: true,
    connectionParams: {
      authorization: getLocalStorageTokenKey() ? getAuthorizationToken() : "",
    },
  },
});

const subscriptionMiddleware = {
  applyMiddleware: async (options: any, next: any) => {
    options.authorization = getAuthorizationToken()
    next()
  },
}

// add the middleware to the web socket link via the Subscription Transport client
// @ts-ignore - https://github.com/apollographql/apollo-link/issues/197
wsLink.subscriptionClient.use([subscriptionMiddleware])

const httpLink = createUploadLink({
  uri: "/graphql",
  credentials:
    process.env.NODE_ENV === "development" ? "include" : "same-origin",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: getLocalStorageTokenKey() ? getAuthorizationToken() : "",
    },
  };
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

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
    link,
  ]),
  cache: new InMemoryCache(),
});

export const ApolloProvider: React.FC = ({ children }) => {
  return (
    <ApolloContextProvider client={client}>{children}</ApolloContextProvider>
  );
};
