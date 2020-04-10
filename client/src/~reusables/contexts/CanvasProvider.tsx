// modules
import React, { createContext } from "react";
import { useLocalStore } from "mobx-react";
import { RouteComponentProps } from "react-router-dom";

// helpers
import { useStoreState } from "../hooks/useStoreState";
import { MidasElement } from "../utils/types";
import { ICanvasState } from "../../views/canvas/Canvas";

export interface ICanvasStore {
  elements: MidasElement[];
  draggingElement: MidasElement | null;
  resizingElement: MidasElement | null;
  elementType: string;
  exportBackground: boolean;
  currentItemStrokeColor: string;
  currentItemBackgroundColor: string;
  viewBackgroundColor: string;
  scrollX: number;
  scrollY: number;
  setStore: (state: Partial<ICanvasState>) => void;
}

export const CanvasContext = createContext<ICanvasStore>({
  elements: [],
  draggingElement: null,
  resizingElement: null,
  elementType: "selection",
  exportBackground: true,
  currentItemStrokeColor: "#000000",
  currentItemBackgroundColor: "#ffffff",
  viewBackgroundColor: "#ffffff",
  scrollX: 0,
  scrollY: 0,
  setStore: () => {}
});

export const useCanvasStore = <S,>(dataSelector: (store: ICanvasStore) => S) =>
  useStoreState(CanvasContext, contextData => contextData!, dataSelector);

export const CanvasProvider: React.FC<RouteComponentProps> = ({ children }) => {
  let store = useLocalStore<ICanvasStore>(() => ({
    get elements() {
      return [];
    },
    draggingElement: null,
    resizingElement: null,
    elementType: "selection",
    exportBackground: true,
    currentItemStrokeColor: "#000000",
    currentItemBackgroundColor: "#ffffff",
    viewBackgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: 0,
    setStore: state => {
      store = {
        ...store,
        ...state
      };
      console.log(store)
      console.log(state)
    }
  }));

  return (
    <CanvasContext.Provider value={store}>{children}</CanvasContext.Provider>
  );
};
