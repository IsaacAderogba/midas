// modules
import React from "react";

// components
import { PageContainer } from "./PageContainer";
import { Button } from "antd";
import { Logo } from "../atoms/Logo";

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";
import { useUIStore } from "../../~reusables/contexts/UIProvider";

export const MarketingHeader: React.FC = () => {
  const setModalState = useUIStore(state => state.setModalState);

  return (
    <StyledMarketingHeader>
      <Logo />
      <div>
        <Button
          onClick={() =>
            setModalState({ modal: "auth-modal", props: { type: "login" } })
          }
        >
          Log in
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

const StyledMarketingHeader = styled(PageContainer)`
  padding-top: ${p => p.theme.space[7]}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div button:first-of-type {
    margin-right: ${p => p.theme.space[7]}px;
  }
`;
