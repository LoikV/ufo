import { describe, it, expect, beforeEach, vi, } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { UfoUpdate } from '../../../../types/ufo';
import { useSSEConnection } from '../../useSSEConnection';
import type { UfoStore } from '../../../../store/UfoStore';

const { mockConfig, mockSSEClient } = vi.hoisted(() => {
  const config = {
    apiKey: 'test-key',
    apiUrl: 'http://localhost:4000',
  };

  type UpdateHandler = (data: UfoUpdate) => void;
  type ErrorHandler = (err: Error) => void;
  type OpenHandler = () => void;

  let instance: {
    url: string;
    apiKey: string;
    connectFn: ReturnType<typeof vi.fn>;
    disconnectFn: ReturnType<typeof vi.fn>;
    emitOpen: () => void;
    emitError: (err: Error) => void;
    emitUpdate: (data: UfoUpdate) => void;
  } | null = null;

  const updateHandlers = new Set<UpdateHandler>();
  const errorHandlers = new Set<ErrorHandler>();
  const openHandlers = new Set<OpenHandler>();

  class SSEClientMock {
    public connectFn = vi.fn();
    public disconnectFn = vi.fn();

    constructor(
      public url: string,
      public apiKey: string
    ) {
      instance = {
        url,
        apiKey,
        connectFn: this.connectFn,
        disconnectFn: this.disconnectFn,
        emitOpen: () => openHandlers.forEach((h) => h()),
        emitError: (err: Error) => errorHandlers.forEach((h) => h(err)),
        emitUpdate: (data: UfoUpdate) => updateHandlers.forEach((h) => h(data)),
      };
    }

    get isConnected(): boolean {
      return true;
    }

    connect(): void {
      this.connectFn();
    }

    disconnect(): void {
      this.disconnectFn();
    }

    onUpdate(handler: UpdateHandler): () => void {
      updateHandlers.add(handler);
      return () => updateHandlers.delete(handler);
    }

    onError(handler: ErrorHandler): () => void {
      errorHandlers.add(handler);
      return () => errorHandlers.delete(handler);
    }

    onOpen(handler: OpenHandler): () => void {
      openHandlers.add(handler);
      return () => openHandlers.delete(handler);
    }
  }

  return {
    mockConfig: config,
    mockSSEClient: {
      SSEClientMock,
      getInstance: () => instance,
      reset: () => {
        instance = null;
        updateHandlers.clear();
        errorHandlers.clear();
        openHandlers.clear();
      },
    },
  };
});

vi.mock('../../../../config', () => ({
  config: mockConfig,
}));

vi.mock('../../../../services/sseClient', () => ({
  SSEClient: mockSSEClient.SSEClientMock,
}));

describe('useSSEConnection', () => {

  beforeEach(() => {
    mockSSEClient.reset();
    mockConfig.apiKey = 'test-key';
    vi.clearAllMocks();
  });

  type StoreLike = Pick<UfoStore, 'updateUfo'>;

  const createMockStore = (): StoreLike => ({
    updateUfo: vi.fn(),
  });

  it('does not connect when apiKey is missing', () => {
    mockConfig.apiKey = '';
    const store = createMockStore();
    
    const { result } = renderHook(() => useSSEConnection(store as UfoStore));

    expect(mockSSEClient.getInstance()).toBeNull();
    expect(result.current.connected).toBe(false);
    expect(result.current.error).toBeNull();
    mockConfig.apiKey = 'test-key';
  });

  it('creates SSEClient and calls connect on mount', () => {
    const store = createMockStore();
    
    renderHook(() => useSSEConnection(store as UfoStore));

    const client = mockSSEClient.getInstance();
    expect(client).not.toBeNull();
    expect(client!.url).toBe('http://localhost:4000/api/ufos/stream');
    expect(client!.apiKey).toBe('test-key');
    expect(client!.connectFn).toHaveBeenCalledTimes(1);
  });

  it('sets connected=true on open event', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useSSEConnection(store as UfoStore));

    expect(result.current.connected).toBe(false);

    act(() => {
      mockSSEClient.getInstance()!.emitOpen();
    });

    expect(result.current.connected).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('sets connected=false and error on error event', () => {
    const store = createMockStore();
    const { result } = renderHook(() => useSSEConnection(store as UfoStore));

    act(() => {
      mockSSEClient.getInstance()!.emitOpen();
    });
    expect(result.current.connected).toBe(true);

    const testError = new Error('Connection failed');
    act(() => {
      mockSSEClient.getInstance()!.emitError(testError);
    });

    expect(result.current.connected).toBe(false);
    expect(result.current.error).toBe(testError);
  });

  it('calls store.updateUfo for valid updates', () => {
    const store = createMockStore();
    renderHook(() => useSSEConnection(store as UfoStore));
    const update: UfoUpdate = { id: 'ufo-1', lat: 50.0, lng: 30.0, heading: 90, ts: 123 };
    
    act(() => {
      mockSSEClient.getInstance()!.emitUpdate(update);
    });

    expect(store.updateUfo).toHaveBeenCalledTimes(1);
    expect(store.updateUfo).toHaveBeenCalledWith(update);
  });
});
