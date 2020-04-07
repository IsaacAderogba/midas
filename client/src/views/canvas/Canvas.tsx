// modules
import React from "react";
import { styled } from "../../~reusables/contexts/ThemeProvider";

// components
import { ToolsTopbar } from "./ToolsTopbar";
import { AssetsSidebar } from "./AssetsSidebar";
import { CustomizeSidebar } from "./CustomizeSidebar";

export const CanvasWrapper: React.FC = () => {
  return (
    <StyledCanvasWrapper>
      <section>
        <ToolsTopbar />
      </section>
      <section>
        <AssetsSidebar />
        <Canvas />
        <CustomizeSidebar />
      </section>
    </StyledCanvasWrapper>
  );
};

const StyledCanvasWrapper = styled.div``;

const Canvas: React.FC = () => {
  return <div>Canvas</div>;
};
