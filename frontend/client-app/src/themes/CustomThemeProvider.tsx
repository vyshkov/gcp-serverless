import React, { useState } from 'react'

import { CssBaseline, ThemeProvider } from '@mui/material';

import getTheme from './getTheme'

declare module '@mui/material/styles' {
  interface CustomTheme {
    custom?: {
      transparentLight?: string;
      transparentMedium?: string;
    };
  }

  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}
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

const Background = ({ colors }: { colors: string[] }) => (
  <div className="background" style={{ background: colors[0] }}>
    {colors.slice(1).map((color, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <span key={i} style={{ color }} />
    ))}
  </div>
)

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
  }), [themeName]);

  const dark = {
    bgColor: "#3b2d4e",
    color1: "#583C87",
    color2: "#666233",
    color3: "#E45A84",
  }

  const light = {
    bgColor: "#ece6dc",
    color1: "#fffbae",
    color2: "#c2ffd0",
    color3: "#cfe4ce",
  };

  const bgTheme = themeName === 'dark' ? dark : light;

  const { bgColor, color1, color2, color3 } = bgTheme;

  const darkBackgroundColors = [bgColor, color1, color1, color2, color1, color2, color2, color2, color1, color2, color1, color2, color2, color1, color1, color3, color2, color1, color3];

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <Background colors={darkBackgroundColors} />
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