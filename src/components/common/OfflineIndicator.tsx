import React from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useOnlineStatus();

  // Show "Back Online" toast temporarily after regaining connection
  if (isOnline && wasOffline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed top-20 right-4 z-50 flex items-center gap-2.5 px-3.5 py-2 bg-emerald-600 text-white rounded-lg shadow-lg text-xs font-medium animate-in slide-in-from-top-2 duration-150"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>You're back online.</span>
      </div>
    );
  }

  // Show non-blocking subtle notification when offline
  if (!isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 px-3.5 py-2.5 bg-amber-600 dark:bg-amber-700 text-white rounded-xl shadow-xl text-xs font-medium animate-in slide-in-from-bottom-2 duration-150 border border-amber-500/50"
      >
        <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span>You're offline.</span>
          <span className="text-[11px] text-amber-100 font-normal">
            Calculators and client utilities continue to work locally.
          </span>
        </div>
      </div>
    );
  }

  return null;
};
