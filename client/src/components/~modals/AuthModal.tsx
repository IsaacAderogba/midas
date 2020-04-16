// modules
import React, { useState } from "react";

// components
import { Modal, Tabs } from "antd";
import { LoginForm, RegisterForm } from "../elements/AuthForms";

// helpers
import { useUIStore, IUIStore } from "../../~reusables/contexts/UIProvider";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  LoginUserMutation,
  RegisterUserMutation,
  AcceptWorkspaceUserInviteMutation,
} from "../../generated/graphql";
import {
  useAuthStore,
  IAuthStore,
} from "../../~reusables/contexts/AuthProvider";
import {
  setLocalStorageTokenKey,
  setLocalStorageWorkspaceKey,
} from "../../~reusables/utils/localStorage";

enum AuthModalTabs {
  Signup = "Signup",
  Login = "Login",
}

export interface IAuthModal {
  type: "signup" | "login";
}

export interface IAuthModalAction {
  modal: "auth-modal";
  props: IAuthModal;
}

export const AuthModal: React.FC<IAuthModal> = ({ type }) => {
  const [isModalVisible, setModalVisibility] = useState(true);
  const [activeTab, setActiveTab] = useState<AuthModalTabs>(
    type === "signup" ? AuthModalTabs.Signup : AuthModalTabs.Login
  );
  const resetModalState = useUIStore((state) => state.resetModalState);

  return (
    <Modal
      visible={isModalVisible}
      closable={true}
      centered={true}
      footer={null}
      onCancel={() => setModalVisibility(false)}
      afterClose={resetModalState}
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as AuthModalTabs)}
      >
        <Tabs.TabPane tab="Sign up" key={AuthModalTabs.Signup}>
          <RegisterFields />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Log in" key={AuthModalTabs.Login}>
          <LoginFields />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export const RegisterFields: React.FC = () => {
  const resetModalState = useUIStore((state) => state.resetModalState);
  const { setUser } = useAuthStore((state) => ({
    setUser: state.setUser,
  }));

  const [registerUser, { loading, error }] = useRegisterUserMutation({
    update(_, { data }) {
      if (data) {
        setUserAndToken(data.registerUser, {
          resetModalState,
          setUser,
        });
      }
    },
    onError() {},
  });

  const onFinish = (values: any) =>
    registerUser({ variables: { registerInput: { ...values } } });

  return <RegisterForm loading={loading} error={error} onFinish={onFinish} />;
};

export const LoginFields: React.FC = () => {
  const resetModalState = useUIStore((state) => state.resetModalState);
  const { setUser } = useAuthStore((state) => ({
    setUser: state.setUser,
  }));

  const [loginUser, { loading, error }] = useLoginUserMutation({
    update(_, { data }) {
      if (data) {
        setUserAndToken(data.loginUser, {
          resetModalState,
          setUser,
        });
      }
    },
    onError() {},
  });

  const onFinish = (values: any) =>
    loginUser({ variables: { loginInput: { ...values } } });

  return <LoginForm loading={loading} error={error} onFinish={onFinish} />;
};

export function setUserAndToken(
  authUser:
    | RegisterUserMutation["registerUser"]
    | LoginUserMutation["loginUser"]
    | AcceptWorkspaceUserInviteMutation["acceptWorkspaceUserInvite"],
  functions: {
    setUser: IAuthStore["setUser"];
    resetModalState?: IUIStore["resetModalState"];
  }
) {
  const { setUser, resetModalState } = functions;
  const { token, user } = authUser;

  const workspaceId =
    user.workspaces && user.workspaces.length > 0 ? user.workspaces[0].id : "0";

  setLocalStorageTokenKey(token);
  setLocalStorageWorkspaceKey(workspaceId);
  setUser(user);
  if (resetModalState) resetModalState();
}
