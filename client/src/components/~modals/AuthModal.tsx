// modules
import React, { useState } from "react";
import { css } from "styled-components/macro";

// components
import { Modal, Tabs, Input, Form, Button } from "antd";

// helpers
import { useUIStore } from "../../~reusables/contexts/UIProvider";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";

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

export const RegisterFields: React.FC = () => {
  const { space } = useTheme();

  return (
    <Form layout="vertical">
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
          <Form.Item label="First name">
            <Input placeholder="John" />
          </Form.Item>
        </div>
        <div
          css={css`
            margin-left: ${space[4]}px;
            width: 100%;
          `}
        >
          <Form.Item label="Last name">
            <Input placeholder="Doe" />
          </Form.Item>
        </div>
      </section>
      <Form.Item label="Email">
        <Input placeholder="johndoe@gmail.com" />
      </Form.Item>
      <Form.Item label="Password">
        <Input.Password placeholder="password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Sign up
        </Button>
      </Form.Item>
    </Form>
  );
};

export const LoginFields: React.FC = () => {
  return (
    <Form layout="vertical">
      <Form.Item label="Email">
        <Input placeholder="johndoe@gmail.com" />
      </Form.Item>
      <Form.Item label="Password">
        <Input.Password placeholder="password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};
