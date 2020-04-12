// modules
import React, { createContext, useEffect } from "react";
import { useLocalStore } from "mobx-react";
import {
  GetWorkspaceQuery,
  useGetWorkspaceQuery,
  Workspace as WorkspaceType,
  useGetWorkspacesQuery,
  GetWorkspacesQuery
} from "../../generated/graphql";

// helpers
import { useStoreState } from "../hooks/useStoreState";
import { setLocalStorageWorkspaceKey } from "../utils/localStorage";
import { useUIStore } from "./UIProvider";
import { CreateWorkspaceModal } from "../../components/~modals/CreateWorkspaceModal";
import { useAuthStore } from "./AuthProvider";

/**
 * Heavy duty
 * App specific information
 * Relies on the AuthProvider
 * has just workspace for now
 * on render, try to fetch up to date workspace using workspace key
 * if I can't set it as the first workspace if it's there (and update the token)
 * else set it to null
 */

export interface IAppStore {
  workspace: GetWorkspaceQuery["workspace"];
  workspaceUser: GetWorkspaceQuery["workspaceUser"];
  workspaces: GetWorkspacesQuery["workspaces"];
  isWorkspaceLoading: boolean;
  setWorkspace: (workspaceId: WorkspaceType["id"]) => void;
  createWorkspace: (createdWorkspaceId: WorkspaceType["id"]) => void;
}

export const AppContext = createContext<IAppStore>({
  workspace: null,
  workspaceUser: null,
  workspaces: [],
  isWorkspaceLoading: false,
  setWorkspace: () => {},
  createWorkspace: () => {}
});

export const useAppStore = <S,>(dataSelector: (store: IAppStore) => S) =>
  useStoreState(AppContext, contextData => contextData!, dataSelector);

export const AppProvider: React.FC = ({ children }) => {
  const userId = useAuthStore(state => state.user?.id);
  const modalState = useUIStore(state => state.modalState);
  const workspace = useGetWorkspaceQuery({
    variables: { where: { userId: userId } }
  });
  const workspaces = useGetWorkspacesQuery();
  const store = useLocalStore<IAppStore>(() => ({
    workspace: null,
    workspaceUser: null,
    workspaces: [],
    isWorkspaceLoading: true,
    setWorkspace: workspaceId => {
      /**
       * for security reasons, we pass the workspace ID in the auth header
       * itself. So in order to chose a set up a new workspace as currently
       * selected, we just need to update the id being used in our local storage
       */
      setLocalStorageWorkspaceKey(workspaceId);
      workspace.refetch();
    },
    createWorkspace: createdWorkspaceId => {
      workspaces.refetch();
      store.setWorkspace(createdWorkspaceId);
    }
  }));

  useEffect(() => {
    if (workspace.data) {
      store.workspace = workspace.data["workspace"];
      store.workspaceUser = workspace.data["workspaceUser"];
      store.isWorkspaceLoading = workspace.loading;
    } else {
      store.isWorkspaceLoading = workspace.loading;
    }
  }, [
    workspace.loading,
    workspace.data,
    store.isWorkspaceLoading,
    store.workspace
  ]);

  useEffect(() => {
    if (workspaces.data) {
      store.workspaces = workspaces.data["workspaces"];
    }
  }, [store.workspaces, workspaces.loading, workspaces.data]);

  return (
    <AppContext.Provider value={store}>
      {modalState && modalState.modal === "create-workspace-modal" ? (
        <CreateWorkspaceModal />
      ) : null}
      {children}
    </AppContext.Provider>
  );
};
