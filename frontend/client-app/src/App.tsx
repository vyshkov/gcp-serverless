import { AuthProvider } from './auth/useLogin';

import Layout from './components/Layout';

import './App.css';

const Background = () => {
  return (
    <div className="background">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}


function App() {
  return (
    <AuthProvider>
      <Background />
      <Layout />
    </AuthProvider>
  );
}

export default App;
