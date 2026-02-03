import { config } from '../../config';

async function request<T>(endpoint: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = (data as any).error || (data as any).message || `HTTP ${response.status}`;
      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Network error');
  }
}

export const apiClient = {
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  get: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'GET' }),
};
