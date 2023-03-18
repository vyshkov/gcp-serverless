import { AuthProvider } from './auth/useLogin';

import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;
