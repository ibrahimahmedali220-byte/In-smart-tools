import React, { useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card' | 'footer';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already running inside installed standalone PWA, suppress the button
  if (isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (!isInstallable && !isIOS) {
    return null;
  }

  if (variant === 'card') {
    return (
      <>
        <div className={`p-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Download className="w-4 h-4 text-slate-900 dark:text-sky-400" />
              Install India Smart Tools
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Add to your home screen or desktop for fast, offline-ready access without typing the URL.
            </p>
          </div>
          <button
            type="button"
            onClick={handleInstall}
            disabled={isInstalling}
            className="shrink-0 px-4 py-2 min-h-[44px] min-w-[120px] bg-slate-900 dark:bg-sky-500 hover:bg-slate-800 dark:hover:bg-sky-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-sky-400"
          >
            {isInstalling ? 'Installing...' : isIOS ? 'Install on iOS' : 'Install App'}
          </button>
        </div>

        {/* iOS Safari Guide Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Install on iPhone / iPad
                </h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                  aria-label="Close installation guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 shadow-2xs">
                    <Share className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-slate-100">1. Tap Share</strong>
                    Tap the Share button in Safari's bottom toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 shadow-2xs">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-slate-100">2. Add to Home Screen</strong>
                    Scroll down in the share sheet and tap <em>Add to Home Screen</em>.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs rounded-xl transition-colors hover:bg-slate-800 dark:hover:bg-white min-h-[44px]"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Header compact button
  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        disabled={isInstalling}
        aria-label="Install India Smart Tools progressive web app"
        className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200/80 dark:border-slate-700/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-300 min-h-[36px] ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-slate-500 dark:text-sky-400" />
        <span>{isInstalling ? 'Installing...' : isIOS ? 'Install iOS' : 'Install App'}</span>
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Install on iPhone / iPad
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Close installation guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 shadow-2xs">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100">1. Tap Share</strong>
                  Tap the Share button in Safari's bottom toolbar.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 shadow-2xs">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100">2. Add to Home Screen</strong>
                  Scroll down in the share sheet and tap <em>Add to Home Screen</em>.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs rounded-xl transition-colors hover:bg-slate-800 dark:hover:bg-white min-h-[44px]"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
