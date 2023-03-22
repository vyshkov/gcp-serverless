import { useEffect, useState, useRef } from 'react';

import {
    Box,
    Container,
    Stack,
    Typography,
} from '@mui/material';

import { useAuth } from '../auth/useLogin';
import Topbar from './Topbar';
import BasicTable from './Table';

function Layout() {
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

    console.log(">>>", isUserAllowed, "<<<" );

    return (
        <Stack sx={{ height: "100vh", display: "flex" }}>
            <Topbar />
            <Container maxWidth="lg" sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "auto", p: 0 }}>
                {token ? (
                    isUserAllowed ? (
                        <BasicTable />
                    ) : (
                        <Typography>Sorry, the user doesn't have permissions</Typography>
                    )
                ) : (
                    <Box sx={{ transform: "scale(1.5)" }} ref={refContainer} />
                )}
                
            </Container>
            { userData?.email && <Typography component="div" sx={{ textAlign: "center", backgroundColor: "rgba(0,0,0,0.2)", p: 0.5 }}> Logged in as {userData?.email} </Typography>}
        </Stack>
    );
}

export default Layout;
