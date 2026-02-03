import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUfoCleanup } from '../../useUfoCleanup';
import { UfoStore } from '../../../../store/UfoStore';
import { CLEANUP_INTERVAL_MS } from '../../../../utils/constants';

describe('useUfoCleanup', () => {
  let store: UfoStore;
  let cleanupSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    store = new UfoStore();
    cleanupSpy = vi.spyOn(store, 'cleanupStaleUfos');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanupSpy.mockRestore();
  });

  it('should call cleanupStaleUfos after default interval', () => {
    expect.hasAssertions();
    renderHook(() => useUfoCleanup(store));

    expect(cleanupSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(CLEANUP_INTERVAL_MS);
    expect(cleanupSpy).toHaveBeenCalledTimes(1);
  });

  it('should call cleanupStaleUfos multiple times at intervals', () => {
    expect.hasAssertions();
    renderHook(() => useUfoCleanup(store));

    vi.advanceTimersByTime(CLEANUP_INTERVAL_MS);
    expect(cleanupSpy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(CLEANUP_INTERVAL_MS);
    expect(cleanupSpy).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(CLEANUP_INTERVAL_MS);
    expect(cleanupSpy).toHaveBeenCalledTimes(3);
  });

  it('should use custom interval when provided', () => {
    expect.hasAssertions();
    const customInterval = 5000;
    renderHook(() => useUfoCleanup(store, customInterval));

    vi.advanceTimersByTime(customInterval - 100);
    expect(cleanupSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(cleanupSpy).toHaveBeenCalledTimes(1);
  });

  it('should restart interval when store changes', () => {
    expect.hasAssertions();
    const { rerender } = renderHook(({ s }) => useUfoCleanup(s), {
      initialProps: { s: store },
    });

    vi.advanceTimersByTime(CLEANUP_INTERVAL_MS);
    expect(cleanupSpy).toHaveBeenCalledTimes(1);

    const newStore = new UfoStore();
    const newCleanupSpy = vi.spyOn(newStore, 'cleanupStaleUfos');

    rerender({ s: newStore });

    vi.advanceTimersByTime(CLEANUP_INTERVAL_MS);
    expect(cleanupSpy).toHaveBeenCalledTimes(1);
    expect(newCleanupSpy).toHaveBeenCalledTimes(1);

    newCleanupSpy.mockRestore();
  });

  it('should restart interval when intervalMs changes', () => {
    expect.hasAssertions();
    const { rerender } = renderHook(({ interval }) => useUfoCleanup(store, interval), {
      initialProps: { interval: 5000 },
    });

    vi.advanceTimersByTime(5000);
    expect(cleanupSpy).toHaveBeenCalledTimes(1);

    rerender({ interval: 3000 });
    cleanupSpy.mockClear();

    vi.advanceTimersByTime(3000);
    expect(cleanupSpy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(3000);
    expect(cleanupSpy).toHaveBeenCalledTimes(2);
  });
});
