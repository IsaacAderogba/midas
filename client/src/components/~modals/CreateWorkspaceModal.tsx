// modules
import React, { useState } from "react";
import { css } from "styled-components/macro";

// components
import { Modal, Form, Input, Button, Alert } from "antd";
import { P2 } from "../atoms/Text";

// helpers
import { useUIStore } from "../../~reusables/contexts/UIProvider";
import { useCreateWorkspaceMutation } from "../../generated/graphql";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";
import { useWorkspaceStore } from "../../~reusables/contexts/WorkspaceProvider";

export interface ICreateWorkspaceModalAction {
  modal: "create-workspace-modal";
  props: {};
}

export const CreateWorkspaceModal = () => {
  const { space } = useTheme();
  const createNewWorkspace = useWorkspaceStore(state => state.createWorkspace);
  const [isModalVisible, setModalVisibility] = useState(true);
  const resetModalState = useUIStore(state => state.resetModalState);
  const [createWorkspace, { loading, error }] = useCreateWorkspaceMutation({
    update(_, { data }) {
      if (data && data.createWorkspace) {
        createNewWorkspace(data.createWorkspace.id);
        setModalVisibility(false);
      }
    },
    onError() {}
  });

  const onFinish = (values: any) =>
    createWorkspace({ variables: { newWorkspaceInput: { ...values } } });

  return (
    <Modal
      visible={isModalVisible}
      closable={true}
      centered={true}
      footer={null}
      onCancel={() => setModalVisibility(false)}
      afterClose={resetModalState}
      title="Let's create a workspace"
    >
      <P2
        css={css`
          color: ${p => p.theme.colors.lightText};
          margin: 0 0 ${p => p.theme.space[6]}px 0;
        `}
      >
        Your workspace will be where you'll create and manage your wireframe
        projects, as well as manage collaborators in your team.
      </P2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Workspace Name"
          name="name"
          rules={[
            {
              required: true,
              type: "string",
              message: "Please input your workspace name"
            }
          ]}
        >
          <Input placeholder="Midas" />
        </Form.Item>
        <Form.Item
          label="Workspace URL"
          name="url"
          rules={[
            {
              required: true,
              type: "string",
              message: "Please input your workspace URL"
            }
          ]}
        >
          <Input placeholder="midas" />
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
    </Modal>
  );
};
