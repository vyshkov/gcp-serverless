import { AuthProvider } from './auth/useLogin';

import Layout from './components/Layout';

import './App.css';

const App = () => (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  )

export default App;
