import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useRealtimeSync } from '../hooks/useRealtimeSync';
import { cacheService } from '../services/CacheService';

export const RealtimeStatus: React.FC = () => {
  const { status, isConnected, lastSync, error, forceSync, retry } = useRealtimeSync();
  const [cacheStats, setCacheStats] = React.useState(cacheService.getStats());

  // Update cache stats periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCacheStats(cacheService.getStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString();
  };

  const handleForceSync = async () => {
    try {
      await forceSync();
    } catch (error) {
      console.error('Force sync failed:', error);
    }
  };

  const handleRetry = async () => {
    try {
      await retry();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          <span>Real-time Sync</span>
        </h3>
        
        <div className="flex space-x-2">
          <button
            onClick={handleForceSync}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            title="Force sync"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {error && (
            <button
              onClick={handleRetry}
              className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
              title="Retry connection"
            >
              <AlertCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Status:</span>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-400 text-sm">Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-400 text-sm">Disconnected</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Last Sync:</span>
            <span className="text-gray-300 text-sm">{formatLastSync(lastSync)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Active Channels:</span>
            <span className="text-gray-300 text-sm">{status.activeChannels.length}</span>
          </div>
        </div>

        {/* Cache Statistics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Cache Entries:</span>
            <span className="text-gray-300 text-sm">
              {cacheStats.validEntries}/{cacheStats.maxSize}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Hit Rate:</span>
            <span className="text-gray-300 text-sm">
              {Math.round(cacheStats.hitRate * 100)}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Expired:</span>
            <span className="text-gray-300 text-sm">{cacheStats.expiredEntries}</span>
          </div>
        </div>
      </div>

      {/* Active Channels */}
      {status.activeChannels.length > 0 && (
        <div className="mb-4">
          <span className="text-gray-400 text-sm block mb-2">Active Channels:</span>
          <div className="flex flex-wrap gap-2">
            {status.activeChannels.map(channel => (
              <span
                key={channel}
                className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-500/30"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-400 text-sm font-medium">Connection Error</p>
              <p className="text-red-300 text-xs mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {isConnected && !error && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <p className="text-green-400 text-sm">
              Real-time synchronization active. Data updates automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};