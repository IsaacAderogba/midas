// modules
import React, { createContext, useContext, useEffect } from "react";
import { useLocalStore } from "mobx-react";
import gql from "graphql-tag";

// helpers
import { useGetUserQuery, GetUserQuery } from "../../generated/graphql";

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

interface AuthData {
  user: GetUserQuery["user"];
  isLoading: boolean;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthData>({
  user: null,
  isLoading: true,
  setToken: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const { data, loading } = useGetUserQuery();
  const store = useLocalStore<AuthData>(() => ({
    user: null,
    isLoading: true,
    setToken: (token: string) => localStorage.setItem("token", token)
  }));

  useEffect(() => {
    if (data) {
      store.user = data["user"];
      store.isLoading = loading;
    }
  }, [loading, data, store.isLoading, store.user]);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};
