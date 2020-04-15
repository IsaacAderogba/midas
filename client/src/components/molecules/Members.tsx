// modules
import React, { useEffect } from "react";
import { css } from "styled-components/macro";

// components
import { List, Avatar, Button } from "antd";
import { H5 } from "../atoms/Text";

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";
import { useWorkspaceUsersLazyQuery } from "../../generated/graphql";
import { useAppStore } from "../../~reusables/contexts/AppProvider";

export const Members = () => {
  const workspace = useAppStore((state) => state.workspace);
  const [getWorkspaceUsers, { data, loading }] = useWorkspaceUsersLazyQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (workspace) getWorkspaceUsers();
  }, [workspace, getWorkspaceUsers]);

  console.log(data);

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
        <Button>Add member</Button>
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
