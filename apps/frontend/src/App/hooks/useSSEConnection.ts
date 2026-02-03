import { useEffect, useState } from 'react';
import { SSEClient } from '../../services/sseClient';
import { parseUfoUpdate } from '../../parsers';
import type { UfoStore } from '../../store/UfoStore';
import { config } from '../../config';

export function useSSEConnection(store: UfoStore) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiKey = config.apiKey;
  const apiUrl = config.apiUrl;

  useEffect(() => {
    if (!apiKey) {
      return;
    }

    const client = new SSEClient(
      `${apiUrl}/api/ufos/stream`,
      apiKey
    );

    const unsubscribeUpdate = client.onUpdate((rawData) => {
      const parsed = parseUfoUpdate(rawData);
      
      if (!parsed) {
        return;
      }
      
      store.updateUfo(parsed);
    });

    const unsubscribeError = client.onError((err) => {
      setError(err);
      setConnected(false);
    });

    const unsubscribeOpen = client.onOpen(() => {
      setConnected(true);
      setError(null);
    });

    client.connect();

    return () => {
      unsubscribeUpdate();
      unsubscribeError();
      unsubscribeOpen();
      client.disconnect();
      setConnected(false);
    };
  }, [apiKey, apiUrl, store]);

  return { connected, error };
}
