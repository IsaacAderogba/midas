// modules
import React from "react";
import { useContextSelector } from "use-context-selector";

// components
import { CanvasSidebar } from "../../components/~layout/CanvasSidebar";

// helpers
import { CanvasContext } from "../../~reusables/contexts/CanvasProvider";
import {
  someElementIsSelected,
  deleteSelectedElements,
  getSelectedIndices
} from "../../~reusables/utils/element";
import {
  moveAllLeft,
  moveOneLeft,
  moveOneRight,
  moveAllRight
} from "../../~reusables/utils/zindex";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";

export const CustomizeSidebar: React.FC = () => {
  const elements = useProjectStore(state => state.elements);
  const { forceCanvasUpdate } = useContextSelector(CanvasContext, state => ({
    forceCanvasUpdate: state.forceCanvasUpdate
  }));

  return (
    <CanvasSidebar align="right">
      {someElementIsSelected(elements) && (
        <div className="panelColumn">
          <button
            onClick={() => deleteSelectedElements(elements, forceCanvasUpdate)}
          >
            Delete
          </button>
          <button
            onClick={() =>
              moveOneRight(
                elements,
                getSelectedIndices(elements),
                forceCanvasUpdate
              )
            }
          >
            Bring forward
          </button>
          <button
            onClick={() =>
              moveAllRight(
                elements,
                getSelectedIndices(elements),
                forceCanvasUpdate
              )
            }
          >
            Bring to front
          </button>
          <button
            onClick={() =>
              moveOneLeft(
                elements,
                getSelectedIndices(elements),
                forceCanvasUpdate
              )
            }
          >
            Send backward
          </button>
          <button
            onClick={() => {
              moveAllLeft(
                elements,
                getSelectedIndices(elements),
                forceCanvasUpdate
              );
            }}
          >
            Send to back
          </button>
        </div>
      )}
    </CanvasSidebar>
  );
};
