// modules
import React from "react";
import { useContextSelector } from "use-context-selector";

// components
import { CanvasSidebar } from "../../components/~layout/CanvasSidebar";
import { Box, Container } from "../../components/atoms/Layout";
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
import { styled, useTheme } from "../../~reusables/contexts/ThemeProvider";

const StyledButton = styled(Button)`
  width: 100%;
`;

export const CustomizeSidebar: React.FC = () => {
  const { space, colors } = useTheme();
  const elements = useProjectStore((state) => state.elements);
  const { forceCanvasUpdate } = useContextSelector(CanvasContext, (state) => ({
    forceCanvasUpdate: state.forceCanvasUpdate,
  }));

  return (
    <CanvasSidebar align="right">
      {someElementIsSelected(elements) && (
        <Container flexDirection="column">
          <Box padding={space[6]} borderBottom={`1px solid ${colors.greys[8]}`}>
            <StyledButton
              onClick={() =>
                deleteSelectedElements(elements, forceCanvasUpdate)
              }
            >
              Delete
            </StyledButton>
          </Box>
          <Box padding={`${space[6]}px ${space[6]}px ${space[4]}px`}>
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
          </Box>
          <Box padding={`${space[6]}px ${space[6]}px ${space[4]}px`}>
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
          </Box>
          <Box padding={`${space[6]}px ${space[6]}px ${space[4]}px`}>
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
          </Box>
          <Box padding={`${space[6]}px ${space[6]}px ${space[4]}px`}>
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
          </Box>
        </Container>
      )}
    </CanvasSidebar>
  );
};
