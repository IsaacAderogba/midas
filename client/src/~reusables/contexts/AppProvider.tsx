// modules
import React, { createContext } from "react";
import { useLocalStore } from "mobx-react";
import { Workspace } from "../../generated/graphql";
import gql from "graphql-tag";

// helpers
import { Maybe } from "../utils/types";
import { useStoreState } from "../hooks/useStoreState";

/**
 * Heavy duty
 * App specific information
 * Relies on the AuthProvider
 * has just workspace for now
 * on render, try to fetch up to date workspace using workspace key
 * if I can't set it as the first workspace if it's there (and update the token)
 * else set it to null
 */

export const getWorkspace = gql`
  query getWorkspace {
    workspace {
      id
      name
      url
      photoURL
      photoId
      trialStartedAt
      seats
      workspaceUsers {
        role
        user {
          id
          firstName
          lastName
          avatarURL
          email
        }
      }
    }
  }
`;

export interface IAppStore {
  workspace: Maybe<Workspace>;
  isWorkspaceLoading: boolean;
}

export const AppContext = createContext<IAppStore>({
  workspace: null,
  isWorkspaceLoading: false
});

export const useAppStore = <S,>(dataSelector: (store: IAppStore) => S) =>
  useStoreState(AppContext, contextData => contextData!, dataSelector);

export const AppProvider: React.FC = ({ children }) => {
  const store = useLocalStore<IAppStore>(() => ({
    workspace: null,
    isWorkspaceLoading: true
  }));

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};
