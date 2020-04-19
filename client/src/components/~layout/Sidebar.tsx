// modules
import React from "react";
import { css } from "styled-components/macro";

// components
import { Logo } from "../atoms/Logo";
import { H6, H5 } from "../atoms/Text";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Menu } from "antd";
import { Flex, Container, Box } from "../atoms/Layout";

// helpers
import { styled, useTheme } from "../../~reusables/contexts/ThemeProvider";
import { SIDEBAR_WIDTH } from "../../~reusables/constants/dimensions";
import { GetWorkspacesQuery } from "../../generated/graphql";
import { useWorkspaceStore } from "../../~reusables/contexts/WorkspaceProvider";
import { useUIStore } from "../../~reusables/contexts/UIProvider";
import { useAuthStore } from "../../~reusables/contexts/AuthProvider";
import { UserAvatar } from "../elements/UserAvatar";

export const Sidebar = () => {
  const { colors, fontSizes, space } = useTheme();
  const user = useAuthStore((state) => state.user);
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const setModalState = useUIStore((state) => state.setModalState);

  return (
    <StyledSidebar>
      <Container flexDirection="column">
        <Flex justifyContent="space-between" alignItems="center">
          <Logo />
          <Dropdown
            placement="bottomLeft"
            overlay={
              <Menu>
                <Menu.Item
                  onClick={() =>
                    setModalState({
                      modal: "user-modal",
                      props: {},
                    })
                  }
                >
                  Profile settings
                </Menu.Item>
              </Menu>
            }
          >
            <Box>
              <UserAvatar user={user} />
            </Box>
          </Dropdown>
        </Flex>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          padding={`${space[8]}px 0 ${space[5]}px 0;`}
        >
          <H6 color={colors.greys[4]}>WORKSPACES</H6>
          <PlusOutlined
            onClick={() =>
              setModalState({ modal: "create-workspace-modal", props: {} })
            }
            style={{
              color: colors.greys[4],
              cursor: "pointer",
              fontSize: fontSizes[3],
            }}
          />
        </Flex>
        {workspaces.map((workspace) => (
          <WorkspaceItem key={workspace.id} workspace={workspace} />
        ))}
      </Container>
      <Flex
        margin={`${space[6]}px 0`}
        alignItems="center"
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        css={css`
          cursor: pointer;
        `}
      >
        <ArrowLeftOutlined
          style={{
            color: colors.primary,
            cursor: "pointer",
            fontSize: fontSizes[3],
            marginRight: space[5],
          }}
        />
        <H5 color={colors.greys[4]}>Log out</H5>
      </Flex>
    </StyledSidebar>
  );
};

const StyledSidebar = styled.aside`
  height: 100vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: ${(p) => p.theme.colors.background};
  width: ${SIDEBAR_WIDTH}px;
  padding: ${(p) =>
    `${p.theme.space[8]}px ${p.theme.space[7]}px 0 ${p.theme.space[7]}px`};
`;

const WorkspaceItem: React.FC<{
  workspace: GetWorkspacesQuery["workspaces"][0];
}> = ({ workspace: { id, name, photoURL } }) => {
  const { fontSizes, colors, radii, space } = useTheme();
  const { workspace, setWorkspace } = useWorkspaceStore((state) => ({
    workspace: state.workspace,
    setWorkspace: state.setWorkspace,
  }));
  const isCurrentWorkspace = workspace?.id === id;

  return (
    <Flex
      alignItems="center"
      margin={`${space[4]}px 0`}
      padding={`${space[3]}px ${space[5]}px`}
      borderRadius={`${radii[2]}px`}
      onClick={() => {
        if (isCurrentWorkspace) return;
        setWorkspace(id);
      }}
      css={css`
        cursor: pointer;
        background: ${isCurrentWorkspace ? colors.secondary : "auto"};
        &:hover {
          transition: 120ms ease-in-out;
          opacity: ${isCurrentWorkspace ? 0.8 : 1};
          background: ${!isCurrentWorkspace
            ? "rgba(115, 138, 165, 0.3)"
            : "auto"};
        }
      `}
    >
      <Box marginRight={`${space[5]}px`}>
        {photoURL ? (
          <Avatar
            size={fontSizes[4]}
            shape="square"
            src={photoURL}
            alt={`${name} icon`}
          />
        ) : (
          <Avatar
            style={{
              background: isCurrentWorkspace ? colors.white : colors.greys[4],
              color: colors.text,
            }}
            size={fontSizes[4]}
            shape="square"
          >
            {name[0].toUpperCase()}
          </Avatar>
        )}
      </Box>
      <H5 color={isCurrentWorkspace ? colors.white : colors.greys[4]}>
        {name}
      </H5>
    </Flex>
  );
};
