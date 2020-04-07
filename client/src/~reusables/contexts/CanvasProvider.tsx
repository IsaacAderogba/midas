// modules
import React, { createContext } from "react";
import { useLocalStore } from "mobx-react";
import { RouteComponentProps } from 'react-router-dom';

// helpers
import { useStoreState } from "../hooks/useStoreState";

export interface ICanvasStore {}

export const CanvasContext = createContext<ICanvasStore>({});

export const useCanvasStore = <S,>(dataSelector: (store: ICanvasStore) => S) =>
  useStoreState(CanvasContext, (contextData) => contextData!, dataSelector);

export const CanvasProvider: React.FC<RouteComponentProps> = ({ children }) => {
  const store = useLocalStore<ICanvasStore>(() => ({}));

  return (
    <CanvasContext.Provider value={store}>{children}</CanvasContext.Provider>
  );
};
