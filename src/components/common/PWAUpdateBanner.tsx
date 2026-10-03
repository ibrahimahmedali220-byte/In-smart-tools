import React from 'react';
import { RefreshCw, X } from 'lucide-react';
import { usePWAUpdate } from '../../hooks/usePWAUpdate';

export const PWAUpdateBanner: React.FC = () => {
  const { needRefresh, updateServiceWorker, dismissUpdate } = usePWAUpdate();

  if (!needRefresh) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 bg-slate-900 dark:bg-slate-800 text-white p-4 rounded-xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-800 dark:bg-slate-700 rounded-lg text-sky-400 shrink-0">
          <RefreshCw className="w-4 h-4 animate-spin" />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-100">
            New Version Available
          </p>
          <p className="text-[11px] text-slate-400 leading-tight">
            Refresh now to get the latest tools and performance updates.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => updateServiceWorker()}
          className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 min-h-[36px]"
        >
          Update
        </button>
        <button
          type="button"
          onClick={dismissUpdate}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          aria-label="Dismiss update notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
