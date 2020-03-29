// modules
import React, { createContext, useContext, useEffect } from "react";
import { useLocalStore } from "mobx-react";
import gql from "graphql-tag";

// helpers
import { useGetUserQuery, GetUserQuery } from "../../generated/graphql";
import { LOCAL_STORAGE_TOKEN_KEY } from "../constants/constants";

export const getUser = gql`
  query getUser {
    user {
      id
      firstName
      lastName
      email
      avatarURL
      isVerified
      photoId
      workspaces {
        id
        name
        photoURL
      }
    }
  }
`;

interface IAuthState {
  user: GetUserQuery["user"];
  isLoading: boolean;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<IAuthState>({
  user: null,
  isLoading: true,
  setToken: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const { data, loading } = useGetUserQuery();
  const store = useLocalStore<IAuthState>(() => ({
    user: null,
    isLoading: true,
    setToken: (token: string) => localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token)
  }));

  useEffect(() => {
    if (data) {
      store.user = data["user"];
      store.isLoading = loading;
    }
  }, [loading, data, store.isLoading, store.user]);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};
