import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import { GoogleLogin } from '@react-oauth/google';

function App() {
    const responseMessage = (response: any) => {
      console.log(response);
  };
  const errorMessage = () => {
      console.log("error");
  };
  return (
    <div className="App">
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
}

export default App;
