import { describe, it, expect, beforeEach, vi } from 'vitest';
import { waitFor, act } from '@testing-library/react';
import { renderHook } from '@/shared/utils/testing/customRenders';
import { useLogin } from '../../useLogin';
import { apiClient } from '../../../../../services/api/apiClient';
import { authService } from '../../../../../services/authService';

vi.mock('../../../../../services/api/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

vi.mock('../../../../../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

const TEST_API_KEY = 'test-api-key';
const RETURNED_API_KEY = 'returned-api-key';
const MOCK_SUCCESS_RESPONSE = { success: true, apiKey: TEST_API_KEY };
const MOCK_RETURNED_RESPONSE = { success: true, apiKey: RETURNED_API_KEY };
const ERROR_MESSAGES = {
  INVALID_KEY: 'Invalid API key',
  FIRST_ERROR: 'First error',
  SERVER_ERROR: 'Server error',
  CUSTOM_ERROR: 'Custom error',
};

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial state', () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useLogin());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should set `loading` to `true` during API call', async () => {
    expect.hasAssertions();
    vi.mocked(apiClient.post).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(MOCK_SUCCESS_RESPONSE), 100))
    );

    const { result } = renderHook(() => useLogin());

    const loginPromise = result.current.login(TEST_API_KEY);

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await loginPromise;
  });

  it('should call `apiClient.post` with correct parameters', async () => {
    expect.hasAssertions();
    vi.mocked(apiClient.post).mockResolvedValue(MOCK_SUCCESS_RESPONSE);

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login(TEST_API_KEY);
    });

    expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', { apiKey: TEST_API_KEY });
  });

  it('should call `authService.login` with returned API key', async () => {
    expect.hasAssertions();
    vi.mocked(apiClient.post).mockResolvedValue(MOCK_RETURNED_RESPONSE);

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login(TEST_API_KEY);
    });

    expect(authService.login).toHaveBeenCalledWith(RETURNED_API_KEY);
  });

  it('should return true on successful login', async () => {
    expect.hasAssertions();
    vi.mocked(apiClient.post).mockResolvedValue(MOCK_SUCCESS_RESPONSE);

    const { result } = renderHook(() => useLogin());
    
    await act(async () => {
      const success = await result.current.login(TEST_API_KEY);
      expect(success).toBe(true);
    });
  });

  it('should set loading to false after successful login', async () => {
    expect.hasAssertions();
    vi.mocked(apiClient.post).mockResolvedValue(MOCK_SUCCESS_RESPONSE);

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login(TEST_API_KEY);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should handle server error message', async () => {
    expect.hasAssertions();
    vi.mocked(apiClient.post).mockRejectedValue(new Error(ERROR_MESSAGES.INVALID_KEY));

    const { result } = renderHook(() => useLogin());
    
    await act(async () => {
      const success = await result.current.login(TEST_API_KEY);
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe(ERROR_MESSAGES.INVALID_KEY);
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should handle non-Error rejection with fallback message', async () => {
    expect.hasAssertions();
    vi.mocked(apiClient.post).mockRejectedValue('unexpected rejection');

    const { result } = renderHook(() => useLogin());
    
    await act(async () => {
      const success = await result.current.login(TEST_API_KEY);
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe('Network error. Please check your connection');
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should set loading to false after error', async () => {
    expect.hasAssertions();
    vi.mocked(apiClient.post).mockRejectedValue(new Error(ERROR_MESSAGES.SERVER_ERROR));

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login(TEST_API_KEY);
    });

    expect(result.current.loading).toBe(false);
  });

  it('should clear previous error on new login attempt', async () => {
    expect.hasAssertions();
    vi.mocked(apiClient.post).mockRejectedValueOnce(new Error(ERROR_MESSAGES.FIRST_ERROR));

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login(TEST_API_KEY);
    });

    expect(result.current.error).toBe(ERROR_MESSAGES.FIRST_ERROR);

    vi.mocked(apiClient.post).mockResolvedValueOnce(MOCK_SUCCESS_RESPONSE);
    await act(async () => {
      await result.current.login(TEST_API_KEY);
    });

    expect(result.current.error).toBe('');
  });

  it('should allow manual error setting via `setError`', () => {
    expect.hasAssertions();
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setError(ERROR_MESSAGES.CUSTOM_ERROR);
    });

    expect(result.current.error).toBe(ERROR_MESSAGES.CUSTOM_ERROR);
  });

  it('should clear error via `setError` method', async () => {
    expect.hasAssertions();
    vi.mocked(apiClient.post).mockRejectedValue(new Error(ERROR_MESSAGES.SERVER_ERROR));

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.login(TEST_API_KEY);
    });

    expect(result.current.error).toBe(ERROR_MESSAGES.SERVER_ERROR);

    act(() => {
      result.current.setError('');
    });

    expect(result.current.error).toBe('');
  });
});
