// modules
import React, { useState } from "react";

// components
import { Container, Box } from "../atoms/Layout";
import { UploadPhoto } from "../elements/UploadPhoto";
import { P2 } from "../atoms/Text";

// helpers
import { useTheme, styled } from "../../~reusables/contexts/ThemeProvider";
import { Tabs, Form, Input, Button, Alert } from "antd";
import { useWorkspaceStore } from "../../~reusables/contexts/WorkspaceProvider";
import {
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  Maybe,
  GetWorkspacesQuery,
  GetWorkspacesDocument,
} from "../../generated/graphql";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";

enum SettingsTabs {
  General = "General",
  Account = "Account",
  Billing = "Billing",
}

export const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTabs>(
    SettingsTabs.General
  );
  const { space } = useTheme();
  return (
    <Container>
      <Tabs
        tabPosition="left"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as SettingsTabs)}
        style={{ width: "100%", marginRight: `${space[8]}px` }}
      >
        <Tabs.TabPane tab="General" key={SettingsTabs.General}>
          <SettingsGeneral />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Account" key={SettingsTabs.Account}>
          <SettingsAccount />
        </Tabs.TabPane>
      </Tabs>
    </Container>
  );
};

const SettingsGeneral: React.FC = () => {
  const workspace = useWorkspaceStore((state) => state.workspace);
  const { space } = useTheme();
  const [isUploading, setUploading] = useState(false);
  const [updateWorkspace, { loading, error }] = useUpdateWorkspaceMutation({
    onCompleted() {
      setUploading(false);
    },
    onError() {
      setUploading(false);
    },
  });

  const onFinish = (values: any) =>
    updateWorkspace({ variables: { workspaceInput: { ...values } } });

  const uploadPhoto = (e: RcCustomRequestOptions) => {
    setUploading(true);
    updateWorkspace({
      variables: { workspaceInput: { file: e.file } },
    });
  };

  return (
    <SettingsContainer>
      {workspace ? (
        <Box>
          <UploadPhoto
            imageUrl={workspace?.photoURL}
            loading={isUploading}
            onUpload={uploadPhoto}
          />
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ name: workspace?.name, url: workspace?.url }}
          >
            <Form.Item
              label="Workspace Name"
              name="name"
              rules={[
                {
                  required: true,
                  type: "string",
                  message: "Please input your workspace name",
                },
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
                  message: "Please input your workspace url",
                },
              ]}
            >
              <Input placeholder="midas" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ marginTop: `${space[5]}px` }}
              >
                Update
              </Button>
            </Form.Item>
            {error &&
              error.graphQLErrors.map(({ message }, i) => (
                <Alert
                  closable
                  key={i}
                  message={message}
                  type="error"
                  showIcon
                />
              ))}
          </Form>
        </Box>
      ) : (
        <Box />
      )}
    </SettingsContainer>
  );
};

const SettingsAccount = () => {
  const { colors, space } = useTheme();
  const removeWorkspace = useWorkspaceStore((state) => state.removeWorkspace);
  const [deleteWorkspace, { error, loading }] = useDeleteWorkspaceMutation({
    onError() {},
    update(cache, { data }) {
      if (data && data.deleteWorkspace) {
        const query: Maybe<GetWorkspacesQuery> = cache.readQuery({
          query: GetWorkspacesDocument,
        });
        if (query && query.workspaces) {
          cache.writeQuery({
            query: GetWorkspacesDocument,
            data: {
              workspaces: query.workspaces.filter(
                (w) => w.id !== data.deleteWorkspace?.id
              ),
            },
          });
        }
        removeWorkspace();
      }
    },
  });

  return (
    <SettingsContainer>
      <Box>
        <P2 marginBottom={`${space[5]}px`} color={colors.danger}>
          Danger zone
        </P2>
        <Button loading={loading} onClick={() => deleteWorkspace()} danger>
          Delete workspace
        </Button>
        {error &&
          error.graphQLErrors.map(({ message }, i) => (
            <Alert closable key={i} message={message} type="error" showIcon />
          ))}
      </Box>
    </SettingsContainer>
  );
};

const SettingsContainer = styled(Container)`
  margin: ${(props) => `0 ${props.theme.space[8]}px 0 0`};
  padding: ${(props) => `${props.theme.space[6]}px ${props.theme.space[6]}px`};
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(p) => p.theme.colors.greys[9]};
  border-radius: ${(p) => p.theme.radii[2]}px;
  flex-direction: column;
  width: 100%;
`;
