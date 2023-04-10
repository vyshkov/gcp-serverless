import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { AuthProvider } from './auth/useLogin';

import { Dictionary } from './components/dictionary/Dictionary';
import Game from './components/guessgame/Game';
import Layout from './components/Layout';

import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Dictionary /> },
      { path: "/game", element: <Game />}
    ],
  },
]);

const App = () => (
    <AuthProvider>
      <SnackbarProvider />
      <RouterProvider router={router} />
    </AuthProvider>
  )

export default App;
