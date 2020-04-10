// modules
import React, { createContext } from "react";
import { useLocalStore } from "mobx-react";
import { RouteComponentProps } from 'react-router-dom';

// helpers
import { useStoreState } from "../hooks/useStoreState";
import { MidasElement } from "../utils/types";

export interface ICanvasStore {
  elements: MidasElement[]
}

export const CanvasContext = createContext<ICanvasStore>({
  elements: []
});

export const useCanvasStore = <S,>(dataSelector: (store: ICanvasStore) => S) =>
  useStoreState(CanvasContext, (contextData) => contextData!, dataSelector);

export const CanvasProvider: React.FC<RouteComponentProps> = ({ children }) => {
  const store = useLocalStore<ICanvasStore>(() => ({
    get elements() {
      return [];
    }
  }));

  return (
    <CanvasContext.Provider value={store}>{children}</CanvasContext.Provider>
  );
};
