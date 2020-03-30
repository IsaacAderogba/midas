// modules
import React, { createContext, useEffect } from "react";
import { useLocalStore } from "mobx-react";
import gql from "graphql-tag";

// helpers
import { useGetUserQuery, GetUserQuery } from "../../generated/graphql";
import { useStoreState } from "../hooks/useStoreState";
import { User } from "../utils/fragments";

export const getUser = gql`
  query getUser {
    user {
      ...userAttributes
    }
  }
  ${User.fragments.attributes}
`;

export interface IAuthStore {
  user: GetUserQuery["user"];
  isLoading: boolean;
  setUser: (user: GetUserQuery["user"]) => void;
}

export const AuthContext = createContext<IAuthStore>({
  user: null,
  isLoading: true,
  setUser: () => {}
});

export const useAuthStore = <S,>(dataSelector: (store: IAuthStore) => S) =>
  useStoreState(AuthContext, contextData => contextData!, dataSelector);

export const AuthProvider: React.FC = ({ children }) => {
  const { data, loading } = useGetUserQuery();
  const store = useLocalStore<IAuthStore>(() => ({
    user: null,
    setUser: user => {
      store.user = user;
    },
    isLoading: true
  }));

  useEffect(() => {
    if (data) {
      store.user = data["user"];
      store.isLoading = loading;
    } else {
      store.isLoading = loading;
    }
  }, [loading, data, store.isLoading, store.user]);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};
