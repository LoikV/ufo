import { useEffect } from 'react';
import type { UfoStore } from '../../store/UfoStore';
import { CLEANUP_INTERVAL_MS } from '../../utils/constants';

export function useUfoCleanup(
  store: UfoStore,
  intervalMs: number = CLEANUP_INTERVAL_MS
): void {
  useEffect(() => {
    const interval = setInterval(() => {
      store.cleanupStaleUfos();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [store, intervalMs]);
}
