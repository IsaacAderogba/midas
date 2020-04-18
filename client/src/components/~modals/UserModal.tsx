// modules
import React, { useState } from "react";

// components
import { Modal, Tabs, Input, Form, Button, Alert } from "antd";
import { UploadPhoto } from "../elements/UploadPhoto";
import { Box } from "../atoms/Layout";

// helpers
import { useUIStore } from "../../~reusables/contexts/UIProvider";
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";
import { useUpdateUserMutation } from "../../generated/graphql";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";

enum UserModalTabs {
  General = "General",
  Account = "Account",
}

export interface IUserModalAction {
  modal: "user-modal";
  props: {};
}

export const UserModal: React.FC = () => {
  const [isModalVisible, setModalVisibility] = useState(true);
  const [activeTab, setActiveTab] = useState<UserModalTabs>(
    UserModalTabs.General
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
      title="Profile settings"
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as UserModalTabs)}
      >
        <Tabs.TabPane tab="General" key={UserModalTabs.General}>
          <GeneralSettings />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Account" key={UserModalTabs.Account}>
          <AccountSettings />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

const GeneralSettings: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [isUploading, setUploading] = useState(false);
  const { space } = useTheme();
  const [updateUser, { loading, error }] = useUpdateUserMutation({
    onCompleted() {
      setUploading(false);
    },
    onError() {
      setUploading(false);
    },
  });

  const onFinish = (values: any) =>
    updateUser({ variables: { userInput: { ...values } } });

  const uploadPhoto = (e: RcCustomRequestOptions) => {
    setUploading(true);
    updateUser({
      variables: { userInput: { file: e.file } },
    });
  };

  return (
    <Box>
      <UploadPhoto
        imageUrl={user?.avatarURL}
        loading={isUploading}
        onUpload={uploadPhoto}
      />
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ firstName: user?.firstName, lastName: user?.lastName }}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              type: "string",
              message: "Please input your first name",
            },
          ]}
        >
          <Input placeholder="John" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              type: "string",
              message: "Please input your last name",
            },
          ]}
        >
          <Input placeholder="Doe" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%", marginTop: `${space[5]}px` }}
          >
            Update
          </Button>
        </Form.Item>
        {error &&
          error.graphQLErrors.map(({ message }, i) => (
            <Alert closable key={i} message={message} type="error" showIcon />
          ))}
      </Form>
    </Box>
  );
};

const AccountSettings: React.FC = () => {
  return <div></div>;
};
