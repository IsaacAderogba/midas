// modules
import React from "react";
import { css } from "styled-components/macro";
import { useTheme } from "../../~reusables/contexts/ThemeProvider";
import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import { IconBaseProps } from "@ant-design/icons/lib/components/Icon";
import { CANVAS_TOPBAR_HEIGHT } from "../../~reusables/constants/dimensions";

type AntdIcon = React.ForwardRefExoticComponent<
  AntdIconProps & React.RefAttributes<HTMLSpanElement>
>;
interface ICanvasIcon {
  icon?: AntdIcon;
  svgIcon?: JSX.Element;
  checked?: boolean;
  onClick?: IconBaseProps["onClick"];
  style?: React.CSSProperties;
  title?: string;
}

export const CanvasIconWrapper: React.FC<ICanvasIcon> = ({
  icon: Icon,
  checked,
  svgIcon,
  onClick,
  ...rest
}) => {
  const { colors, fontSizes } = useTheme();

  return (
    <div
      onClick={onClick}
      css={css`
        width: 48px;
        height: ${CANVAS_TOPBAR_HEIGHT}px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: ${checked ? colors.secondary : ""};

        &:hover {
          box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
        }
      `}
      {...rest}
    >
      {Icon ? (
        <Icon
          style={{
            color: checked ? colors.white : colors.text,
            fontSize: fontSizes[4]
          }}
        />
      ) : (
        <section
          css={css`
            svg {
              height: 1em;
              fill: ${checked ? colors.white : colors.text};
            }
          `}
        >
          {svgIcon}
        </section>
      )}
    </div>
  );
};
