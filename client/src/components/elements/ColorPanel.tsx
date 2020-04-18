// modules
import React from "react";

// components
import { Container, Box } from "../atoms/Layout";
import { P2 } from "../atoms/Text";

// helpers
import { useTheme } from "../../~reusables/contexts/ThemeProvider";

export const ColorPanel = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
}) => {
  const { space, colors } = useTheme();

  return (
    <Container
      flexDirection="column"
      padding={space[6]}
      borderBottom={`1px solid ${colors.greys[8]}`}
    >
      <Box marginBottom={space[3]}>
        <P2>{title}</P2>
      </Box>
      <input type="color" value={value} onChange={onChange} />
    </Container>
  );
};
