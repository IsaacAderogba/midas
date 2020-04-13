// modules
import React from "react";
import { styled } from "../../~reusables/contexts/ThemeProvider";
import { css } from "styled-components/macro";
import { useContextSelector } from "use-context-selector";

// components
import {
  ClearOutlined,
  DownloadOutlined,
  UploadOutlined,
  MenuOutlined
} from "@ant-design/icons";
import { CanvasIconWrapper } from "../../components/atoms/CanvasIconWrapper";
import { Button } from "antd";

// helpers
import { CANVAS_TOPBAR_HEIGHT } from "../../~reusables/constants/dimensions";
import { clearSelection } from "../../~reusables/utils/element";
import {
  CanvasContext
} from "../../~reusables/contexts/CanvasProvider";
import {
  saveAsJSON,
  loadFromJSON,
  exportAsPNG
} from "../../~reusables/utils/saveAndRetrieval";
import { useProjectStore } from "../../~reusables/contexts/ProjectProvider";

// We inline font-awesome icons in order to save on js size rather than including the font awesome react library
export const SHAPES = [
  {
    icon: (
      // fa-mouse-pointer
      <svg viewBox="0 0 320 512">
        <path d="M302.189 329.126H196.105l55.831 135.993c3.889 9.428-.555 19.999-9.444 23.999l-49.165 21.427c-9.165 4-19.443-.571-23.332-9.714l-53.053-129.136-86.664 89.138C18.729 472.71 0 463.554 0 447.977V18.299C0 1.899 19.921-6.096 30.277 5.443l284.412 292.542c11.472 11.179 3.007 31.141-12.5 31.141z" />
      </svg>
    ),
    value: "selection"
  },
  {
    icon: (
      // fa-square
      <svg viewBox="0 0 448 512">
        <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z" />
      </svg>
    ),
    value: "rectangle"
  },
  {
    icon: (
      // fa-circle
      <svg viewBox="0 0 512 512">
        <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z" />
      </svg>
    ),
    value: "ellipse"
  },
  {
    icon: (
      // fa-long-arrow-alt-right
      <svg viewBox="0 0 448 512">
        <path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z" />
      </svg>
    ),
    value: "arrow"
  },
  {
    icon: (
      // fa-font
      <svg viewBox="0 0 448 512">
        <path d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z" />
      </svg>
    ),
    value: "text"
  }
];

export const CanvasTopbar: React.FC = () => {
  const elements = useProjectStore(state => state.elements);
  const {
    setCanvasState,
    elementType,
    canvasRef,
    exportBackground,
    viewBackgroundColor
  } = useContextSelector(CanvasContext, state => ({
    setCanvasState: state.setCanvasState,
    elementType: state.elementType,
    canvasRef: state.canvasRef,
    exportBackground: state.exportBackground,
    viewBackgroundColor: state.viewBackgroundColor
  }));

  const clearCanvas = () => {
    if (window.confirm("This will clear the whole canvas. Are you sure?")) {
      elements.splice(0, elements.length);
      setCanvasState(prevState => ({
        ...prevState,
        viewBackgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0
      }));
      // forceUpdate();
    }
  };

  return (
    <StyledCanvasTopbar>
      <section
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
      </section>
      <section
        css={css`
          display: flex;
        `}
      >
        {SHAPES.map(({ value, icon }) => (
          <CanvasIconWrapper
            key={value}
            svgIcon={icon}
            checked={elementType === value}
            onClick={() => {
              setCanvasState(prevState => ({
                ...prevState,
                elementType: value
              }));
              clearSelection(elements);
              document.documentElement.style.cursor =
                value === "text" ? "text" : "crosshair";
            }}
          />
        ))}
      </section>
      <section
        css={css`
          display: flex;
        `}
      >
        <Button
          type="primary"
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
        <label>
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
        </label>
      </section>
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
  border-bottom: 1px solid ${p => p.theme.colors.greys[8]};
`;
