// modules
import React from "react";
import { useContextSelector } from "use-context-selector";

// components
import { CanvasSidebar } from "../../components/~layout/CanvasSidebar";
import { ColorPanel } from "../../components/elements/ColorPanel";

// helpers
import { CanvasContext } from "../../~reusables/contexts/CanvasProvider";

export const AssetsSidebar: React.FC = () => {
  const {
    setCanvasState,
    viewBackgroundColor,
    currentItemStrokeColor,
    currentItemBackgroundColor,
  } = useContextSelector(CanvasContext, (state) => ({
    setCanvasState: state.setCanvasState,
    viewBackgroundColor: state.viewBackgroundColor,
    currentItemStrokeColor: state.currentItemStrokeColor,
    currentItemBackgroundColor: state.currentItemBackgroundColor,
  }));

  return (
    <CanvasSidebar align="left">
      <ColorPanel
        title="Background"
        value={viewBackgroundColor}
        onChange={(e) => {
          setCanvasState((prevState) => ({
            ...prevState,
            viewBackgroundColor: e.target.value,
          }));
        }}
      />
      <ColorPanel
        title="Shape Stroke"
        value={currentItemStrokeColor}
        onChange={(e) => {
          setCanvasState((prevState) => ({
            ...prevState,
            currentItemStrokeColor: e.target.value,
          }));
        }}
      />
      <ColorPanel
        title="Shape Background"
        value={currentItemBackgroundColor}
        onChange={(e) => {
          setCanvasState((prevState) => ({
            ...prevState,
            currentItemBackgroundColor: e.target.value,
          }));
        }}
      />
    </CanvasSidebar>
  );
};
