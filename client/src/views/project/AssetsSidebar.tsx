// modules
import React from "react";
import { useContextSelector } from "use-context-selector";
import { css } from "styled-components/macro";

// components
import { CanvasSidebar } from "../../components/~layout/CanvasSidebar";

// helpers
import { CanvasContext } from "../../~reusables/contexts/CanvasProvider";
import { P2 } from "../../components/atoms/Text";

export const AssetsSidebar: React.FC = () => {
  const {
    setCanvasState,
    viewBackgroundColor,
    currentItemStrokeColor,
    currentItemBackgroundColor
  } = useContextSelector(CanvasContext, state => ({
    setCanvasState: state.setCanvasState,
    viewBackgroundColor: state.viewBackgroundColor,
    currentItemStrokeColor: state.currentItemStrokeColor,
    currentItemBackgroundColor: state.currentItemBackgroundColor
  }));

  return (
    <CanvasSidebar align="left">
      <ColorPanel
        title="Background"
        value={viewBackgroundColor}
        onChange={e => {
          setCanvasState(prevState => ({
            ...prevState,
            viewBackgroundColor: e.target.value
          }));
        }}
      />
      <ColorPanel
        title="Shape Stroke"
        value={currentItemStrokeColor}
        onChange={e => {
          setCanvasState(prevState => ({
            ...prevState,
            currentItemStrokeColor: e.target.value
          }));
        }}
      />
      <ColorPanel
        title="Shape Background"
        value={currentItemBackgroundColor}
        onChange={e => {
          setCanvasState(prevState => ({
            ...prevState,
            currentItemBackgroundColor: e.target.value
          }));
        }}
      />
    </CanvasSidebar>
  );
};

const ColorPanel = ({
  title,
  value,
  onChange
}: {
  title: string;
  value: string;
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
}) => {
  return (
    <section
      css={css`
        border-bottom: 1px solid ${p => p.theme.colors.greys[8]};
        padding: ${p => p.theme.space[6]}px;
      `}
    >
      <div>
        <P2
          css={css`
            margin-bottom: ${p => p.theme.space[3]}px;
          `}
        >
          {title}
        </P2>
      </div>
      <input type="color" value={value} onChange={onChange} />
    </section>
  );
};
