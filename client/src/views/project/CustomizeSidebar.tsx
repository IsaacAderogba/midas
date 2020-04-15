// modules
import React from "react";
import { useContextSelector } from "use-context-selector";
import { css } from "styled-components/macro";

// components
import { CanvasSidebar } from "../../components/~layout/CanvasSidebar";
import { Button } from "antd";

// helpers
import { CanvasContext } from "../../~reusables/contexts/CanvasProvider";
import {
  someElementIsSelected,
  deleteSelectedElements,
  getSelectedIndices,
} from "../../~reusables/utils/element";
import {
  moveAllLeft,
  moveOneLeft,
  moveOneRight,
  moveAllRight,
} from "../../~reusables/utils/zindex";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";
import { styled } from "../../~reusables/contexts/ThemeProvider";

const StyledButton = styled(Button)`
  width: 100%;
`;

export const CustomizeSidebar: React.FC = () => {
  const elements = useProjectStore((state) => state.elements);
  const { forceCanvasUpdate } = useContextSelector(CanvasContext, (state) => ({
    forceCanvasUpdate: state.forceCanvasUpdate,
  }));

  return (
    <CanvasSidebar align="right">
      {someElementIsSelected(elements) && (
        <div className="panelColumn">
          <div
            css={css`
              padding: ${(p) => p.theme.space[6]}px;
              border-bottom: 1px solid ${(p) => p.theme.colors.greys[8]};
            `}
          >
            <StyledButton
              onClick={() =>
                deleteSelectedElements(elements, forceCanvasUpdate)
              }
            >
              Delete
            </StyledButton>
          </div>
          <div
            css={css`
              padding: ${(p) =>
                `${p.theme.space[6]}px ${p.theme.space[6]}px ${p.theme.space[4]}px`};
            `}
          >
            <StyledButton
              onClick={() =>
                moveOneRight(
                  elements,
                  getSelectedIndices(elements),
                  forceCanvasUpdate
                )
              }
            >
              Bring forward
            </StyledButton>
          </div>
          <div
            css={css`
              padding: ${(p) =>
                `${p.theme.space[6]}px ${p.theme.space[6]}px ${p.theme.space[4]}px`};
            `}
          >
            <StyledButton
              onClick={() =>
                moveAllRight(
                  elements,
                  getSelectedIndices(elements),
                  forceCanvasUpdate
                )
              }
            >
              Bring to front
            </StyledButton>
          </div>
          <div
            css={css`
              padding: ${(p) =>
                `${p.theme.space[6]}px ${p.theme.space[6]}px ${p.theme.space[4]}px`};
            `}
          >
            <StyledButton
              onClick={() =>
                moveOneLeft(
                  elements,
                  getSelectedIndices(elements),
                  forceCanvasUpdate
                )
              }
            >
              Send backward
            </StyledButton>
          </div>
          <div
            css={css`
              padding: ${(p) =>
                `${p.theme.space[6]}px ${p.theme.space[6]}px ${p.theme.space[4]}px`};
            `}
          >
            <StyledButton
              onClick={() => {
                moveAllLeft(
                  elements,
                  getSelectedIndices(elements),
                  forceCanvasUpdate
                );
              }}
            >
              Send to back
            </StyledButton>
          </div>
        </div>
      )}
    </CanvasSidebar>
  );
};
