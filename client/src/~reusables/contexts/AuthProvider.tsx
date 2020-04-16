// modules
import React, { createContext, useEffect } from "react";
import { useLocalStore } from "mobx-react";
import { withRouter, RouteComponentProps } from "react-router-dom";

// helpers
import { useGetUserQuery, GetUserQuery } from "../../generated/graphql";
import { useStoreState } from "../hooks/useStoreState";

export interface IAuthStore {
  user: GetUserQuery["user"];
  isUserLoading: boolean;
  setUser: (user: GetUserQuery["user"]) => void;
}

export const AuthContext = createContext<IAuthStore>({
  user: null,
  isUserLoading: false,
  setUser: () => {},
});

export const useAuthStore = <S,>(dataSelector: (store: IAuthStore) => S) =>
  useStoreState(AuthContext, (contextData) => contextData!, dataSelector);

const AuthProvider: React.FC<RouteComponentProps> = ({ children, history }) => {
  const { data, loading } = useGetUserQuery();
  const store = useLocalStore<IAuthStore>(() => ({
    user: null,
    setUser: (user) => {
      store.user = user;
      history.push("/app/workspace");
    },
    isUserLoading: true,
  }));

  useEffect(() => {
    if (data) {
      store.user = data["user"];
      store.isUserLoading = loading;
    } else {
      store.isUserLoading = loading;
    }
  }, [loading, data, store.isUserLoading, store.user]);

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

export default withRouter(AuthProvider);
