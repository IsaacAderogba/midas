// modules
import React from "react";
import { css } from "styled-components/macro";

// components
import { Logo } from "../atoms/Logo";
import { H6, H5 } from "../atoms/Text";
import { PlusOutlined } from "@ant-design/icons";

// helpers
import { styled, useTheme } from "../../~reusables/contexts/ThemeProvider";
import { SIDEBAR_WIDTH } from "../../~reusables/constants/dimensions";
import { Workspace } from "../../generated/graphql";
import { useAppStore } from "../../~reusables/contexts/AppProvider";
import { Avatar } from "antd";

export const Sidebar = () => {
  const { colors, fontSizes } = useTheme();
  const workspaces = useAppStore(state => state.workspaces);
  return (
    <StyledSidebar>
      <Logo />
      <section
        css={css`
          padding: ${p => p.theme.space[8]}px 0 ${p => p.theme.space[5]}px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <H6 color={colors.greys[4]}>WORKSPACES</H6>
        <PlusOutlined
          style={{
            color: colors.greys[4],
            cursor: "pointer",
            fontSize: fontSizes[3]
          }}
        />
      </section>
      {workspaces.map(workspace => (
        <WorkspaceItem key={workspace.id} workspace={workspace} />
      ))}
    </StyledSidebar>
  );
};

const StyledSidebar = styled.aside`
  height: 100vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  background: ${p => p.theme.colors.background};
  width: ${SIDEBAR_WIDTH}px;
  padding: ${p =>
    `${p.theme.space[8]}px ${p.theme.space[7]}px 0 ${p.theme.space[7]}px`};
`;

type TWorkspaceItem = Pick<Workspace, "id" | "name" | "photoURL">;

const WorkspaceItem: React.FC<{ workspace: TWorkspaceItem }> = ({
  workspace: { id, name, photoURL }
}) => {
  const { fontSizes, colors, radii } = useTheme();
  const { workspace, setWorkspace } = useAppStore(state => ({
    workspace: state.workspace,
    setWorkspace: state.setWorkspace
  }));
  const isCurrentWorkspace = workspace?.id === id;

  return (
    <section
      onClick={() => {
        if (isCurrentWorkspace) return;
        setWorkspace(id);
      }}
      css={css`
        display: flex;
        align-items: center;
        cursor: pointer;
        background: ${isCurrentWorkspace ? colors.secondary : "auto"};
        border-radius: ${radii[2]}px;
        margin: ${p => p.theme.space[4]}px 0;
        padding: ${p => p.theme.space[3]}px ${p => p.theme.space[5]}px;
        &:hover {
          transition: 120ms ease-in-out;
          opacity: ${isCurrentWorkspace ? 0.8 : 1};
          background: ${!isCurrentWorkspace
            ? "rgba(115, 138, 165, 0.3)"
            : "auto"};
        }
      `}
    >
      <div
        css={css`
          margin-right: ${p => p.theme.space[5]}px;
        `}
      >
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
              color: colors.text
            }}
            size={fontSizes[4]}
            shape="square"
          >
            {name[0].toUpperCase()}
          </Avatar>
        )}
      </div>
      <H5 color={isCurrentWorkspace ? colors.white : colors.greys[4]}>
        {name}
      </H5>
    </section>
  );
};
