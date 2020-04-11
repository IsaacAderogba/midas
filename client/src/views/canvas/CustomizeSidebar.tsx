// modules
import React from "react";
import { useContextSelector } from "use-context-selector";

// components
import { CanvasSidebar } from "../../components/~layout/CanvasSidebar";
import { CanvasContext } from "../../~reusables/contexts/CanvasProvider";

export const CustomizeSidebar: React.FC = () => {
  const {
    setState,
    viewBackgroundColor,
    currentItemStrokeColor,
    currentItemBackgroundColor
  } = useContextSelector(CanvasContext, state => ({
    setState: state.setState,
    viewBackgroundColor: state.viewBackgroundColor,
    currentItemStrokeColor: state.currentItemStrokeColor,
    currentItemBackgroundColor: state.currentItemBackgroundColor
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
              setState(prevState => ({
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
              setState(prevState => ({
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
              setState(prevState => ({
                ...prevState,
                currentItemBackgroundColor: e.target.value
              }));
            }}
          />
          Shape Background
        </label>
      </div>
    </CanvasSidebar>
  );
};
