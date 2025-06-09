import { useEffect, useCallback } from "react";
import { useUserStore, useTaskStore, UserStore} from "../services/cache/stores/storeZustand";
import type { StoreApi } from 'zustand';

export interface SyncState {
  lastSyncedAt?: string;
  needsSync?: boolean;
}

const debounce = <F extends (...args: any[]) => void>(
  func: F,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export function useUserSync(callback: (state: UserStore) => Promise<void>) {
  const debouncedCallback = useCallback(
    debounce(async (state: UserStore) => {
      try {
        await callback(state);
      } catch (error) {
        console.error('User sync failed:', error);
      }
    }, 500),
    [callback]
  );

  useEffect(() => {
    const unsubscribe = (useUserStore as unknown as StoreApi<UserStore>).subscribe(
      debouncedCallback
    );
    return () => unsubscribe();
  }, [debouncedCallback]);
}

export function useTasksSync() {
  const processNextSyncItem = useTaskStore(state => state.processNextSyncItem);
  const syncQueueLength = useTaskStore(state => state.syncQueue.length);
  const isSyncing = useTaskStore(state => state.isSyncing);

  useEffect(() => {
    if (syncQueueLength > 0 && !isSyncing) {
      processNextSyncItem();
    }
  }, [syncQueueLength, isSyncing, processNextSyncItem]);
}
