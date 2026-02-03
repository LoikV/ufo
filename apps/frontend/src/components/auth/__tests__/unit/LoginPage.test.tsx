import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/shared/utils/testing/customRenders';
import { LoginPage } from '../../LoginPage';
import { useLogin } from '../../hooks/useLogin';

const mockLogin = vi.fn();
const mockSetError = vi.fn();

vi.mock('../../hooks/useLogin', () => ({
  useLogin: vi.fn(),
}));

const USE_LOGIN_HOOK = {
  loading: false,
  error: '',
  login: mockLogin,
  setError: mockSetError,
};

describe('LoginPage', () => {
  const onLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockReset();
    vi.mocked(useLogin).mockReturnValue(USE_LOGIN_HOOK);
  });

  it('should render title', () => {
    render(<LoginPage onLogin={onLogin} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Authorized personnel only 👽'
    );
  });

  it('should render API Key input', () => {
    render(<LoginPage onLogin={onLogin} />);
    expect(screen.getByLabelText(/API Key/i)).toBeInTheDocument();
  });

  it('should render Sign In button', () => {
    render(<LoginPage onLogin={onLogin} />);
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('should show validation error when submitting empty API key', async () => {
    const user = userEvent.setup();
    render(<LoginPage onLogin={onLogin} />);

    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(mockSetError).toHaveBeenCalledWith('API key cannot be empty');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('should trim API key before submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(false);
    render(<LoginPage onLogin={onLogin} />);

    await user.type(screen.getByLabelText(/API Key/i), '  my-key  ');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(mockLogin).toHaveBeenCalledWith('my-key');
  });

  it('should call onLogin when login succeeds', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(true);
    render(<LoginPage onLogin={onLogin} />);

    await user.type(screen.getByLabelText(/API Key/i), 'valid-key');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledTimes(1);
    });
  });

  it('should not call onLogin when login fails', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(false);
    render(<LoginPage onLogin={onLogin} />);

    await user.type(screen.getByLabelText(/API Key/i), 'invalid-key');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(onLogin).not.toHaveBeenCalled();
  });

  it('should display error from useLogin hook', () => {
    vi.mocked(useLogin).mockReturnValue({ ...USE_LOGIN_HOOK, error: 'Invalid API key' });
    render(<LoginPage onLogin={onLogin} />);

    expect(screen.getByText('Invalid API key')).toBeInTheDocument();
  });

  it('should clear error when user types in API key field', async () => {
    const user = userEvent.setup();
    vi.mocked(useLogin).mockReturnValue({ ...USE_LOGIN_HOOK, error: 'Invalid API key' });
    render(<LoginPage onLogin={onLogin} />);

    await user.type(screen.getByLabelText(/API Key/i), 'x');

    expect(mockSetError).toHaveBeenCalledWith('');
  });

  it('should disable button and show progress indicator when loading', () => {
    vi.mocked(useLogin).mockReturnValue({ ...USE_LOGIN_HOOK, loading: true });
    render(<LoginPage onLogin={onLogin} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
