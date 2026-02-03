import { authService } from './services/authService';

export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  get apiKey(): string {
    return authService.getApiKey() || import.meta.env.VITE_API_KEY || 'ufo-tracker-2026';
  },
} as const;
