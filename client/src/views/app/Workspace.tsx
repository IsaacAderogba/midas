// modules
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

// components

// helpers
import { styled } from '../../~reusables/contexts/ThemeProvider';

export const Workspace: React.FC<RouteComponentProps> = () => {
  return (
    <StyledWorkspace>
      <header>Header</header>
      <section>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
        <div>hi</div>
      </section>
    </StyledWorkspace>
  )
}

const StyledWorkspace = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  & > header {
    background: ${p => p.theme.colors.white};
    padding: 50px;
    border-bottom: 1px solid ${p => p.theme.colors.greys[9]};
  }

  & > section {
    height: 100%;
  }

  div {
    height: 200px;
  }
`
