import React, { useContext } from "react";

export type themeTypes = "light" | "dark" | "dark-pink" | string;
type ContextType = {
  theme: themeTypes;
  toggleTheme: (newTheme: themeTypes) => void;
};

export const ThemeContext = React.createContext<ContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => {
  return useContext(ThemeContext);
};
