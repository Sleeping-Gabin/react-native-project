import React, { createContext, PropsWithChildren, useContext } from "react";
import { AppTheme, lightTheme } from "../styles/themes";

const ThemeContext = createContext(lightTheme);

interface ThemeProviderProps extends PropsWithChildren {
  theme: AppTheme;
}

export default function ThemeProvider(props: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={props.theme}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export const useAppTheme = () => useContext(ThemeContext);