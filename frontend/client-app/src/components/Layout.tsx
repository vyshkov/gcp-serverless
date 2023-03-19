import { useEffect, useState, useRef } from 'react';

import { 
    Box, 
    CircularProgress, 
    Container, 
    Stack, 
    Typography, 
} from '@mui/material';

import { useAuth } from '../auth/useLogin';
import Topbar from './Topbar';

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
    const { renderLoginButton, token } = useAuth();
    const [quote, setQuote] = useState<Quote>();
    const [data, setData] = useState<JWT>();
    const [isInProgress, setInProgress] = useState(false);
    const refContainer = useRef(null);

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
        } else {
            renderLoginButton(refContainer.current);
        }
    }, [token, renderLoginButton])

    return (
        <Stack sx={{ height: "100vh", display: "flex" }}>
            <Topbar />
            <Container maxWidth="lg" sx={{ padding: 3, flex: 1, display: "flex", flexDirection: "column" }}>
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
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Box ref={refContainer} />
                    </Box>
                )}
            </Container>
        </Stack>
    );
}

export default Layout;
