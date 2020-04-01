// modules
import React, { createContext, useEffect } from "react";
import { useLocalStore } from "mobx-react";
import {
  GetWorkspaceAndWorkspacesQuery,
  useGetWorkspaceAndWorkspacesQuery,
  Workspace as WorkspaceType
} from "../../generated/graphql";
import gql from "graphql-tag";

// helpers
import { useStoreState } from "../hooks/useStoreState";
import { Workspace } from "../utils/fragments";
import { setLocalStorageWorkspaceKey } from "../utils/localStorage";

/**
 * Heavy duty
 * App specific information
 * Relies on the AuthProvider
 * has just workspace for now
 * on render, try to fetch up to date workspace using workspace key
 * if I can't set it as the first workspace if it's there (and update the token)
 * else set it to null
 */

export const getWorkspaceAndWorkspaces = gql`
  query getWorkspaceAndWorkspaces {
    workspace {
      ...workspaceAttributes
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
  ${Workspace.fragments.workspacesAttributes}
`;

export interface IAppStore {
  workspace: GetWorkspaceAndWorkspacesQuery["workspace"];
  workspaces: GetWorkspaceAndWorkspacesQuery["workspaces"];
  isWorkspaceLoading: boolean;
  setWorkspace: (workspaceId: WorkspaceType["id"]) => void;
}

export const AppContext = createContext<IAppStore>({
  workspace: null,
  workspaces: [],
  isWorkspaceLoading: false,
  setWorkspace: () => {}
});

export const useAppStore = <S,>(dataSelector: (store: IAppStore) => S) =>
  useStoreState(AppContext, contextData => contextData!, dataSelector);

export const AppProvider: React.FC = ({ children }) => {
  const { data, loading, refetch } = useGetWorkspaceAndWorkspacesQuery();
  const store = useLocalStore<IAppStore>(() => ({
    workspace: null,
    workspaces: [],
    isWorkspaceLoading: true,
    setWorkspace: workspaceId => {
      /**
       * for security reasons, we pass the workspace ID in the header
       * itself. So in order to chose a set up a new workspace as currently
       * selected, we just need to update the id being used in our local storage
       */
      setLocalStorageWorkspaceKey(workspaceId);
      refetch();
    }
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
