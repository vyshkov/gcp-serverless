import React, { useEffect, useState } from 'react';

import { AppBar, Avatar, Box, Button, CircularProgress, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useAuth } from '../auth/useLogin';

const dev = false;

const GW_API_PATH = "https://api-gw-main-52snvftm.uc.gateway.dev";
const LOCAL_API_PATH = "http://localhost:8080"

const API_PATH = dev ? LOCAL_API_PATH : GW_API_PATH;

type JWT = {
    header: {
        alg: string;
        typ: string;
    };
    payload: {
        iss: string;
        sub: string;
        aud: string;
        exp: number;
        iat: number;
        email: string;
        email_verified: boolean;
        at_hash: string;
        name: string;
        picture: string;
        given_name: string;
        family_name: string;
        locale: string;
        alg: string;
        kid: string;
    };
}

type Quote = {
    quote: string;
    author: string;
}

function Layout() {
    const { login, userData, token } = useAuth();
    const [quote, setQuote] = useState<Quote>();
    const [data, setData] = useState<JWT>();
    const [isInProgress, setInProgress] = useState(false);

    useEffect(() => {
        if (token) {
            setInProgress(true);
            Promise.all([
                fetch(`${API_PATH}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                .then(resp => resp.json())
                .then(resp => setData(resp || {})),
                
                fetch(`${API_PATH}/hello`)
                .then(resp => resp.json())
                .then(resp => setQuote(resp || {}))

            ]).finally(() => setInProgress(false));
        }
    }, [token])

    return (
        <Box>
            <AppBar position='static' sx={{ background: "rgba(0,0,0,0.5)" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>MyDictionary</Typography>
                    {token ? (
                        <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                            <Typography variant="h6" sx={{ paddingRight: 2 }}>{userData?.given_name}</Typography>
                            <IconButton sx={{ p: 0 }}>
                                <Avatar alt={userData?.given_name} src={userData?.picture} />
                            </IconButton>
                        </Stack>
                    ) : (
                        <Button onClick={login} variant="contained" color="secondary">Login</Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ padding: 3 }}>
                {token ? (
                    <>
                        {isInProgress ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <Typography variant="h6">Secured API response: {data?.payload?.given_name || "-"} {data?.payload?.family_name || "-"}</Typography>
                                <Typography>{quote?.quote} ({quote?.author})</Typography>
                            </>
                        )}
                    </>
                ) : (
                    <Typography variant="h6">Please login to access secured API</Typography>
                )}
            </Container>
        </Box>
    );
}

export default Layout;
