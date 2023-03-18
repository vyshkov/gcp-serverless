import React, { useEffect, useState } from 'react';
import { useGoogleOneTapLogin } from './auth/useLogin';

import { AppBar, Avatar, Box, Button, CircularProgress, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { Stack } from '@mui/system';

const dev = false;

const CLIENT_ID = "397907536090-h8dln0rh8picm5vvk1qkeu0qhvkgek49.apps.googleusercontent.com";
const GW_API_PATH = "https://api-gw-main-52snvftm.uc.gateway.dev";
const LOCAL_API_PATH = "http://localhost:8080"

const API_PATH = dev ? LOCAL_API_PATH : GW_API_PATH;

function parseJwt (token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

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
  text: string;
  author: string;
}
  
function App() {
  const [data, setData] = useState<JWT>();
  const [quote, setQuote] = useState<Quote>();
  const [token, setToken] = useState<string | undefined | null>(localStorage.getItem("credential"));
  const [isInProgress, setInProgress] = useState(false);

  const userData = (token && parseJwt(token)) || {};
  console.log('current token', userData);
  console.log('current data', data);

  useEffect(() => {
    if (token) {
      const jwtPayload = JSON.parse(window.atob(token.split('.')[1]))
      console.log(jwtPayload.exp);
      if (Date.now() >= jwtPayload.exp * 1000) {
        localStorage.clear();
        setToken(undefined);
      } else {
        setInProgress(true);
        fetch(`${API_PATH}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then(resp => resp.json())
        .then(resp => setData(resp || {}))
        .finally(() => setInProgress(false));
      }

      fetch(`${API_PATH}/hello`)
        .then(resp => resp.json())
        .then(resp => setQuote(resp || {}))
    }
  }, [token])

  const login = useGoogleOneTapLogin({
    client_id: CLIENT_ID,
    disabled: Boolean(token),
    callback: ({ credential }) => {
      console.log('credential', credential);
      setToken(credential);
      localStorage.setItem('credential', credential);
    }
  });

  return (
    <Box>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow: 1 }}>MyDictionary</Typography>
            {token ? (
              <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                <Typography variant="h6" sx={{ paddingRight: 2 }}>{userData.given_name}</Typography>
                <IconButton sx={{ p: 0 }}>
                  <Avatar alt={userData.given_name} src={userData.picture} />
                </IconButton>
              </Stack>
            ) : (
              <Button onClick={login} variant="contained" color="secondary">Login</Button>
            )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ padding: 3 }}>
        {isInProgress ? (
          <CircularProgress />
        ) : (
          <Typography variant="h6">Secured API response: {data?.payload?.given_name || "-"} {data?.payload?.family_name || "-"}</Typography>
        )}

        {quote && (
          <Typography>{quote.text} ({quote.author})</Typography>
        )}
      </Container>
    </Box>
  );
}

export default App;
