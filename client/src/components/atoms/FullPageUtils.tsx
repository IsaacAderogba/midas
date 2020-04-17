// modules
import React from "react";

// components
import { Spin, Empty, Button } from "antd";
import { Link } from "react-router-dom";

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";

export const FullPageSpinner = () => (
  <StyledFullPageUtils>
    <Spin size="large" />
  </StyledFullPageUtils>
);

export const FullPageNoData = () => (
  <StyledFullPageUtils>
    <Empty />
    <Link to="/app">
      <Button type="primary">Return to workspace</Button>
    </Link>
  </StyledFullPageUtils>
);

const StyledFullPageUtils = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(p) => p.theme.colors.white};
`;
