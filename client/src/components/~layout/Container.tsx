// modules

// helpers
import { styled } from "../../~reusables/contexts/ThemeProvider";
import { MAX_PAGE_WIDTH } from "../../~reusables/constants/dimensions";

export const Container = styled.section`
  max-width: ${MAX_PAGE_WIDTH}px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.space[8]}px;

  @media only screen and (max-width: ${props => props.theme.breakpoints[1]}) {
    padding: 0 ${props => props.theme.space[6]}px;
  }
`;
