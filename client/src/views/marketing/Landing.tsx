// modules
import React from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";

// components
import { MarketingHeader } from "../../components/~layout/MarketingHeader";
import { LOCAL_STORAGE_TOKEN_KEY } from "../../~reusables/constants/constants";

// helpers
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";
import { FullPageSpinner } from "../../components/atoms/FullPageSpinner";
import { StripedLanding } from "../../components/~layout/StripedLanding";

export const Landing: React.FC<RouteComponentProps> = () => {
  const isToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  const { isUserLoading, user } = useAuthStore((state) => ({
    user: state.user,
    isUserLoading: state.isUserLoading,
  }));

  if (isUserLoading && isToken) return <FullPageSpinner />;
  if (user) return <Redirect to="/app/workspace" />;

  return (
    <StripedLanding>
      <MarketingHeader />
    </StripedLanding>
  );
};
