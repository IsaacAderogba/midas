// modules
import React, { useEffect, useState } from "react";
import { css } from "styled-components/macro";

// components
import { List, Button, Empty } from "antd";
import { UserAvatar } from "../elements/UserAvatar";

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";
import { useWorkspaceUsersLazyQuery } from "../../generated/graphql";
import { useWorkspaceStore } from "../../~reusables/contexts/WorkspaceProvider";
import { useUIStore } from "../../~reusables/contexts/UIProvider";

export const Members = () => {
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
      <StyledMembers>
        <div
          css={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Button
            onClick={() =>
              setModalState({ modal: "invite-workspace-user-modal", props: {} })
            }
          >
            Add member
          </Button>
        </div>
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
      </StyledMembers>
    );
  }

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <Empty />
    </div>
  );
};

const StyledMembers = styled.div`
  margin: ${(props) => `0 ${props.theme.space[8]}px 0 0`};
  padding: ${(props) => `${props.theme.space[6]}px ${props.theme.space[6]}px`};
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(p) => p.theme.colors.greys[9]};
  border-radius: ${(p) => p.theme.radii[2]}px;
`;
