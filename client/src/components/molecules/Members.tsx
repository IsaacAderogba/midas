// modules
import React, { useEffect } from "react";
import { css } from "styled-components/macro";

// components
import { List, Avatar, Button } from "antd";

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";
import { useWorkspaceUsersLazyQuery } from "../../generated/graphql";
import { useWorkspaceStore } from "../../~reusables/contexts/WorkspaceProvider";
import { useUIStore } from "../../~reusables/contexts/UIProvider";

export const Members = () => {
  const workspace = useWorkspaceStore((state) => state.workspace);
  const setModalState = useUIStore((state) => state.setModalState);
  const [getWorkspaceUsers, { data, loading }] = useWorkspaceUsersLazyQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (workspace?.id) {
      console.log('exec')
      getWorkspaceUsers();
    }
  }, [workspace?.id]);

  if (loading) return <div>Loading</div>;
  if (!data?.workspaceUsers) return <div>Users don't exist</div>;

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
        dataSource={data.workspaceUsers}
        renderItem={({
          role,
          user: { firstName, lastName, email, avatarURL },
        }) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                avatarURL ? (
                  <Avatar src={avatarURL} />
                ) : (
                  <Avatar>{firstName ? firstName[0].toUpperCase() : ""}</Avatar>
                )
              }
              title={`${firstName} ${lastName}`}
              description={`${role} - ${email}`}
            />
          </List.Item>
        )}
      />
    </StyledMembers>
  );
};

const StyledMembers = styled.div`
  margin: ${(props) => `0 ${props.theme.space[8]}px 0 0`};
  padding: ${(props) => `${props.theme.space[6]}px ${props.theme.space[6]}px`};
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(p) => p.theme.colors.greys[9]};
  border-radius: ${(p) => p.theme.radii[2]}px;
`;
