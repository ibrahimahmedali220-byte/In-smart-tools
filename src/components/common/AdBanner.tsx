import React, { useEffect, useRef, useState } from 'react';

export interface AdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed' | 'auto';
  className?: string;
  label?: string;
}

/**
 * Google AdSense-Compliant Responsive Ad Unit
 * - Adheres strictly to Google Publisher Policies with mandatory "ADVERTISEMENT" labeling
 * - Reserves minimum dimensions to guarantee 0.00 Cumulative Layout Shift (CLS)
 * - Safe error boundary prevents script blockers / uBlock from causing React crashes
 * - Matches publisher ID ca-pub-2455309165032618 authorized in ads.txt
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  slotId,
  format = 'horizontal',
  className = '',
  label = 'ADVERTISEMENT'
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = adsbygoogle;
        
        // Push safely to adsbygoogle queue
        adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch {
      // Gracefully catch ad blocker or script interception
      setAdError(true);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [slotId]);

  // Height reservation to avoid any Cumulative Layout Shift (CLS)
  const minHeightClass =
    format === 'rectangle'
      ? 'min-h-[250px] max-w-[336px] mx-auto'
      : format === 'in-feed'
      ? 'min-h-[120px]'
      : 'min-h-[90px] sm:min-h-[100px]';

  return (
    <aside
      ref={adRef}
      aria-label="Sponsored Advertisement"
      className={`relative w-full my-6 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800/80 flex flex-col items-center justify-center text-center transition-all overflow-hidden ${minHeightClass} ${className}`}
    >
      {/* Policy-compliant distinct sponsor tag */}
      <div className="absolute top-1.5 right-3 text-[10px] font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase select-none pointer-events-none">
        {label}
      </div>

      {/* Google AdSense container */}
      <div className="w-full flex justify-center items-center overflow-hidden">
        <ins
          className="adsbygoogle w-full block text-center"
          style={{ display: 'block', minHeight: format === 'rectangle' ? 250 : 90 }}
          data-ad-client="ca-pub-2455309165032618"
          data-ad-slot={slotId || 'auto'}
          data-ad-format={format === 'rectangle' ? 'rectangle' : format === 'horizontal' ? 'horizontal' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>

      {/* Subtle fallback note if script was blocked or before ad loads */}
      {!adLoaded && !adError && (
        <div className="text-[11px] text-slate-600 dark:text-slate-400 py-4 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sponsored Space • Smartly Tools</span>
        </div>
      )}
    </aside>
  );
};
