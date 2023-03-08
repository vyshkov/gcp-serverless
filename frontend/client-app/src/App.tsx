import React, { useEffect, useState } from 'react';

//import { CredentialResponse, useGoogleOneTapLogin } from '@react-oauth/google';

import './App.css';
import { useGoogleOneTapLogin } from './auth/useLogin';

function App() {

  const [data, setData] = useState("-");
  const [token, setToken] = useState<string | undefined | null>(localStorage.getItem("credential"));
  console.log('current token', token)


  useEffect(() => {
    if (token) {

      const jwtPayload = JSON.parse(window.atob(token.split('.')[1]))
      console.log(jwtPayload.exp);
      if (Date.now() >= jwtPayload.exp * 1000) {
        alert("expired");
        localStorage.clear();
        setToken(undefined);
      } else {
        setData("...");
        fetch("https://api-gw-main-9e7axbuw.uc.gateway.dev/hello2", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(resp => resp.text())
        .then(resp => setData(resp || 'no'))
        .catch(err => setData(err.errorMessage));
      }
    }
  }, [token])

  useGoogleOneTapLogin({
    client_id: "736194043976-ks3e2r68img0ldda4danrbo9j9olvjf3.apps.googleusercontent.com",
    disabled: Boolean(token),
    callback: ({ credential }) => {
        console.log('credential', credential);
        setToken(credential);
        localStorage.setItem('credential', credential);

        
    }
  })

  return (
    <div className="App">
      <div>
        Secured API response: {data}
      </div>
    </div>
  );
}

export default App;
