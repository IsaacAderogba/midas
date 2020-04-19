import {} from "react";
import { CSSProp } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    breakpoints: string[];
    space: number[];
    fontSizes: number[];
    fontWeights: number[];
    radii: (number | string)[];
    borders: (number | string)[];
    lineHeights: {
      solid: number;
      title: number;
      copy: number;
    };
    letterSpacing: {
      normal: string;
      tracked: string;
      tight: string;
      mega: string;
    };
    fonts: {
      sansSerif: string;
    };
    shadows: {
      shallow: string;
      deep: string;
      deepDark: string;
    };
    colors: {
      white: string;
      primary: string;
      secondary: string;
      title: string;
      text: string;
      lightTitle: string;
      lightText: string;
      background: string;
      lightBackground: string;
      grey: string;
      danger: string;
      greys: string[];
      primaries: string[];
      secondaries: string[];
    };
  }
}

declare module "react" {
  interface Attributes {
    css?: CSSProp;
  }
}
