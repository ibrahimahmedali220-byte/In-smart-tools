import { useState, useEffect, useCallback } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePWAUpdate() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateSWHandler, setUpdateSWHandler] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const register = () => {
      try {
        const updateSW = registerSW({
          onNeedRefresh() {
            setNeedRefresh(true);
          },
          onOfflineReady() {
            setOfflineReady(true);
          }
        });
        setUpdateSWHandler(() => updateSW);
      } catch {
        // SW not supported or failed to register
      }
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  const updateServiceWorker = useCallback(async () => {
    if (updateSWHandler) {
      await updateSWHandler(true);
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, [updateSWHandler]);

  const dismissUpdate = useCallback(() => {
    setNeedRefresh(false);
  }, []);

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
    dismissUpdate
  };
}
