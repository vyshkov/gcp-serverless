import { useEffect, useRef } from 'react';

import {
    Box,
    Container,
    Stack,
    Typography,
} from '@mui/material';

import { useAuth } from '../auth/useLogin';

import Table from './Table'; 

import Topbar from './Topbar';

const Layout = () => {
    const { renderLoginButton, token, isUserAllowed, userData } = useAuth();
    const refContainer = useRef(null);

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
        <Stack sx={{ height: "100vh", display: "flex" }}>
            <Topbar />
            <Container maxWidth="lg" sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "auto", p: 0 }}>
                {token && (
                    isUserAllowed ? (
                        <Table />
                    ) : (
                        <Typography>Sorry, the user doesnt have permissions</Typography>
                    )
                )}
                { !token && <Box sx={{ transform: "scale(1.5)" }} ref={refContainer} /> }
            </Container>
            { userData?.email && <Typography component="div" sx={{ textAlign: "center", backgroundColor: "rgba(0,0,0,0.2)", p: 0.5 }}> Logged in as {userData?.email} </Typography>}
        </Stack>
    );
}

export default Layout;
