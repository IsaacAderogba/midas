// modules
import React from "react";
import { styled, useTheme } from "../../~reusables/contexts/ThemeProvider";
import { css } from "styled-components/macro";
import { useContextSelector } from "use-context-selector";

// components
import {
  ClearOutlined,
  DownloadOutlined,
  UploadOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { CanvasIconWrapper } from "../../components/atoms/CanvasIconWrapper";
import { Button, Avatar, Tooltip } from "antd";
import { Container } from "../../components/atoms/Layout";
import { CanvasShapes } from "../../components/elements/CanvasShapes";

// helpers
import { CANVAS_TOPBAR_HEIGHT } from "../../~reusables/constants/dimensions";
import { clearSelection } from "../../~reusables/utils/element";
import { CanvasContext } from "../../~reusables/contexts/CanvasProvider";
import {
  saveAsJSON,
  loadFromJSON,
  exportAsPNG,
} from "../../~reusables/utils/saveAndRetrieval";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";
import { UserAvatar } from "../../components/elements/UserAvatar";

export const CanvasTopbar: React.FC = () => {
  const { space } = useTheme();
  const { elements, collaborators } = useProjectStore((state) => ({
    elements: state.elements,
    collaborators: state.collaborators,
  }));
  const {
    setCanvasState,
    elementType,
    canvasRef,
    exportBackground,
    viewBackgroundColor,
  } = useContextSelector(CanvasContext, (state) => ({
    setCanvasState: state.setCanvasState,
    elementType: state.elementType,
    canvasRef: state.canvasRef,
    exportBackground: state.exportBackground,
    viewBackgroundColor: state.viewBackgroundColor,
  }));

  const clearCanvas = () => {
    if (window.confirm("This will clear the whole canvas. Are you sure?")) {
      elements.splice(0, elements.length);
      setCanvasState((prevState) => ({
        ...prevState,
        viewBackgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
      }));
    }
  };

  return (
    <StyledCanvasTopbar>
      <Container
        css={css`
          display: flex;
        `}
      >
        <CanvasIconWrapper icon={MenuOutlined} title="Menu" />
        <CanvasIconWrapper
          icon={ClearOutlined}
          title="Clear the canvas & reset background color"
          onClick={clearCanvas}
        />
        <CanvasIconWrapper
          icon={UploadOutlined}
          title="Upload"
          onClick={async () => await loadFromJSON(elements)}
        />
        <CanvasIconWrapper
          icon={DownloadOutlined}
          title="Download"
          onClick={() => saveAsJSON(elements)}
        />
      </Container>
      <Container
        css={css`
          display: flex;
        `}
      >
        {CanvasShapes.map(({ value, icon }) => (
          <CanvasIconWrapper
            key={value}
            svgIcon={icon}
            checked={elementType === value}
            onClick={() => {
              setCanvasState((prevState) => ({
                ...prevState,
                elementType: value,
              }));
              clearSelection(elements);
              document.documentElement.style.cursor =
                value === "text" ? "text" : "crosshair";
            }}
          />
        ))}
      </Container>
      <Container
        css={css`
          display: flex;
        `}
      >
        {collaborators.map(
          ({ userId, avatarURL, firstName, lastName, color }) => {
            return (
              <Tooltip
                key={userId}
                placement="bottom"
                title={`${firstName} ${lastName}`}
              >
                <UserAvatar
                  style={
                    avatarURL
                      ? {
                          marginRight: space[6],
                          border: `2px solid ${color}`,
                        }
                      : {
                          marginRight: space[6],
                          background: `${color}`,
                          fontWeight: "bold",
                        }
                  }
                  user={{
                    firstName: firstName ? firstName : "Anon",
                    avatarURL,
                  }}
                />
              </Tooltip>
            );
          }
        )}
        <Button
          type="primary"
          style={{ marginRight: space[6] }}
          onClick={() => {
            if (canvasRef.current) {
              exportAsPNG(
                { exportBackground, viewBackgroundColor },
                canvasRef.current,
                elements
              );
            }
          }}
        >
          Export to PNG
        </Button>
        {/* <label>
          <input
            type="checkbox"
            checked={exportBackground}
            onChange={e => {
              setCanvasState(prevState => ({
                ...prevState,
                exportBackground: e.target.checked
              }));
            }}
          />
          background
        </label> */}
      </Container>
    </StyledCanvasTopbar>
  );
};

const StyledCanvasTopbar = styled.header`
  height: ${CANVAS_TOPBAR_HEIGHT}px;
  width: 100vw;
  position: absolute;
  background: linear-gradient(180deg, #f1f1f1 0%, #efefef 100%);
  box-shadow: 0px 5px 15px rgba(168, 183, 203, 0.07);
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: scroll;
  top: 0;
  border-bottom: 1px solid ${(p) => p.theme.colors.greys[8]};
`;
