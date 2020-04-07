// modules
import React from "react";
import { styled } from "../../~reusables/contexts/ThemeProvider";

// helpers
import { CANVAS_TOPBAR_HEIGHT } from "../../~reusables/constants/dimensions";

export const CanvasTopbar: React.FC = () => {
  return <StyledCanvasTopbar>CanvasTopbar</StyledCanvasTopbar>;
};

const StyledCanvasTopbar = styled.header`
  height: ${CANVAS_TOPBAR_HEIGHT}px;
  width: 100vw;
  position: absolute;
  background: linear-gradient(180deg, #f1f1f1 0%, #efefef 100%);
  box-shadow: 0px 5px 15px rgba(168, 183, 203, 0.07);
  display: flex;
  overflow-x: scroll;
  top: 0;
  border-bottom: 1px solid ${p => p.theme.colors.greys[8]};
`;
