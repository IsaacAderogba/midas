// modules
import React, { useState } from "react";
import { css } from "styled-components/macro";

// components
import { Modal, Form, Input, Button, Alert } from "antd";
import { P2 } from "../atoms/Text";

// helpers
import { useUIStore } from "../../~reusables/contexts/UIProvider";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";
import { useAppStore } from "../../~reusables/contexts/AppProvider";

export interface IInviteWorkspaceUserModalAction {
  modal: "invite-workspace-user-modal";
  props: {};
}

export const InviteWorkspaceUserModal = () => {
  const { space } = useTheme();
  const [isModalVisible, setModalVisibility] = useState(true);
  const resetModalState = useUIStore((state) => state.resetModalState);

  return (
    <Modal
      visible={isModalVisible}
      closable={true}
      centered={true}
      footer={null}
      onCancel={() => setModalVisibility(false)}
      afterClose={resetModalState}
      title="Invite members"
    ></Modal>
  );
};
