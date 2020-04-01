// modules
import React from "react";

// components
import { H4 } from "./Text";

// helpers
import { useTheme } from "../../~reusables/contexts/ThemeProvider";

export const Logo: React.FC = () => {
  const { colors } = useTheme();

  return <H4 color={colors.white}>MIDAS</H4>;
};
