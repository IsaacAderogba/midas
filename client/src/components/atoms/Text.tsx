import { styled } from "../../~reusables/contexts/ThemeProvider";

interface IText {
  color?: string;
}

const Paragraph = styled("p")<IText>`
  line-height: ${p => p.theme.lineHeights.copy};
  color: ${p => (p.color ? p.color : p.theme.colors.text)};
`;

export const P1 = styled(Paragraph)`
  font-size: ${p => p.theme.fontSizes[4]}px;

  @media only screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: ${p => p.theme.fontSizes[3]}px;
  }
`;

export const P2 = styled(Paragraph)`
  font-size: ${p => p.theme.fontSizes[3]}px;

  @media only screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: ${p => p.theme.fontSizes[2]}px;
  }
`;

export const P3 = styled(Paragraph)`
  font-size: ${p => p.theme.fontSizes[2]}px;

  @media only screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: ${p => p.theme.fontSizes[1]}px;
  }
`;

export const P4 = styled(Paragraph)`
  font-size: ${p => p.theme.fontSizes[1]}px;
`;

export const H1 = styled("h1")<IText>`
  color: ${p => (p.color ? p.color : p.theme.colors.title)};
  line-height: ${p => p.theme.lineHeights.title};
  font-size: ${p => p.theme.fontSizes[7]}px;
  font-weight: ${p => p.theme.fontWeights[5]};

  @media only screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: ${p => p.theme.fontSizes[6]}px;
  }
`;

export const H2 = styled("h2")<IText>`
  color: ${p => (p.color ? p.color : p.theme.colors.title)};
  line-height: ${p => p.theme.lineHeights.title};
  font-size: ${p => p.theme.fontSizes[6]}px;
  font-weight: ${p => p.theme.fontWeights[5]};

  @media only screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: ${p => p.theme.fontSizes[5]}px;
  }
`;

export const H3 = styled("h3")<IText>`
  color: ${p => (p.color ? p.color : p.theme.colors.title)};
  line-height: ${p => p.theme.lineHeights.title};
  font-size: ${p => p.theme.fontSizes[5]}px;
  font-weight: ${p => p.theme.fontWeights[5]};

  @media only screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: ${p => p.theme.fontSizes[4]}px;
  }
`;

export const H4 = styled("h4")<IText>`
  color: ${p => (p.color ? p.color : p.theme.colors.title)};
  line-height: ${p => p.theme.lineHeights.copy};
  font-size: ${p => p.theme.fontSizes[4]}px;
  font-weight: ${p => p.theme.fontWeights[4]};

  @media only screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: ${p => p.theme.fontSizes[3]}px;
  }
`;

export const H5 = styled("h5")<IText>`
  color: ${p => (p.color ? p.color : p.theme.colors.title)};
  line-height: ${p => p.theme.lineHeights.copy};
  font-size: ${p => p.theme.fontSizes[3]}px;
  font-weight: ${p => p.theme.fontWeights[4]};

  @media only screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: ${p => p.theme.fontSizes[2]}px;
  }
`;

export const H6 = styled("h6")<IText>`
  color: ${p => (p.color ? p.color : p.theme.colors.title)};
  line-height: ${p => p.theme.lineHeights.copy};
  font-size: ${p => p.theme.fontSizes[1]}px;
  font-weight: ${p => p.theme.fontWeights[4]};
  letter-spacing: ${p => p.theme.letterSpacing.tight};
  @media only screen and (max-width: ${p => p.theme.breakpoints[0]}) {
    font-size: ${p => p.theme.fontSizes[0]}px;
  }
`;
