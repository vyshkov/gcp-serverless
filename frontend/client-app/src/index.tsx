import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';

import CustomThemeProvider from './themes/CustomThemeProvider';


if (window.location.hash.startsWith('#/path=')) {
  // redirect
  window.location.href = window.location.origin + window.location.hash.substring(8);
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <CustomThemeProvider>
    <App />
  </CustomThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
