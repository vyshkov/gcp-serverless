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

type UserInfo = {
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    roles?: string[];
    error?: string;
}

function Layout() {
    const { renderLoginButton, token } = useAuth();
    const [anonimous, setAnonimous] = useState(false);
    const [data, setData] = useState<UserInfo>();
    const refContainer = useRef(null);

    useEffect(() => {
        if (token) {
            fetch(`${API_PATH}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(resp => {
                    console.log(resp);
                    if (resp.status === 403) {
                        setAnonimous(true);
                        console.warn("You are not authorized to access this resource");
                    } else {
                        setAnonimous(false);
                    }
                    return resp.json();
                })
                .then(resp => {
                    setData(resp);
                })
                .catch(err => {
                    console.log(err)
                });
        } else {
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
            <Container maxWidth="lg" sx={{ padding: 3, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {token ? (
                    anonimous ? (
                        <Typography> Error: {data?.error} </Typography>
                    ) : (
                        data ? <Typography> Logged in as {data?.email} </Typography> : <CircularProgress />
                    )
                ) : (
                    <Box sx={{ transform: "scale(1.5)" }} ref={refContainer} />
                )}
            </Container>
        </Stack>
    );
}

export default Layout;
