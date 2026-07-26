import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const PwaOfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom duration-300">
      {!isOnline ? (
        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-xs text-white">Offline Mode Active</h5>
              <p className="text-3xs text-slate-400">
                Data is served from local cache. Changes will sync when online.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOnline(navigator.onLine)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-3xs font-bold text-slate-300 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="p-4 bg-emerald-900 text-white rounded-2xl shadow-2xl border border-emerald-800 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-emerald-200">Network Connection Restored</h5>
            <p className="text-3xs text-emerald-300/80">
              Synced latest academic circulars & student submissions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
