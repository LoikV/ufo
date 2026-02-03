import { createContext, useContext, useState, type ReactNode } from 'react';
import { UfoStore } from './UfoStore';

const UfoStoreContext = createContext<UfoStore | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => new UfoStore());
  return (
    <UfoStoreContext.Provider value={store}>{children}</UfoStoreContext.Provider>
  );
}

export function useUfoStore(): UfoStore {
  const store = useContext(UfoStoreContext);
  if (!store) {
    throw new Error('useUfoStore must be used within StoreProvider');
  }
  return store;
}
