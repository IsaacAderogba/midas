// modules
import React from "react";

// components
import { Container } from "./Container";
import { Button } from "antd";
import { Logo } from "../atoms/Logo";

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";

export const MarketingHeader: React.FC = () => {
  return (
    <StyledMarketingHeader>
      <Logo />
      <div>
        <Button>Login</Button>
        <Button type="primary">Sign up</Button>
      </div>
    </StyledMarketingHeader>
  );
};

const StyledMarketingHeader = styled(Container)`
  padding-top: ${p => p.theme.space[7]}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div button:first-of-type {
    margin-right: ${p => p.theme.space[7]}px;
  }
`;
