import { SnackbarProvider } from 'notistack';

import { AuthProvider } from './auth/useLogin';

import Layout from './components/Layout';

import './App.css';

const App = () => (
    <AuthProvider>
      <SnackbarProvider />
      <Layout />
    </AuthProvider>
  )

export default App;
