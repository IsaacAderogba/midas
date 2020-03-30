// modules
import React from "react";

// components

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";
import { SIDEBAR_WIDTH } from "../../~reusables/constants/dimensions";

export const Sidebar = () => {
  return <StyledSidebar>
    Sidebar
  </StyledSidebar>;
};

const StyledSidebar = styled.aside`
  height: 100vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  background: ${p => p.theme.colors.background};
  width: ${SIDEBAR_WIDTH}px;

  div {
    height: 200px;
  }
`;
