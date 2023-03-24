import { AuthProvider } from './auth/useLogin';

import Layout from './components/Layout';

import './App.css';

const Background = () => (
    <div className="background">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  )


const App = () => (
    <AuthProvider>
      <Background />
      <Layout />
    </AuthProvider>
  )

export default App;
