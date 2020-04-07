// modules
import React from "react";
import { styled } from "../../~reusables/contexts/ThemeProvider";

// components
import { CanvasTopbar } from "./CanvasTopbar";
import { AssetsSidebar } from "./AssetsSidebar";
import { CustomizeSidebar } from "./CustomizeSidebar";

export const CanvasWrapper: React.FC = () => {
  return (
    <StyledCanvasWrapper>
      <CanvasTopbar />
      <AssetsSidebar />
      <Canvas />
      <CustomizeSidebar />
    </StyledCanvasWrapper>
  );
};

const StyledCanvasWrapper = styled.div``;

const Canvas: React.FC = () => {
  return <div>Canvas</div>;
};
