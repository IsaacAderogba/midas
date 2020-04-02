// modules
import React from "react";

// components
import { NavLink } from "react-router-dom";
import { H5 } from "../atoms/Text";

// helpers
import { styled, useTheme } from "../../~reusables/contexts/ThemeProvider";

export const PageNav: React.FC = props => {
  return <StyledPageNav {...props}>{props.children}</StyledPageNav>;
};

const StyledPageNav = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
`;

interface IPageNavItemProps {
  name: string;
  link: string;
  exact?: boolean;
}

export const PageNavItem: React.FC<IPageNavItemProps> = ({
  name,
  link,
  exact
}) => {
  const { colors } = useTheme();
  return (
    <StyledPageNavItem>
      <NavLink activeClassName="active" exact={exact !== false} to={link}>
        <H5 color={colors.lightText}>{name}</H5>
      </NavLink>
    </StyledPageNavItem>
  );
};

const StyledPageNavItem = styled.div`
  margin: 0;
  display: inline-block;

  .active {
    h5 {
      padding-bottom: ${p => p.theme.space[5]}px;
      border-bottom: 3px solid ${p => p.theme.colors.secondaries[6]};
      color: ${p => p.theme.colors.secondary};
    }
  }

  h5 {
    margin-bottom: 0;
    border-bottom: 3px solid transparent;
    padding-bottom: ${p => p.theme.space[5]}px;
    margin-right: ${p => p.theme.space[6]}px;
  }

  h5:hover {
    color: ${p => p.theme.colors.secondary};
    transition: 120ms ease-in-out;
    opacity: 0.8;
  }
`;
