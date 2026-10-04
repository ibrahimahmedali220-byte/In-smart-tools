import React, { useState } from 'react';
import { ShieldCheck, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from './Toast';
import { useUserPreferences } from '../../hooks/useUserPreferences';

export const PrivacyWiperButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { showToast } = useToast();
  const { clearRecentSearches, clearRecentTools } = useUserPreferences();

  const handleWipeData = () => {
    try {
      clearRecentSearches();
      clearRecentTools();
      // Clear session storages and any cached temp data
      sessionStorage.clear();
      setIsOpen(false);
      showToast('All local session history, recent tool searches & cache cleared!', 'success');
    } catch {
      showToast('Cleared session data.', 'info');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors border border-slate-200/80 dark:border-slate-700/80 cursor-pointer"
        title="1-Click Privacy & Cache Wiper (Cyber Cafe / Shared Computer Mode)"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>1-Click Privacy Wiper</span>
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Wipe Local Session & Search History</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will instantly clear your recent tool visits, search queries, and temporary in-browser cache from this device. Ideal when using public or shared computers.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleWipeData}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Wipe Everything</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
