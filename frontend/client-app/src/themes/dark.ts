import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        allVariants: {
            color: 'white',
        },
    },
    custom: {
        transparentLight: 'rgba(0,0,0,0.2)',
        transparentMedium: 'rgba(0,0,0,0.5)',
    },
});

export default theme;