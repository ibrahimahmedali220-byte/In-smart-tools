import React, { useState, useMemo } from 'react';
import { calculateSip } from '../../utils/calculators/sipCalculator';
import { formatINR } from '../../utils/formatters/currency';
import { CalculatorInput } from './CalculatorInput';
import { Button } from '../common/Button';
import { RotateCcw, AlertCircle, Table } from 'lucide-react';

export const SipCalculatorComponent: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000); // ₹5,000/month
  const [annualReturn, setAnnualReturn] = useState<number>(12); // 12% standard equity mutual fund benchmark
  const [duration, setDuration] = useState<number>(10); // 10 years
  const [durationUnit, setDurationUnit] = useState<'years' | 'months'>('years');
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState<boolean>(false);

  const result = useMemo(() => {
    return calculateSip({
      monthlyInvestment,
      expectedAnnualReturn: annualReturn,
      duration,
      durationUnit
    });
  }, [monthlyInvestment, annualReturn, duration, durationUnit]);

  const handleReset = () => {
    setMonthlyInvestment(5000);
    setAnnualReturn(12);
    setDuration(10);
    setDurationUnit('years');
  };

  return (
    <div className="space-y-8">
      {/* Main Calculator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Investment Strategy</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              aria-label="Reset SIP inputs"
            >
              Reset
            </Button>
          </div>

          {/* Monthly Investment */}
          <CalculatorInput
            id="sip-monthly"
            label="Monthly Investment Amount"
            value={monthlyInvestment}
            onChange={setMonthlyInvestment}
            min={500}
            max={200000}
            step={500}
            unit="₹"
            unitPosition="prefix"
            presets={[
              { label: '₹1,000', value: 1000 },
              { label: '₹2,500', value: 2500 },
              { label: '₹5,000', value: 5000 },
              { label: '₹10,000', value: 10000 },
              { label: '₹25,000', value: 25000 }
            ]}
          />

          {/* Expected Return Rate */}
          <CalculatorInput
            id="sip-return"
            label="Expected Annual Return (% p.a.)"
            value={annualReturn}
            onChange={setAnnualReturn}
            min={1.0}
            max={30.0}
            step={0.1}
            unit="%"
            unitPosition="suffix"
            presets={[
              { label: '8% (Debt)', value: 8.0 },
              { label: '12% (Index)', value: 12.0 },
              { label: '14% (Flexi-cap)', value: 14.0 },
              { label: '16% (Small-cap)', value: 16.0 }
            ]}
            helperText="Past market averages range from 10% to 15% across broad equity indices over 7+ years."
          />

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                Investment Duration Unit
              </span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    if (durationUnit === 'months') {
                      setDuration(Math.max(1, Math.round(duration / 12)));
                      setDurationUnit('years');
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                    durationUnit === 'years'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Years
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (durationUnit === 'years') {
                      setDuration(duration * 12);
                      setDurationUnit('months');
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                    durationUnit === 'months'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Months
                </button>
              </div>
            </div>

            <CalculatorInput
              id="sip-duration"
              label={durationUnit === 'years' ? 'Time Horizon (Years)' : 'Time Horizon (Months)'}
              value={duration}
              onChange={setDuration}
              min={1}
              max={durationUnit === 'years' ? 40 : 480}
              step={1}
              unit={durationUnit === 'years' ? 'Yrs' : 'Mos'}
              unitPosition="suffix"
              presets={
                durationUnit === 'years'
                  ? [
                      { label: '3 Yrs', value: 3 },
                      { label: '5 Yrs', value: 5 },
                      { label: '10 Yrs', value: 10 },
                      { label: '15 Yrs', value: 15 },
                      { label: '20 Yrs', value: 20 }
                    ]
                  : [
                      { label: '12 Mos', value: 12 },
                      { label: '36 Mos', value: 36 },
                      { label: '60 Mos', value: 60 }
                    ]
              }
            />
          </div>
        </div>

        {/* Right Summary Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Expected Future Value
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight mt-1">
                {formatINR(result.totalMaturityAmount)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total estimated wealth accumulated</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Invested Amount</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatINR(result.totalInvested)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Estimated Returns (Wealth Gain)</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">+{formatINR(result.estimatedReturns)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-900 dark:text-slate-100 font-bold pt-2 border-t border-slate-100 dark:border-slate-800 text-sm sm:text-base">
                <span>Wealth Multiplier</span>
                <span>{result.wealthMultiplier}x Total Invested</span>
              </div>
            </div>

            {/* Visual Wealth Gain Distribution */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Investment Ratio</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div
                  style={{ width: `${result.investedPercent}%` }}
                  className="bg-slate-900 dark:bg-sky-500 transition-all duration-300"
                  title={`Invested: ${result.investedPercent}%`}
                />
                <div
                  style={{ width: `${result.returnsPercent}%` }}
                  className="bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
                  title={`Gains: ${result.returnsPercent}%`}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-sky-500" />
                  Invested ({result.investedPercent}%)
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                  Returns ({result.returnsPercent}%)
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant={showYearlyBreakdown ? 'secondary' : 'outline'}
                size="sm"
                fullWidth
                onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)}
                icon={<Table className="w-4 h-4" />}
              >
                {showYearlyBreakdown ? 'Hide Yearly Growth Breakdown' : 'View Yearly Growth Breakdown'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Growth Progression Table */}
      {showYearlyBreakdown && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-4 animate-in fade-in-0 duration-200 transition-colors">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Year-by-Year Wealth Progression</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Watch compounding accelerate returns over a {result.durationMonths} month horizon.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">End of Year</th>
                  <th className="py-2.5 px-3 text-right">Cumulative Invested</th>
                  <th className="py-2.5 px-3 text-right">Accumulated Gains</th>
                  <th className="py-2.5 px-3 text-right">Total Portfolio Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px] sm:text-xs">
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">Year {row.year}</td>
                    <td className="py-2.5 px-3 text-right text-slate-900 dark:text-slate-100">{formatINR(row.invested)}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">+{formatINR(row.returns)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-900 dark:text-slate-100 font-bold">{formatINR(row.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEBI Compliance Notice */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Mutual Fund Disclaimer:</strong> Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing. Calculation results assume a constant periodic rate of return for illustrative purposes. Actual market returns fluctuate based on portfolio asset allocations.
        </p>
      </div>
    </div>
  );
};
