import {
  space,
  SpaceProps,
  color,
  ColorProps,
  width,
  WidthProps,
  height,
  HeightProps,
  minHeight,
  MinHeightProps,
  flex,
  FlexProps as StyledSystemFlexProps,
  order,
  OrderProps,
  alignSelf,
  AlignSelfProps,
  flexWrap,
  FlexWrapProps,
  flexDirection,
  FlexDirectionProps,
  alignItems,
  AlignItemsProps,
  justifyContent,
  JustifyContentProps,
  fontSize,
  FontSizeProps,
  fontWeight,
  FontWeightProps,
  textAlign,
  TextAlignProps,
  borders,
  BordersProps,
  borderColor,
  BorderColorProps,
  borderRadius,
  BorderRadiusProps,
  boxShadow,
  BoxShadowProps,
  opacity,
  OpacityProps,
  position,
  PositionProps,
  top,
  TopProps,
  left,
  LeftProps,
  right,
  RightProps,
  bottom,
  BottomProps,
  zIndex,
  ZIndexProps,
  maxHeight,
  maxWidth,
  MaxHeightProps,
  MaxWidthProps,
  minWidth,
  MinWidthProps,
} from "styled-system";
import { styled } from "../../~reusables/contexts/ThemeProvider";

export type BoxProps = BorderRadiusProps &
  BordersProps &
  BorderColorProps &
  SpaceProps &
  WidthProps &
  HeightProps &
  ColorProps &
  FontSizeProps &
  FontWeightProps &
  StyledSystemFlexProps &
  MinHeightProps &
  MaxHeightProps &
  MinWidthProps &
  MaxWidthProps;

export const Box = styled("div")<BoxProps>(
  borders,
  borderColor,
  borderRadius,
  space,
  width,
  height,
  color,
  fontSize,
  fontWeight,
  flex,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth
);

export type FlexProps = BoxProps &
  AlignSelfProps &
  OrderProps &
  FlexWrapProps &
  FlexDirectionProps &
  AlignItemsProps &
  JustifyContentProps;

export const Flex = styled(Box)<FlexProps>(
  {
    display: "flex",
  },
  alignSelf,
  order,
  flexWrap,
  flexDirection,
  alignItems,
  justifyContent
);

export type ContainerProps = FlexProps &
  BoxShadowProps &
  OpacityProps &
  PositionProps &
  TopProps &
  BottomProps &
  LeftProps &
  RightProps &
  ZIndexProps &
  TextAlignProps;

export const Container = styled(Flex)<ContainerProps>(
  boxShadow,
  opacity,
  position,
  top,
  bottom,
  left,
  right,
  zIndex,
  textAlign
);
