import { useState, useEffect, useCallback } from 'react';
import { realtimeService, SyncStatus } from '../services/RealtimeService';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface RealtimeSyncHook {
  status: SyncStatus;
  isConnected: boolean;
  lastSync: Date | null;
  error: string | null;
  forceSync: () => Promise<void>;
  retry: () => Promise<void>;
}

/**
 * Hook for managing real-time synchronization status
 */
export const useRealtimeSync = (): RealtimeSyncHook => {
  const [status, setStatus] = useState<SyncStatus>(realtimeService.getStatus());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize real-time service
  useEffect(() => {
    const initializeSync = async () => {
      if (isInitialized) return;
      
      try {
        console.log('🔄 Initializing real-time sync from hook...');
        await realtimeService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('❌ Failed to initialize real-time sync:', error);
      }
    };

    initializeSync();

    // Cleanup on unmount
    return () => {
      if (isInitialized) {
        realtimeService.cleanup();
      }
    };
  }, [isInitialized]);

  // Update status periodically
  useEffect(() => {
    const updateStatus = () => {
      setStatus(realtimeService.getStatus());
    };

    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const forceSync = useCallback(async () => {
    try {
      await realtimeService.forcSync();
      setStatus(realtimeService.getStatus());
    } catch (error) {
      console.error('❌ Force sync failed:', error);
      setStatus(realtimeService.getStatus());
      throw error;
    }
  }, []);

  const retry = useCallback(async () => {
    try {
      console.log('🔄 Retrying real-time sync...');
      await realtimeService.cleanup();
      await realtimeService.initialize();
      setStatus(realtimeService.getStatus());
    } catch (error) {
      console.error('❌ Retry failed:', error);
      setStatus(realtimeService.getStatus());
      throw error;
    }
  }, []);

  return {
    status,
    isConnected: status.connected,
    lastSync: status.lastSync,
    error: status.error,
    forceSync,
    retry
  };
};

/**
 * Hook for listening to specific data changes
 */
export const useRealtimeData = <T = any>(
  dataType: string,
  onDataChange?: (payload: RealtimePostgresChangesPayload<T>) => void
) => {
  const [lastChange, setLastChange] = useState<RealtimePostgresChangesPayload<T> | null>(null);
  const [changeCount, setChangeCount] = useState(0);

  useEffect(() => {
    if (!onDataChange) return;

    const unsubscribe = realtimeService.onDataChange(dataType, (payload) => {
      setLastChange(payload);
      setChangeCount(prev => prev + 1);
      onDataChange(payload);
    });

    return unsubscribe;
  }, [dataType, onDataChange]);

  return {
    lastChange,
    changeCount
  };
};