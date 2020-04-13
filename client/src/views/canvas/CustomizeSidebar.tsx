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
  const {
    setCanvasState,
    viewBackgroundColor,
    currentItemStrokeColor,
    currentItemBackgroundColor,
    forceCanvasUpdate
  } = useContextSelector(CanvasContext, state => ({
    setCanvasState: state.setCanvasState,
    viewBackgroundColor: state.viewBackgroundColor,
    currentItemStrokeColor: state.currentItemStrokeColor,
    currentItemBackgroundColor: state.currentItemBackgroundColor,
    forceCanvasUpdate: state.forceCanvasUpdate
  }));

  return (
    <CanvasSidebar align="right">
      <div className="panelTools"></div>
      <h4>Colors</h4>
      <div className="panelColumn">
        <label>
          <input
            type="color"
            value={viewBackgroundColor}
            onChange={e => {
              setCanvasState(prevState => ({
                ...prevState,
                viewBackgroundColor: e.target.value
              }));
            }}
          />
          Background
        </label>
        <label>
          <input
            type="color"
            value={currentItemStrokeColor}
            onChange={e => {
              setCanvasState(prevState => ({
                ...prevState,
                currentItemStrokeColor: e.target.value
              }));
            }}
          />
          Shape Stroke
        </label>
        <label>
          <input
            type="color"
            value={currentItemBackgroundColor}
            onChange={e => {
              setCanvasState(prevState => ({
                ...prevState,
                currentItemBackgroundColor: e.target.value
              }));
            }}
          />
          Shape Background
        </label>
      </div>
      {someElementIsSelected(elements) && (
        <>
          <h4>Shape options</h4>
          <div className="panelColumn">
            <button
              onClick={() =>
                deleteSelectedElements(elements, forceCanvasUpdate)
              }
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
        </>
      )}
    </CanvasSidebar>
  );
};
