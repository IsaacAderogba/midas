// modules
import React, { createContext } from "react";
import { useLocalStore, Observer } from "mobx-react";

// components
import {
  AuthModal,
  IAuthModalAction,
} from "../../components/~modals/AuthModal";

// helpers
import { useStoreState } from "../hooks/useStoreState";
import { ICreateWorkspaceModalAction } from "../../components/~modals/CreateWorkspaceModal";
import { IInviteWorkspaceUserModalAction } from "../../components/~modals/InviteWorkspaceUserModal";
import {
  IUserModalAction,
  UserModal,
} from "../../components/~modals/UserModal";

type IModalTypes =
  | IAuthModalAction
  | ICreateWorkspaceModalAction
  | IInviteWorkspaceUserModalAction
  | IUserModalAction
  | null;

export interface IUIStore {
  modalState: IModalTypes;
  setModalState: (modal: IModalTypes) => void;
  resetModalState: () => void;
}

export const UIContext = createContext<IUIStore>({
  modalState: null,
  setModalState: () => {},
  resetModalState: () => {},
});

export const useUIStore = <S,>(dataSelector: (store: IUIStore) => S) =>
  useStoreState(UIContext, (contextData) => contextData!, dataSelector);

export const UIProvider: React.FC = ({ children }) => {
  const store = useLocalStore<IUIStore>(() => ({
    modalState: null,
    setModalState: (modal: IModalTypes) => {
      store.modalState = modal;
    },
    resetModalState: () => {
      store.modalState = null;
    },
  }));

  return (
    <UIContext.Provider value={store}>
      <Observer>
        {() => {
          const { modalState } = store;
          return (
            <>
              {/* Global level modals - not dependent on any other provider */}
              {modalState?.modal === "auth-modal" ? (
                <AuthModal {...modalState.props} />
              ) : null}
              {modalState?.modal === "user-modal" ? <UserModal /> : null}
            </>
          );
        }}
      </Observer>
      {children}
    </UIContext.Provider>
  );
};
