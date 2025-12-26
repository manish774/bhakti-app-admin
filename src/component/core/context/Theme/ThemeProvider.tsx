import React, { useEffect, useState } from "react";
import { ThemeContext, themeTypes } from "./ThemeContext";

const ThemeProvider = (props: any) => {
  const [theme, setTheme] = useState<themeTypes>("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = (newTheme: themeTypes) => {
    // const val = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {props?.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
