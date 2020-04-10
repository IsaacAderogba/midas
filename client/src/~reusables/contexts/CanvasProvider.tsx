// modules
import React, { createContext, useState } from "react";
import { useLocalStore } from "mobx-react";
import { RouteComponentProps } from "react-router-dom";
import { createContext as createNewContext } from "use-context-selector";

// helpers
import { useStoreState } from "../hooks/useStoreState";
import { MidasElement } from "../utils/types";

/**
 * mobx just isn't playing nice, so we're isolating it to our elements
 */
export const ElementContext = createContext<{ elements: MidasElement[] }>({
  elements: []
});

export const useElementsStore = <S,>(
  dataSelector: (store: { elements: MidasElement[] }) => S
) => useStoreState(ElementContext, contextData => contextData!, dataSelector);

export const ElementsProvider: React.FC = ({ children }) => {
  let store = useLocalStore<{ elements: MidasElement[] }>(() => ({
    get elements() {
      return [];
    }
  }));

  return (
    <ElementContext.Provider value={store}>{children}</ElementContext.Provider>
  );
};

export interface ICanvasStore {
  draggingElement: MidasElement | null;
  resizingElement: MidasElement | null;
  elementType: string;
  exportBackground: boolean;
  currentItemStrokeColor: string;
  currentItemBackgroundColor: string;
  viewBackgroundColor: string;
  scrollX: number;
  scrollY: number;
}

interface ICanvasAction {
  setState: React.Dispatch<React.SetStateAction<ICanvasStore>>;
}

export type ICanvasState = ICanvasStore & ICanvasAction;

export const CanvasContext = createNewContext<ICanvasState>({
  draggingElement: null,
  resizingElement: null,
  elementType: "selection",
  exportBackground: true,
  currentItemStrokeColor: "#000000",
  currentItemBackgroundColor: "#ffffff",
  viewBackgroundColor: "#ffffff",
  scrollX: 0,
  scrollY: 0,
  setState: () => {}
});

export const CanvasProvider: React.FC<RouteComponentProps> = ({ children }) => {
  const [state, setState] = useState<ICanvasStore>({
    draggingElement: null,
    resizingElement: null,
    elementType: "selection",
    exportBackground: true,
    currentItemStrokeColor: "#000000",
    currentItemBackgroundColor: "#ffffff",
    viewBackgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: 0
  });

  return (
    <CanvasContext.Provider value={{ ...state, setState }}>
      <ElementsProvider>{children}</ElementsProvider>
    </CanvasContext.Provider>
  );
};
