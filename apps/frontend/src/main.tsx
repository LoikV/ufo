import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';
import { StoreProvider } from './store/StoreContext';
import { authService } from './services/authService';
import { LoginPage } from './components/auth/LoginPage';
import App from './App/App';
import './index.css';

function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <StoreProvider>
      <App onLogout={handleLogout} />
    </StoreProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme()}>
      <Root />
    </ThemeProvider>
  </React.StrictMode>
);
