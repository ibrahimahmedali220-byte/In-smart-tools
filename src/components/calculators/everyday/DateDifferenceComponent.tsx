import React, { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import {
  calculateDateDifference,
  DateDifferenceResult
} from '../../../utils/calculators/dateDifference';
import { safeClipboardCopy } from '../../../utils/security';
import {
  CalendarDays,
  ArrowRightLeft,
  Copy,
  CheckCircle2,
  RotateCcw,
  Clock,
  Briefcase,
  Calendar,
  Info
} from 'lucide-react';

export const DateDifferenceComponent: React.FC = () => {
  const { showToast } = useToast();

  // Helper for today in YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const [startDate, setStartDate] = useState<string>(getTodayStr());
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });

  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const diffResult: DateDifferenceResult = useMemo(() => {
    return calculateDateDifference(startDate, endDate, mode);
  }, [startDate, endDate, mode]);

  const handleSwap = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
    showToast('Swapped dates.', 'info');
  };

  const handleReset = () => {
    setStartDate(getTodayStr());
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    setEndDate(d.toISOString().split('T')[0]);
    setMode('exclusive');
    showToast('Dates reset.', 'info');
  };

  const handleCopySummary = async () => {
    if (!diffResult.isValid) return;
    const summaryText = `Duration: ${diffResult.calendarSummary} (${mode === 'inclusive' ? diffResult.totalDaysInclusive : diffResult.totalDaysExclusive} total days, ${mode === 'inclusive' ? diffResult.workingDaysInclusive : diffResult.workingDaysExclusive} working days)`;
    const ok = await safeClipboardCopy(summaryText);
    if (ok) {
      setIsCopied(true);
      showToast('Date difference copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const applyQuickPreset = (preset: 'endOfYear' | 'oneMonth' | 'oneYear' | 'hundredDays') => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setStartDate(todayStr);

    const target = new Date(today);
    if (preset === 'endOfYear') {
      target.setMonth(11, 31);
    } else if (preset === 'oneMonth') {
      target.setMonth(target.getMonth() + 1);
    } else if (preset === 'oneYear') {
      target.setFullYear(target.getFullYear() + 1);
    } else if (preset === 'hundredDays') {
      target.setDate(target.getDate() + 100);
    }
    setEndDate(target.toISOString().split('T')[0]);
  };

  const totalDays = mode === 'inclusive' ? diffResult.totalDaysInclusive : diffResult.totalDaysExclusive;
  const workingDays = mode === 'inclusive' ? diffResult.workingDaysInclusive : diffResult.workingDaysExclusive;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Date Pickers Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Preset Chips */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-2">Quick Shortcuts from Today</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyQuickPreset('oneMonth')}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              +1 Month
            </button>
            <button
              type="button"
              onClick={() => applyQuickPreset('hundredDays')}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              +100 Days
            </button>
            <button
              type="button"
              onClick={() => applyQuickPreset('endOfYear')}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              End of Year (Dec 31)
            </button>
            <button
              type="button"
              onClick={() => applyQuickPreset('oneYear')}
              className="py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              +1 Full Year
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center pt-2">
          
          {/* Start Date */}
          <div className="md:col-span-5 space-y-1">
            <label htmlFor="start-date-input" className="block text-xs font-semibold text-slate-700">
              Start Date
            </label>
            <input
              id="start-date-input"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap start and end dates"
              className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* End Date */}
          <div className="md:col-span-5 space-y-1">
            <label htmlFor="end-date-input" className="block text-xs font-semibold text-slate-700">
              End Date
            </label>
            <input
              id="end-date-input"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

        </div>

        {/* Inverted warning if applicable */}
        {diffResult.isInverted && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Note: Start date is after End date. Calculating absolute duration backwards in time.</span>
          </div>
        )}

        {/* Calculation Mode Toggle (Inclusive vs Exclusive) */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-900 block">Calculation Method</span>
            <span className="text-[11px] text-slate-500">
              {mode === 'exclusive'
                ? 'Exclusive: Standard interval count (End Date - Start Date)'
                : 'Inclusive: Includes both the start day and the end day (+1 day)'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('exclusive')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                mode === 'exclusive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exclusive
            </button>
            <button
              type="button"
              onClick={() => setMode('inclusive')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                mode === 'inclusive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inclusive (+1)
            </button>
          </div>
        </div>

      </div>

      {/* Primary Result Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Big Highlight: Calendar Breakdown */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Exact Calendar Duration
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {diffResult.calendarSummary}
          </div>
          <p className="text-xs text-slate-500">
            Accounts for varying month lengths, February leap days, and Gregorian calendar rules.
          </p>
        </div>

        {/* Aggregate Breakdown Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Days</span>
            <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
              {totalDays.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block">{mode}</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Weeks & Days</span>
            <span className="text-base sm:text-lg font-bold text-slate-900">
              {diffResult.totalWeeks}w {diffResult.remainingDaysAfterWeeks}d
            </span>
            <span className="text-[10px] text-slate-400 block">7-day cycles</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Working Days</span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 font-mono">
              {workingDays.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block">Mon – Fri</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Hours</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
              {diffResult.totalHours.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 block">Continuous</span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySummary}
            icon={isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {isCopied ? 'Summary Copied' : 'Copy Summary'}
          </Button>
        </div>

      </div>

    </div>
  );
};
