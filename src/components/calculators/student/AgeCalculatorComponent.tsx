import React, { useState, useMemo } from 'react';
import { calculateAge } from '../../../utils/calculators/ageCalculator';
import { Button } from '../../common/Button';
import { RotateCcw, Calendar, Cake, ShieldCheck, Sparkles } from 'lucide-react';

export const AgeCalculatorComponent: React.FC = () => {
  // Get today in YYYY-MM-DD format
  const getTodayString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [dob, setDob] = useState<string>('2000-01-15');
  const [targetDate, setTargetDate] = useState<string>(getTodayString());

  const result = useMemo(() => {
    return calculateAge({ dobString: dob, targetDateString: targetDate });
  }, [dob, targetDate]);

  const handleReset = () => {
    setDob('2000-01-15');
    setTargetDate(getTodayString());
  };

  // Quick preset for Sarkari exam cutoff dates (e.g., 1st August 2026 or 1st Jan 2026)
  const applyCutoff = (monthDay: string) => {
    const currentYear = new Date().getFullYear();
    setTargetDate(`${currentYear}-${monthDay}`);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Section (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Date Parameters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              aria-label="Reset age calculator inputs"
            >
              Reset
            </Button>
          </div>

          {/* 1. Date of Birth */}
          <div className="space-y-1.5">
            <label htmlFor="age-dob" className="block text-xs sm:text-sm font-semibold text-slate-800">
              Date of Birth (DOB)
            </label>
            <div className="relative flex items-center">
              <input
                id="age-dob"
                type="date"
                value={dob}
                max={targetDate}
                onChange={e => setDob(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Enter your actual birth date as registered in official certificates
            </p>
          </div>

          {/* 2. Target Date / Age as of */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="age-target" className="text-xs sm:text-sm font-semibold text-slate-800">
                Age as of Date
              </label>
              <button
                type="button"
                onClick={() => setTargetDate(getTodayString())}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline"
              >
                Set to Today
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                id="age-target"
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            
            {/* Cutoff Date Presets for Sarkari Exams */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                Popular Sarkari Exam Cutoff Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyCutoff('08-01')}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors"
                >
                  1st August (UPSC/SSC)
                </button>
                <button
                  type="button"
                  onClick={() => applyCutoff('01-01')}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors"
                >
                  1st January
                </button>
                <button
                  type="button"
                  onClick={() => applyCutoff('07-01')}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors"
                >
                  1st July
                </button>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            <p>100% private: Your date of birth is processed locally in your browser runtime and is never transmitted or saved.</p>
          </div>
        </div>

        {/* Right Output Section (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {result.isValid ? (
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Exact Chronological Age
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 text-emerald-400">
                  {result.years} Years, {result.months} Months, {result.days} Days
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Calendar-accurate elapsed duration as of {targetDate}
                </p>
              </div>

              {/* Detailed Metrics Breakdown */}
              <div className="grid grid-cols-3 gap-2 border-t border-slate-800 pt-5 text-center">
                <div className="bg-slate-800/80 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-medium">Total Months</span>
                  <span className="text-base sm:text-lg font-bold text-white font-mono">{result.totalMonths.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-medium">Total Weeks</span>
                  <span className="text-base sm:text-lg font-bold text-white font-mono">{result.totalWeeks.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-medium">Total Days</span>
                  <span className="text-base sm:text-lg font-bold text-white font-mono">{result.totalDays.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Next Birthday Milestone */}
              <div className="border-t border-slate-800 pt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Cake className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Upcoming Birthday</span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      In {result.nextBirthday.monthsRemaining} months, {result.nextBirthday.daysRemaining} days ({result.nextBirthday.dayOfWeek})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-red-200 p-6 sm:p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-red-600">{result.errorMessage || 'Invalid dates'}</p>
              <p className="text-xs text-slate-500">Please choose a valid birth date on or before the target date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
