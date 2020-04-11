// modules
import React from "react";
import { styled, useTheme } from "../../~reusables/contexts/ThemeProvider";
import { AntdIconProps,  } from "@ant-design/icons/lib/components/AntdIcon";
import { IconBaseProps } from "@ant-design/icons/lib/components/Icon";

interface ICanvasIcon {
  icon: React.ForwardRefExoticComponent<
    AntdIconProps & React.RefAttributes<HTMLSpanElement>
  >;
  onClick?: IconBaseProps['onClick'];
  style?: React.CSSProperties;
  title?: string;
}

export const CanvasIconWrapper: React.FC<ICanvasIcon> = ({
  icon: Icon,
  ...rest
}) => {
  const { colors, fontSizes } = useTheme();

  return (
    <StyledCanvasIconWrapper>
      <Icon
        style={{
          color: colors.text,
          fontSize: fontSizes[5]
        }}
        {...rest}
      />
    </StyledCanvasIconWrapper>
  );
};

const StyledCanvasIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    box-shadow: inset 0 0 100px 100px rgba(0, 0, 0, 0.1);
  }
`;
