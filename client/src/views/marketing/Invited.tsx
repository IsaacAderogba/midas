// modules
import React, { useState } from "react";
import { css } from "styled-components/macro";
import { RouteComponentProps } from "react-router-dom";

// components
import { StripedLanding } from "../../components/~layout/StripedLanding";
import { H2, P2, P1 } from "../../components/atoms/Text";
import { Tabs } from "antd";
import { LoginForm, RegisterForm } from "../../components/elements/AuthForms";

// helpers
import { useTheme } from "../../~reusables/contexts/ThemeProvider";
import {
  useAcceptWorkspaceUserInviteMutation,
  WorkspaceUserRoles,
} from "../../generated/graphql";
import { setUserAndToken } from "../../components/~modals/AuthModal";
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";

interface MatchProps {
  email: string;
  role: string;
  workspaceUserId: string;
  workspaceId: string;
}

enum AuthModalTabs {
  Signup = "Signup",
  Login = "Login",
}

export interface IAuthModal {
  type: "signup" | "login";
}

export const Invited: React.FC<RouteComponentProps<MatchProps>> = ({
  match: {
    params: { email, role, workspaceId, workspaceUserId },
  },
}) => {
  let foundRole = Object.values(WorkspaceUserRoles).find(
    (value) => role === value
  ) as WorkspaceUserRoles;

  const { setUser } = useAuthStore((state) => ({
    setUser: state.setUser,
  }));

  const [
    acceptInvite,
    { loading, error },
  ] = useAcceptWorkspaceUserInviteMutation({
    update(_, { data }) {
      if (data) {
        setUserAndToken(data.acceptWorkspaceUserInvite, {
          setUser,
        });
      }
    },
    onError() {},
  });

  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<AuthModalTabs>(
    AuthModalTabs.Signup
  );

  const onFinish = (values: any) => {
    if (activeTab === AuthModalTabs.Signup) {
      acceptInvite({
        variables: {
          registerInput: { ...values },
          invitedWorkspaceUserInput: {
            email,
            role: foundRole,
            workspaceId,
            workspaceUserId,
          },
        },
      });
    } else {
      acceptInvite({
        variables: {
          loginInput: { ...values },
          invitedWorkspaceUserInput: {
            email,
            role: foundRole,
            workspaceId,
            workspaceUserId,
          },
        },
      });
    }
  };

  return (
    <StripedLanding>
      <div
        css={css`
          margin: auto 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
        `}
      >
        <H2>You have received an invite!</H2>
        <P1
          css={css`
            margin-top: ${(props) => `${props.theme.space[6]}px`};
          `}
        >
          Create an account or login to join the workspace
        </P1>
        <section
          css={css`
            margin: ${(props) => `${props.theme.space[8]}px`};
            padding: ${(props) =>
              `${props.theme.space[6]}px ${props.theme.space[6]}px`};
            background: ${(props) => props.theme.colors.white};
            border: 1px solid ${(p) => p.theme.colors.greys[9]};
            border-radius: ${(p) => p.theme.radii[2]}px;
            max-width: 600px;
            width: 100%;
          `}
        >
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as AuthModalTabs)}
          >
            <Tabs.TabPane tab="Sign up" key={AuthModalTabs.Signup}>
              <RegisterForm
                loading={loading}
                error={error}
                onFinish={onFinish}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Log in" key={AuthModalTabs.Login}>
              <LoginForm loading={loading} error={error} onFinish={onFinish} />
            </Tabs.TabPane>
          </Tabs>
        </section>
        <P2 color={colors.greys[2]}>
          This workspace will be linked to {email}.
        </P2>
      </div>
    </StripedLanding>
  );
};
