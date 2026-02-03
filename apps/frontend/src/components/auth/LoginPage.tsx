import { useState, FormEvent } from 'react';
import { Box, TextField, Button, Paper, CircularProgress, Typography } from '@mui/material';
import { useLogin } from './hooks/useLogin';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [apiKey, setApiKey] = useState('');
  const { loading, error, login, setError } = useLogin();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('API key cannot be empty');
      return;
    }

    const success = await login(apiKey.trim());
    if (success) onLogin();
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    if (error) setError('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
      <Typography 
      variant="h4" 
      component="h1" 
      mb={3}
      align="center"
      >
        Authorized personnel only 👽
      </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="API Key"
            value={apiKey}
            onChange={handleApiKeyChange}
            error={!!error}
            helperText={error}
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
