// modules
import React from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";

// components
import { MarketingHeader } from "../../components/~layout/MarketingHeader";
import { LOCAL_STORAGE_TOKEN_KEY } from "../../~reusables/constants/constants";

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";
import { FullPageSpinner } from "../../components/atoms/FullPageSpinner";

export const Landing: React.FC<RouteComponentProps> = () => {
  const isToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  const { isUserLoading, user } = useAuthStore(state => ({
    user: state.user,
    isUserLoading: state.isUserLoading
  }));
    
  if (isUserLoading && isToken) return <FullPageSpinner />;
  if (user) return <Redirect to="/app" />;

  return (
    <StyledLanding>
      <div className="stripes">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <MarketingHeader />
    </StyledLanding>
  );
};

const StyledLanding = styled.div`
  height: 100vh;
  max-height: 100vh;
  overflow-y: hidden;
  position: relative;

  .stripes {
    top: 0;
    grid: repeat(5, 200px) / repeat(10, 1fr);
    -webkit-transform-origin: 0;
    transform-origin: 0;
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#507eb1),
      color-stop(10%, #709dc7),
      color-stop(38%, #dde9f5),
      color-stop(48%, #eaf2f9),
      color-stop(62%, #f6f9fc)
    );
    background: linear-gradient(
      #507eb1,
      #709dc7 10%,
      #dde9f5 38%,
      #eaf2f9 48%,
      #f6f9fc 62%
    );
    filter: hue-rotate(32deg);
  }

  .stripes {
    position: absolute;
    z-index: -2;
    width: 100%;
    display: grid;
    -webkit-transform: skewY(-12deg);
    transform: skewY(-12deg);
  }

  .stripes :first-child {
    grid-column: span 3;
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      from(rgba(243, 251, 255, 0.4)),
      color-stop(20%, rgba(243, 251, 255, 0.15)),
      to(rgba(243, 251, 255, 0))
    );
    background: linear-gradient(
      100grad,
      rgba(243, 251, 255, 0.4),
      rgba(243, 251, 255, 0.15) 20%,
      rgba(243, 251, 255, 0)
    );
  }

  .stripes :nth-child(2) {
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      from(rgba(0, 119, 204, 0)),
      color-stop(40%, rgba(0, 119, 204, 0.05)),
      to(rgba(0, 119, 204, 0.35))
    );
    background: linear-gradient(
      100grad,
      rgba(0, 119, 204, 0),
      rgba(0, 119, 204, 0.05) 40%,
      rgba(0, 119, 204, 0.35)
    );
    grid-area: 3 / span 3 / auto/-1;
  }

  .stripes :nth-child(3) {
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(50%, #fff),
      to(hsla(0, 0%, 100%, 0))
    );
    background: linear-gradient(100grad, #fff 50%, hsla(0, 0%, 100%, 0));
    grid-row: 4;
    grid-column: span 5;
  }

  .stripes :nth-child(4) {
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(10%, rgba(0, 119, 204, 0)),
      to(rgba(0, 119, 204, 0.05))
    );
    background: linear-gradient(
      100grad,
      rgba(0, 119, 204, 0) 10%,
      rgba(0, 119, 204, 0.05)
    );
    grid-area: 4 / span 5 / auto/-1;
  }

  .stripes :nth-child(5) {
    grid-area: auto/1/-1/-1;
    background: -webkit-gradient(
      linear,
      left top,
      right top,
      color-stop(80%, #fff),
      to(#f5fafd)
    );
    background: linear-gradient(100grad, #fff 80%, #f5fafd);
  }
`;
