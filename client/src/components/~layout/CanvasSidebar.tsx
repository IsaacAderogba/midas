// modules
import React from "react";
import { css } from "styled-components/macro";
import { CANVAS_SIDEBAR_WIDTH, CANVAS_TOPBAR_HEIGHT } from "../../~reusables/constants/dimensions";

// styles

interface ICanvasSidebar {
  align: "left" | "right";
}

export const CanvasSidebar: React.FC<ICanvasSidebar> = ({ children, align }) => {
  return (
    <aside
      css={css`
        height: calc(100vh - ${CANVAS_TOPBAR_HEIGHT}px);
        width: ${CANVAS_SIDEBAR_WIDTH}px;
        position: absolute;
        background-color: ${p => p.theme.colors.lightBackground};
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        left: ${(p) => (align === "left" ? "0px" : "auto")};
        border-right: ${(p) =>
          align === "left" ? `1px solid ${p.theme.colors.greys[8]}` : 0};
        right: ${(p) => (align === "right" ? "0px" : "auto")};
        border-left: ${(p) =>
          align === "right" ? `1px solid ${p.theme.colors.greys[8]}` : 0};
        bottom: 0px;
      `}
    >
      {children}
    </aside>
  );
};
