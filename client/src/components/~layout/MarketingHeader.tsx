// modules
import React, { useContext } from "react";

// components
import { Container } from "./Container";
import { Button } from "antd";
import { Logo } from "../atoms/Logo";

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";
import { useUI } from "../../~reusables/contexts/UIProvider";

export const MarketingHeader: React.FC = () => {
  const { setModalState } = useUI();
  return (
    <StyledMarketingHeader>
      <Logo />
      <div>
        <Button
          onClick={() =>
            setModalState({ modal: "auth-modal", props: { type: "login" } })
          }
        >
          Login
        </Button>
        <Button
          onClick={() =>
            setModalState({ modal: "auth-modal", props: { type: "signup" } })
          }
          type="primary"
        >
          Sign up
        </Button>
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
