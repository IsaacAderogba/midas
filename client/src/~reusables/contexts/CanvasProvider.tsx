// modules
import React, { useState, useEffect, useRef, useReducer } from "react";
import { RouteComponentProps } from "react-router-dom";
import { createContext as createNewContext } from "use-context-selector";
import rough from "roughjs/bin/wrappers/rough";

// helpers
import { MidasElement, Maybe } from "../utils/types";
import { RoughCanvas } from "roughjs/bin/canvas";
import { restore } from "../utils/saveAndRetrieval";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";

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
  setCanvasState: React.Dispatch<React.SetStateAction<ICanvasStore>>;
}
interface ICanvasUtils {
  canvasRef: React.MutableRefObject<Maybe<HTMLCanvasElement>>;
  rcRef: React.MutableRefObject<Maybe<RoughCanvas>>;
  contextRef: React.MutableRefObject<Maybe<CanvasRenderingContext2D>>;
  canvasUpdateListener: any;
  forceCanvasUpdate: React.DispatchWithoutAction;
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
  setCanvasState: () => {},
  canvasRef: React.createRef(),
  rcRef: React.createRef(),
  contextRef: React.createRef(),
  canvasUpdateListener: null,
  forceCanvasUpdate: () => {}
});

interface ICanvasProvider extends RouteComponentProps<{ id: string }> {}

export const CanvasProvider: React.FC<ICanvasProvider> = ({ children }) => {
  const [canvasUpdateListener, forceCanvasUpdate] = useReducer(x => x + 1, 0);
  const { elements, project } = useProjectStore(state => ({
    elements: state.elements,
    project: state.project
  }));
  const canvasRef = useRef<Maybe<HTMLCanvasElement>>(null);
  const rcRef = useRef<Maybe<RoughCanvas>>(null);
  const contextRef = useRef<Maybe<CanvasRenderingContext2D>>(null);

  const [canvasState, setCanvasState] = useState<ICanvasStore>({
    draggingElement: null,
    resizingElement: null,
    elementType: "selection",
    exportBackground: true,
    currentItemStrokeColor: "#000000",
    currentItemBackgroundColor: "#ffffff",
    viewBackgroundColor: "#ffffff"
  });

  useEffect(() => {
    if (project) {
      const savedState = restore(project.elements, elements);

      if (savedState) {
        setCanvasState(savedState);
      }
    }
  }, []);

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
        ...canvasState,
        canvasRef,
        rcRef,
        contextRef,
        setCanvasState,
        canvasUpdateListener,
        forceCanvasUpdate
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};
