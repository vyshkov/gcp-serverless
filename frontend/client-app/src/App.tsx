import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

function App() {
  const [clientId, setClientId] = useState<string | undefined>("");
  const [result, setResult] = useState<string | undefined>("");
  const [result2, setResult2] = useState<string | undefined>("");

  const responseMessage = (response: CredentialResponse) => {
    console.log("Token is", response);
    setClientId(response.clientId);
    fetch("https://api-gw-main-9e7axbuw.uc.gateway.dev/hello2", {
      headers: {
        Authorization: `Bearer ${response.credential}`,
      }
    })
      .then(resp => resp.text())
      .then(resp => setResult2(resp))
      .catch(err => setResult2(JSON.stringify(err)));
    fetch("https://api-gw-main-9e7axbuw.uc.gateway.dev/hello")
      .then(resp => resp.text())
      .then(resp => setResult(resp))
      .catch(err => setResult(JSON.stringify(err)));  
   
  };
  const errorMessage = () => {
    console.log("error");
  };
  return (
    <div className="App">
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} useOneTap auto_select />
      <div>
        API call result: {result ? result : "-"}
        <br />
        SECURED API call result: {result2 ? result2 : "-"}
      </div>
    </div>
  );
}

export default App;
