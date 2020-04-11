// modules
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useReducer
} from "react";
import { useLocalStore } from "mobx-react";
import { RouteComponentProps } from "react-router-dom";
import { createContext as createNewContext } from "use-context-selector";
import rough from "roughjs/bin/wrappers/rough";

// helpers
import { useStoreState } from "../hooks/useStoreState";
import { MidasElement, Maybe } from "../utils/types";
import { RoughCanvas } from "roughjs/bin/canvas";
import {
  useGetProjectLazyQuery,
  GetProjectQuery
} from "../../generated/graphql";
import { restore } from "../utils/saveAndRetrieval";

/**
 * mobx just isn't playing nice, so we're isolating it to our elements
 */
interface IElementsStore {
  elements: MidasElement[];
}
export const ElementContext = createContext<IElementsStore>({
  elements: []
});

export const useElementsStore = <S,>(
  dataSelector: (store: IElementsStore) => S
) => useStoreState(ElementContext, contextData => contextData!, dataSelector);

interface IElementsProvider extends RouteComponentProps<{ uuid: string }> {}

export const ElementsProvider: React.FC<IElementsProvider> = ({
  children,
  ...routeProps
}) => {
  let store = useLocalStore<IElementsStore>(() => ({
    get elements() {
      return [];
    }
  }));

  return (
    <ElementContext.Provider value={store}>
      <CanvasProvider {...routeProps}>{children}</CanvasProvider>
    </ElementContext.Provider>
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
}

interface ICanvasAction {
  setState: React.Dispatch<React.SetStateAction<ICanvasStore>>;
}

interface ICanvasUtils {
  canvasRef: React.MutableRefObject<Maybe<HTMLCanvasElement>>;
  rcRef: React.MutableRefObject<Maybe<RoughCanvas>>;
  contextRef: React.MutableRefObject<Maybe<CanvasRenderingContext2D>>;
  canvasUpdateListener: any;
  forceCanvasUpdate: React.DispatchWithoutAction;
  project: GetProjectQuery["project"];
}

export type ICanvasState = ICanvasStore & ICanvasAction & ICanvasUtils;

export const CanvasContext = createNewContext<ICanvasState>({
  draggingElement: null,
  resizingElement: null,
  elementType: "selection",
  exportBackground: true,
  currentItemStrokeColor: "#000000",
  currentItemBackgroundColor: "#ffffff",
  viewBackgroundColor: "#ffffff",
  setState: () => {},
  canvasRef: React.createRef(),
  rcRef: React.createRef(),
  contextRef: React.createRef(),
  canvasUpdateListener: null,
  forceCanvasUpdate: () => {},
  project: null
});

interface ICanvasProvider extends RouteComponentProps<{ uuid: string }> {}

export const CanvasProvider: React.FC<ICanvasProvider> = ({
  children,
  match
}) => {
  const [canvasUpdateListener, forceCanvasUpdate] = useReducer(x => x + 1, 0);
  const elements = useElementsStore(state => state.elements);

  const [
    getProject,
    { loading, subscribeToMore, data }
  ] = useGetProjectLazyQuery({
    fetchPolicy: "network-only",
    variables: { where: { uuid: match.params.uuid } }
  });
  const canvasRef = useRef<Maybe<HTMLCanvasElement>>(null);
  const rcRef = useRef<Maybe<RoughCanvas>>(null);
  const contextRef = useRef<Maybe<CanvasRenderingContext2D>>(null);

  const [state, setState] = useState<ICanvasStore>({
    draggingElement: null,
    resizingElement: null,
    elementType: "selection",
    exportBackground: true,
    currentItemStrokeColor: "#000000",
    currentItemBackgroundColor: "#ffffff",
    viewBackgroundColor: "#ffffff"
  });

  useEffect(() => {
    getProject();
  }, [match.params.uuid]);

  useEffect(() => {
    if (data && data.project && data.project.state) {
      const savedState = restore(
        data.project.elements,
        data.project.state,
        elements
      );
      
      if(savedState) {
        setState(savedState)
      }
    }
  }, [data]);

  useEffect(() => {
    if (canvasRef.current) {
      let tempCanvas = canvasRef.current as HTMLCanvasElement;
      rcRef.current = rough.canvas(tempCanvas);
      contextRef.current = tempCanvas.getContext("2d")!;
      contextRef.current.translate(0.5, 0.5);
    }
  }, [canvasRef]);

  return (
    <CanvasContext.Provider
      value={{
        ...state,
        canvasRef,
        rcRef,
        contextRef,
        setState,
        canvasUpdateListener,
        forceCanvasUpdate,
        project: data ? data.project : null
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
