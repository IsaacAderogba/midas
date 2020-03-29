// modules
import React, { createContext, useContext } from "react";
import { useLocalStore, Observer } from "mobx-react";

// components
import {
  AuthModal,
  IAuthModalAction
} from "../../components/~modals/AuthModal";

type IModalTypes = IAuthModalAction | null;
interface IUIState {
  modalState: IModalTypes;
  setModalState: (modal: IModalTypes) => void;
  resetModalState: () => void;
}

export const UIContext = createContext<IUIState>({
  modalState: null,
  setModalState: () => {},
  resetModalState: () => {}
});

export const useUI = () => useContext(UIContext);

export const UIProvider: React.FC = ({ children }) => {
  const store = useLocalStore<IUIState>(() => ({
    modalState: null,
    setModalState: (modal: IModalTypes) => {
      store.modalState = modal;
    },
    resetModalState: () => {
      store.modalState = null;
    }
  }));

  return (
    <UIContext.Provider value={store}>
      <Observer>
        {() => {
          const { modalState } = store;
          return (
            <>
              {modalState && modalState.modal === "auth-modal" ? (
                <AuthModal {...modalState.props} />
              ) : null}
            </>
          );
        }}
      </Observer>
      {children}
    </UIContext.Provider>
  );
};
