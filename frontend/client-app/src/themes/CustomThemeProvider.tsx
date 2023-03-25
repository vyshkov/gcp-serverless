import React, { useState } from 'react'

import { CssBaseline, ThemeProvider } from '@mui/material';

import getTheme from './getTheme'

interface CustomThemeContextProps {
  currentTheme: string;
  setTheme: (name: string) => void;
}

export const CustomThemeContext = React.createContext<CustomThemeContextProps>(
  {
    currentTheme: 'normal',
    setTheme: () => {},
  },
)

interface CustomThemeProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const CustomThemeProvider = ({ children }: CustomThemeProviderProps) => {

  // Read current theme from localStorage or maybe from an api
  const currentTheme = localStorage.getItem('appTheme') || 'dark';

  // State to hold the selected theme name
  const [themeName, setThemeName] = useState(currentTheme);

  // Retrieve the theme object by theme name
  const theme = getTheme(themeName);

  // Wrap _setThemeName to store new theme names in localStorage
  const setTheme = (name: string) => {
    localStorage.setItem('appTheme', name);
    setThemeName(name);
  }

  const contextValue = React.useMemo(() => ({
    currentTheme: themeName,
    setTheme,
  }), [themeName])

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <CssBaseline />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  )
}

export const useCustomTheme = () => {
  const context = React.useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a Provider");
  }
  return context;
};

export default CustomThemeProvider