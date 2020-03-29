// modules
import React, { useState } from "react";

// components
import { Modal, Tabs } from "antd";

// helpers
import { useUI } from "../../~reusables/contexts/UIProvider";

enum AuthModalTabs {
  Signup = "Signup",
  Login = "Login"
}

export interface IAuthModal {
  type: "signup" | "login";
}

export interface IAuthModalAction {
  modal: 'auth-modal',
  props: IAuthModal
}

export const AuthModal: React.FC<IAuthModal> = ({ type }) => {
  const [isModalVisible, setModalVisibility] = useState(true);
  const { resetModalState } = useUI();
  return (
    <Modal
      visible={isModalVisible}
      closable={true}
      onCancel={() => setModalVisibility(false)}
      afterClose={resetModalState}
    >
      Create Account
    </Modal>
  );
};

export const RegisterFields: React.FC = () => {
  return <div>Register</div>;
};

export const LoginFields: React.FC = () => {
  return <div>Login</div>;
};
