// modules
import React, { useState } from "react";
import { css } from "styled-components/macro";
import gql from "graphql-tag";

// components
import { Modal, Tabs, Input, Form, Button, Alert } from "antd";

// helpers
import { useUIStore, IUIStore } from "../../~reusables/contexts/UIProvider";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";
import { User } from "../../~reusables/utils/fragments";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  LoginUserMutation,
  RegisterUserMutation
} from "../../generated/graphql";
import {
  useAuthStore,
  IAuthStore
} from "../../~reusables/contexts/AuthProvider";

enum AuthModalTabs {
  Signup = "Signup",
  Login = "Login"
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
  const resetModalState = useUIStore(state => state.resetModalState);

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
        onChange={key => setActiveTab(key as AuthModalTabs)}
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

export const registerUser = gql`
  mutation registerUser($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
      token
      user {
        ...userAttributes
      }
    }
  }
  ${User.fragments.attributes}
`;

export const RegisterFields: React.FC = () => {
  const { space } = useTheme();
  const resetModalState = useUIStore(state => state.resetModalState);
  const { setToken, setUser } = useAuthStore(state => ({
    setToken: state.setToken,
    setUser: state.setUser
  }));

  const [registerUser, { loading, error }] = useRegisterUserMutation({
    update(_, { data }) {
      if (data) {
        setUserAndToken(data.registerUser, {
          resetModalState,
          setToken,
          setUser
        });
      }
    },
    onError() {}
  });

  const onFinish = (values: any) =>
    registerUser({ variables: { registerInput: { ...values } } });

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <section
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            margin-right: ${space[4]}px;
            width: 100%;
          `}
        >
          <Form.Item
            label="First name"
            name="firstName"
            rules={[
              {
                required: true,
                type: "string",
                message: "Please input your first name"
              }
            ]}
          >
            <Input placeholder="John" />
          </Form.Item>
        </div>
        <div
          css={css`
            margin-left: ${space[4]}px;
            width: 100%;
          `}
        >
          <Form.Item
            label="Last name"
            name="lastName"
            rules={[
              {
                required: true,
                type: "string",
                message: "Please input your last name"
              }
            ]}
          >
            <Input placeholder="Doe" />
          </Form.Item>
        </div>
      </section>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, type: "email", message: "Please input your email" }
        ]}
      >
        <Input placeholder="johndoe@gmail.com" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            type: "string",
            message: "Please input your password"
          }
        ]}
      >
        <Input.Password placeholder="password" />
      </Form.Item>
      <Form.Item>
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          style={{ width: "100%", marginTop: `${space[5]}px` }}
        >
          Sign up
        </Button>
      </Form.Item>
      {error &&
        error.graphQLErrors.map(({ message }, i) => (
          <Alert closable key={i} message={message} type="error" showIcon />
        ))}
    </Form>
  );
};

export const loginUser = gql`
  mutation loginUser($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      token
      user {
        ...userAttributes
      }
    }
  }
  ${User.fragments.attributes}
`;

export const LoginFields: React.FC = () => {
  const { space } = useTheme();
  const resetModalState = useUIStore(state => state.resetModalState);
  const { setToken, setUser } = useAuthStore(state => ({
    setToken: state.setToken,
    setUser: state.setUser
  }));

  const [loginUser, { loading, error }] = useLoginUserMutation({
    update(_, { data }) {
      if (data) {
        setUserAndToken(data.loginUser, {
          resetModalState,
          setToken,
          setUser
        });
      }
    },
    onError() {}
  });

  const onFinish = (values: any) =>
    loginUser({ variables: { loginInput: { ...values } } });

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, type: "email", message: "Please input your email" }
        ]}
      >
        <Input placeholder="johndoe@gmail.com" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            type: "string",
            message: "Please input your password"
          }
        ]}
      >
        <Input.Password placeholder="password" />
      </Form.Item>
      <Form.Item>
        <Button
          loading={loading}
          type="primary"
          htmlType="submit"
          style={{ width: "100%", marginTop: `${space[5]}px` }}
        >
          Log in
        </Button>
      </Form.Item>
      {error &&
        error.graphQLErrors.map(({ message }, i) => (
          <Alert closable key={i} message={message} type="error" showIcon />
        ))}
    </Form>
  );
};

function setUserAndToken(
  authUser:
    | RegisterUserMutation["registerUser"]
    | LoginUserMutation["loginUser"],
  functions: {
    setToken: IAuthStore["setToken"];
    setUser: IAuthStore["setUser"];
    resetModalState: IUIStore["resetModalState"];
  }
) {
  const { setToken, setUser, resetModalState } = functions;
  const { token, user } = authUser;

  const workspaceId =
    user.workspaces && user.workspaces.length > 0 ? user.workspaces[0].id : "0";

  setToken(token, workspaceId);
  setUser(user);
  resetModalState();
}
