import React, { useState, useEffect } from 'react';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import {
  generatePassword,
  PasswordOptions,
  PasswordResult
} from '../../../utils/calculators/passwordGenerator';
import { safeClipboardCopy } from '../../../utils/security';
import {
  KeyRound,
  Copy,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Sparkles
} from 'lucide-react';

export const PasswordGeneratorComponent: React.FC = () => {
  const { showToast } = useToast();

  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [result, setResult] = useState<PasswordResult>(() =>
    generatePassword({
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false
    })
  );

  const handleGenerate = () => {
    try {
      const res = generatePassword({
        length,
        includeUppercase: includeUpper,
        includeLowercase: includeLower,
        includeNumbers: includeNumbers,
        includeSymbols: includeSymbols,
        excludeAmbiguous
      });
      setResult(res);
      setIsCopied(false);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to generate password.', 'error');
    }
  };

  // Re-generate on option changes
  useEffect(() => {
    handleGenerate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  const handleCopy = async () => {
    if (!result.password) return;
    const ok = await safeClipboardCopy(result.password);
    if (ok) {
      setIsCopied(true);
      showToast('Password copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2500);
    } else {
      showToast('Could not access clipboard. Please copy manually.', 'info');
    }
  };

  const applyPreset = (len: number, symbols: boolean) => {
    setLength(len);
    setIncludeUpper(true);
    setIncludeLower(true);
    setIncludeNumbers(true);
    setIncludeSymbols(symbols);
    setExcludeAmbiguous(false);
  };

  // Color mapping for descriptive strength
  const getStrengthBadge = () => {
    switch (result.strengthLabel) {
      case 'Very Weak':
      case 'Weak':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', bar: 'bg-rose-500', width: '25%' };
      case 'Moderate':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500', width: '50%' };
      case 'Strong':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-500', width: '80%' };
      case 'Very Strong':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-600', width: '100%' };
    }
  };

  const strengthBadge = getStrengthBadge();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Generated Password Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-sm">
        
        {/* Output Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Generated Password
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${strengthBadge.bg}`}>
              {result.strengthLabel} ({result.entropyBits} bits entropy)
            </span>
          </div>
        </div>

        {/* Display Box */}
        <div className="relative flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="font-mono text-base sm:text-xl font-bold tracking-wider text-slate-900 overflow-x-auto break-all mr-12 select-all">
            {showPassword ? result.password : '•'.repeat(result.password.length)}
          </div>

          <div className="absolute right-3 flex items-center gap-1.5 bg-slate-50 pl-2">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-200/60"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              aria-label="Regenerate password"
              className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-200/60"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Strength Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${strengthBadge.bar}`} style={{ width: strengthBadge.width }} />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Estimated Brute-force Difficulty:</span>
            <span className="font-semibold text-slate-700">{result.crackTimeEstimate}</span>
          </div>
        </div>

        {/* Primary Copy Action */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCopy}
            icon={isCopied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          >
            {isCopied ? 'Password Copied!' : 'Copy Password to Clipboard'}
          </Button>
        </div>

      </div>

      {/* Configuration & Options Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
        
        {/* Preset Chips */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-2">Security Presets</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => applyPreset(12, false)}
              className="py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              Easy (12 chars, no symbols)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(16, true)}
              className="py-2 px-2.5 rounded-xl border border-slate-900 bg-slate-900 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Balanced (16 chars, symbols)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(32, true)}
              className="py-2 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              Maximum (32 chars)
            </button>
          </div>
        </div>

        {/* Length Slider & Input */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <label htmlFor="pass-len-slider" className="text-slate-800">
              Password Length: <span className="text-slate-900 font-bold">{length} characters</span>
            </label>
            <input
              type="number"
              min={6}
              max={64}
              value={length}
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) setLength(Math.max(6, Math.min(64, val)));
              }}
              className="w-16 h-8 px-2 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <input
            id="pass-len-slider"
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={e => setLength(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 focus:outline-none"
          />

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>6 (Min)</span>
            <span>16 (Recommended)</span>
            <span>32 (High)</span>
            <span>64 (Max)</span>
          </div>
        </div>

        {/* Character Set Checkboxes */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700 block">Character Sets Included</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={e => setIncludeUpper(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Uppercase Letters</span>
                <span className="text-[11px] text-slate-500 font-mono">A, B, C ... Z</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={e => setIncludeLower(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Lowercase Letters</span>
                <span className="text-[11px] text-slate-500 font-mono">a, b, c ... z</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={e => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Numbers & Digits</span>
                <span className="text-[11px] text-slate-500 font-mono">0, 1, 2 ... 9</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={e => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Special Symbols</span>
                <span className="text-[11px] text-slate-500 font-mono">! @ # $ % ^ & * ...</span>
              </div>
            </label>
          </div>

          {/* Ambiguous Exclusion */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={e => setExcludeAmbiguous(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Exclude Ambiguous Characters</span>
                <span className="text-[11px] text-slate-500">
                  Omits visually similar characters like (1, l, I, 0, O, o, |) to prevent typing confusion.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong className="text-slate-900 font-semibold">Web Crypto API:</strong> Passwords are produced locally using CSPRNG (`crypto.getRandomValues`) with unbiased rejection sampling. Zero server calls, zero database retention, zero logging.
          </p>
        </div>

      </div>
    </div>
  );
};
