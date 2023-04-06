import { useEffect, useRef } from 'react';

import {
    Box,
    Container,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';

import { useAuth } from '../auth/useLogin';

import { Dictionary } from './Dictionary'; 

import Topbar from './Topbar';


const Layout = () => {
    const { renderLoginButton, token, isUserAllowed, userData } = useAuth();
    const refContainer = useRef(null); 
    const theme = useTheme();

    useEffect(() => {
        if (!token) {
            setTimeout(() => {
                if (refContainer.current) {
                    renderLoginButton(refContainer.current);
                }
            }, 500)
        }
    }, [token, renderLoginButton, refContainer]);

    return (
        <Stack sx={{ display: "flex", overflow: "hidden", width: 1, height: "100vh" }}>
            <Topbar />
            <Container 
                maxWidth="lg" 
                sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "auto", p: 0 }}>
                {token && (
                    isUserAllowed ? (
                        <Dictionary />
                    ) : (
                        <Typography>Sorry, the user doesnt have permissions</Typography>
                    )
                )}
                { !token && <Box sx={{ transform: "scale(1.5)" }} ref={refContainer} /> }
            </Container>
            { userData?.email && <Typography component="div"sx={{ textAlign: "center", p: 0.5, backgroundColor: theme.custom?.transparentLight }}> Logged in as {userData?.email} </Typography>}
        </Stack>
    );
}

export default Layout;
