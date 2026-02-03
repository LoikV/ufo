const API_KEY_STORAGE_KEY = 'ufo_tracker_api_key';

export const authService = {
  login(apiKey: string): void {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  },

  logout(): void {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  },

  getApiKey(): string | null {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  },

  isAuthenticated(): boolean {
    return this.getApiKey() !== null;
  },
};
