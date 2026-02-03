import { useState } from 'react';
import { authService } from '../../../services/authService';
import { apiClient } from '../../../services/api/apiClient';

interface UseLoginResult {
  loading: boolean;
  error: string;
  login: (apiKey: string) => Promise<boolean>;
  setError: (error: string) => void;
}

interface LoginResponse {
  success: boolean;
  apiKey: string;
}

export function useLogin(): UseLoginResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (apiKey: string) => {
    setLoading(true);
    setError('');

    try {
      const data = await apiClient.post<LoginResponse>('/api/auth/login', { apiKey });
      authService.login(data.apiKey);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Network error. Please check your connection';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login, setError };
}
