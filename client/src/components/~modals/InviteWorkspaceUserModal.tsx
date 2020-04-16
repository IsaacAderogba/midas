// modules
import React, { useState } from "react";
import { css } from "styled-components/macro";

// components
import { Modal, Form, Input, Button, Alert, Radio } from "antd";
import { P2 } from "../atoms/Text";

// helpers
import { useUIStore } from "../../~reusables/contexts/UIProvider";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";
import { useWorkspaceStore } from "../../~reusables/contexts/WorkspaceProvider";
import {
  useCreateInvitedWorkspaceUserMutation,
  WorkspaceUserRoles,
} from "../../generated/graphql";

export interface IInviteWorkspaceUserModalAction {
  modal: "invite-workspace-user-modal";
  props: {};
}

export const InviteWorkspaceUserModal = () => {
  const { space } = useTheme();
  const { workspace, workspaceUser } = useWorkspaceStore((state) => ({
    workspace: state.workspace,
    workspaceUser: state.workspaceUser,
  }));
  const [role, setRole] = useState(WorkspaceUserRoles.Editor);
  const [isModalVisible, setModalVisibility] = useState(true);
  const [isCompleted, setCompleted] = useState(false);
  const resetModalState = useUIStore((state) => state.resetModalState);
  const [
    inviteWorkspaceUser,
    { loading, error },
  ] = useCreateInvitedWorkspaceUserMutation({
    onError() {},
    onCompleted() {
      setCompleted(true);
    },
  });

  const onFinish = (values: any) => {
    inviteWorkspaceUser({
      variables: {
        invitedWorkspaceUserInput: {
          email: values.email,
          role,
          workspaceId: workspace ? workspace.id : "",
          workspaceUserId: workspaceUser ? workspaceUser.id : "",
        },
      },
    });
  };

  return (
    <Modal
      visible={isModalVisible}
      closable={true}
      centered={true}
      footer={null}
      onCancel={() => setModalVisibility(false)}
      afterClose={resetModalState}
      title="Invite members"
    >
      <P2
        css={css`
          color: ${(p) => p.theme.colors.lightText};
          margin: 0 0 ${(p) => p.theme.space[6]}px 0;
        `}
      >
        Invite team members to collaborate with you.
      </P2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input your email",
            },
          ]}
        >
          <Input placeholder="johndoe@gmail.com" />
        </Form.Item>
        <Form.Item label="Member role" name="role">
          <Radio.Group defaultValue={role}>
            <Radio.Button
              value={WorkspaceUserRoles.Viewer}
              onChange={(e) => setRole(e.target.value)}
            >
              Viewer
            </Radio.Button>
            <Radio.Button
              value={WorkspaceUserRoles.Editor}
              onChange={(e) => setRole(e.target.value)}
            >
              Editor
            </Radio.Button>
            <Radio.Button
              value={WorkspaceUserRoles.Admin}
              onChange={(e) => setRole(e.target.value)}
            >
              Admin
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginTop: `${space[5]}px` }}
          >
            Send invite
          </Button>
        </Form.Item>
        {isCompleted && (
          <Alert
            closable
            afterClose={() => setCompleted(false)}
            message="Email invite succesfully sent"
            type="success"
            showIcon
          />
        )}
        {error &&
          error.graphQLErrors.map(({ message }, i) => (
            <Alert closable key={i} message={message} type="error" showIcon />
          ))}
      </Form>
    </Modal>
  );
};
