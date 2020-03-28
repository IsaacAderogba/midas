// modules
import React from "react";

// components
import { H3 } from "./Text";

// helpers
import { useTheme } from "../../~reusables/contexts/ThemeProvider";

export const Logo: React.FC = () => {
  const { colors } = useTheme();

  return <H3 color={colors.white}>Midas</H3>;
};
