import { createTheme } from '@mui/material';

// Normal or default theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#cc4444',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  custom: {
    transparentLight: 'rgba(255,255,255,0.1)',
    transparentMedium: 'rgba(255,255,255,0.5)',
  },
})

export default theme