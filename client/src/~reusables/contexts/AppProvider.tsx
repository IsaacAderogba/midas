// modules
import React, { createContext, useEffect } from "react";
import { useLocalStore } from "mobx-react";
import {
  GetWorkspace_WorkspacesQuery,
  useGetWorkspace_WorkspacesQuery
} from "../../generated/graphql";
import gql from "graphql-tag";

// helpers
import { useStoreState } from "../hooks/useStoreState";
import { Workspace } from "../utils/fragments";

/**
 * Heavy duty
 * App specific information
 * Relies on the AuthProvider
 * has just workspace for now
 * on render, try to fetch up to date workspace using workspace key
 * if I can't set it as the first workspace if it's there (and update the token)
 * else set it to null
 */

export const getWorkspace_Workspaces = gql`
  query getWorkspace_Workspaces {
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
    workspaces {
      ...workspacesAttributes
    }
  }
  ${Workspace.fragments.attributes}
`;

export interface IAppStore {
  workspace: GetWorkspace_WorkspacesQuery["workspace"];
  workspaces: GetWorkspace_WorkspacesQuery["workspaces"];
  isWorkspaceLoading: boolean;
}

export const AppContext = createContext<IAppStore>({
  workspace: null,
  workspaces: [],
  isWorkspaceLoading: false
});

export const useAppStore = <S,>(dataSelector: (store: IAppStore) => S) =>
  useStoreState(AppContext, contextData => contextData!, dataSelector);

export const AppProvider: React.FC = ({ children }) => {
  const { data, loading } = useGetWorkspace_WorkspacesQuery();
  const store = useLocalStore<IAppStore>(() => ({
    workspace: null,
    workspaces: [],
    isWorkspaceLoading: true
  }));

  useEffect(() => {
    if (data) {
      store.workspace = data["workspace"];
      store.workspaces = data["workspaces"];
      store.isWorkspaceLoading = loading;
    } else {
      store.isWorkspaceLoading = loading;
    }
  }, [
    loading,
    data,
    store.isWorkspaceLoading,
    store.workspace,
    store.workspaces
  ]);

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};
