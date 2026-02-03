import { ReactElement, ReactNode } from 'react';
import { render as rtlRender, renderHook as rtlRenderHook, RenderOptions, RenderHookOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { StoreProvider } from '../../../store/StoreContext';

type AllTheProvidersProps = {
  children?: ReactNode;
};

const AllTheProviders = ({ children }: AllTheProvidersProps) => (
  <ThemeProvider theme={createTheme()}>
    <StoreProvider>{children}</StoreProvider>
  </ThemeProvider>
);

function render(ui: ReactElement, options?: RenderOptions) {
  return rtlRender(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
}

function renderHook<Result, Props>(
  hook: (props: Props) => Result,
  options?: RenderHookOptions<Props>
) {
  return rtlRenderHook(hook, {
    wrapper: AllTheProviders,
    ...options,
  });
}

export { render, renderHook };
