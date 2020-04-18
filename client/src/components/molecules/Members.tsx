// modules
import React, { useEffect, useState } from "react";

// components
import { List, Button, Empty } from "antd";
import { UserAvatar } from "../elements/UserAvatar";
import { Flex, Container } from "../atoms/Layout";

// helpers
import { useWorkspaceUsersLazyQuery } from "../../generated/graphql";
import { useWorkspaceStore } from "../../~reusables/contexts/WorkspaceProvider";
import { useUIStore } from "../../~reusables/contexts/UIProvider";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";

export const Members = () => {
  const { space, colors, radii } = useTheme();
  const [initLoading, setInitLoading] = useState(true);
  const workspace = useWorkspaceStore((state) => state.workspace);
  const setModalState = useUIStore((state) => state.setModalState);
  const [getWorkspaceUsers, { data, loading }] = useWorkspaceUsersLazyQuery({
    fetchPolicy: "network-only",
    onCompleted() {
      setInitLoading(false);
    },
    onError() {},
  });

  useEffect(() => {
    if (workspace?.id) {
      console.log("exec");
      getWorkspaceUsers();
    }
  }, [workspace?.id]);

  if (initLoading || loading || (data && data.workspaceUsers)) {
    return (
      <Container
        margin={`0 ${space[8]}px 0 0`}
        padding={`${space[6]}px ${space[6]}px`}
        backgroundColor={colors.white}
        border={`1px solid ${colors.greys[9]}`}
        borderRadius={`${radii[2]}px`}
        flexDirection="column"
      >
        <Flex justifyContent="flex-end">
          <Button
            onClick={() =>
              setModalState({ modal: "invite-workspace-user-modal", props: {} })
            }
          >
            Add member
          </Button>
        </Flex>
        <List
          itemLayout="horizontal"
          loading={initLoading || loading}
          dataSource={data && data.workspaceUsers ? data.workspaceUsers : []}
          renderItem={({
            role,
            user: { firstName, lastName, email, avatarURL },
          }) => (
            <List.Item>
              <List.Item.Meta
                avatar={<UserAvatar user={{ firstName, avatarURL }} />}
                title={`${firstName} ${lastName}`}
                description={`${role} - ${email}`}
              />
            </List.Item>
          )}
        />
      </Container>
    );
  }

  return (
    <Flex justifyContent="center" alignItems="center">
      <Empty />
    </Flex>
  );
};
