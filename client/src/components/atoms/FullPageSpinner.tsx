// modules
import React from "react";

// components
import { Spin } from "antd";

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";

export const FullPageSpinner = () => (
  <StyledFullPageSpinner>
    <Spin size="large" />
  </StyledFullPageSpinner>
);

const StyledFullPageSpinner = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${p => p.theme.colors.white};
`;
