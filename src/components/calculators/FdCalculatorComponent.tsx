import React, { useState, useMemo } from 'react';
import {
  calculateFd,
  CompoundingFrequency,
  FdTenureUnit,
  COMPOUNDING_OPTIONS
} from '../../utils/calculators/fdCalculator';
import { formatINR } from '../../utils/formatters/currency';
import { CalculatorInput } from './CalculatorInput';
import { Button } from '../common/Button';
import { RotateCcw, Award } from 'lucide-react';

export const FdCalculatorComponent: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(100000); // ₹1 Lakh default
  const [rate, setRate] = useState<number>(7.1); // 7.1% typical bank FD rate
  const [tenure, setTenure] = useState<number>(5); // 5 years
  const [tenureUnit, setTenureUnit] = useState<FdTenureUnit>('years');
  const [frequency, setFrequency] = useState<CompoundingFrequency>('quarterly');
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);

  const result = useMemo(() => {
    return calculateFd({
      principal,
      annualRate: rate,
      tenure,
      tenureUnit,
      compoundingFrequency: frequency,
      isSeniorCitizen
    });
  }, [principal, rate, tenure, tenureUnit, frequency, isSeniorCitizen]);

  const handleReset = () => {
    setPrincipal(100000);
    setRate(7.1);
    setTenure(5);
    setTenureUnit('years');
    setFrequency('quarterly');
    setIsSeniorCitizen(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Deposit Parameters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              aria-label="Reset FD inputs"
            >
              Reset
            </Button>
          </div>

          {/* Principal Deposit Amount */}
          <CalculatorInput
            id="fd-principal"
            label="Total Investment (Principal)"
            value={principal}
            onChange={setPrincipal}
            min={1000}
            max={50000000}
            step={5000}
            unit="₹"
            presets={[
              { label: '₹25,000', value: 25000 },
              { label: '₹50,000', value: 50000 },
              { label: '₹1 Lakh', value: 100000 },
              { label: '₹5 Lakh', value: 500000 },
              { label: '₹10 Lakh', value: 1000000 }
            ]}
          />

          {/* Base Interest Rate */}
          <CalculatorInput
            id="fd-rate"
            label="Annual Interest Rate (% p.a.)"
            value={rate}
            onChange={setRate}
            min={1.0}
            max={15.0}
            step={0.05}
            unit="%"
            unitPosition="suffix"
            presets={[
              { label: '6.5% (1-2 Yrs)', value: 6.5 },
              { label: '7.0% (3-5 Yrs)', value: 7.0 },
              { label: '7.5% (Special Scheme)', value: 7.5 },
              { label: '8.0% (Small Finance Bank)', value: 8.0 }
            ]}
          />

          {/* Senior Citizen Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">Senior Citizen Special Rate</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Adds statutory +0.50% p.a. premium</span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isSeniorCitizen}
              onClick={() => setIsSeniorCitizen(!isSeniorCitizen)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-sky-400 ${
                isSeniorCitizen ? 'bg-slate-900 dark:bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isSeniorCitizen ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Tenure Unit Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                Deposit Tenure Unit
              </span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
                {(['days', 'months', 'years'] as FdTenureUnit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      if (tenureUnit !== u) {
                        setTenure(u === 'years' ? 5 : u === 'months' ? 60 : 365);
                        setTenureUnit(u);
                      }
                    }}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                      tenureUnit === u
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <CalculatorInput
              id="fd-tenure"
              label={
                tenureUnit === 'years'
                  ? 'Tenure (Years)'
                  : tenureUnit === 'months'
                  ? 'Tenure (Months)'
                  : 'Tenure (Days)'
              }
              value={tenure}
              onChange={setTenure}
              min={1}
              max={tenureUnit === 'years' ? 10 : tenureUnit === 'months' ? 120 : 3650}
              step={1}
              unit={tenureUnit === 'years' ? 'Yrs' : tenureUnit === 'months' ? 'Mos' : 'Days'}
              unitPosition="suffix"
              presets={
                tenureUnit === 'years'
                  ? [
                      { label: '1 Yr', value: 1 },
                      { label: '3 Yrs', value: 3 },
                      { label: '5 Yrs (Tax Saver)', value: 5 },
                      { label: '10 Yrs', value: 10 }
                    ]
                  : tenureUnit === 'months'
                  ? [
                      { label: '12 Mos', value: 12 },
                      { label: '24 Mos', value: 24 },
                      { label: '36 Mos', value: 36 },
                      { label: '60 Mos', value: 60 }
                    ]
                  : [
                      { label: '180 Days', value: 180 },
                      { label: '365 Days', value: 365 },
                      { label: '730 Days', value: 730 }
                    ]
              }
            />
          </div>

          {/* Compounding Frequency */}
          <div className="space-y-1.5">
            <label htmlFor="fd-compounding-select" className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              Compounding Frequency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMPOUNDING_OPTIONS.map((period) => {
                const isSelected = frequency === period.id;
                return (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => setFrequency(period.id)}
                    className={`p-2 rounded-xl border text-xs font-semibold transition-all min-h-[38px] ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500 shadow-2xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {period.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Quarterly compounding is standard across most Indian banks (SBI, HDFC, ICICI).</p>
          </div>
        </div>

        {/* Right Maturity Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Maturity Amount
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight mt-1">
                {formatINR(result.maturityAmount)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Effective Yield: {result.effectiveYield}% p.a.
              </p>
            </div>

            {/* Breakdown */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Principal Deposit</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatINR(result.principal)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Total Interest Earned</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">+{formatINR(result.interestEarned)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Applied Interest Rate</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {result.appliedRate}% p.a. {result.isSeniorCitizen && '(+0.50% Sr. Citizen)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-900 dark:text-slate-100 font-bold pt-2 border-t border-slate-100 dark:border-slate-800 text-sm sm:text-base">
                <span>Maturity Value</span>
                <span>{formatINR(result.maturityAmount)}</span>
              </div>
            </div>

            {/* Visual Distribution */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Principal vs Interest</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div
                  style={{ width: `${result.principalPercent}%` }}
                  className="bg-slate-900 dark:bg-sky-500 transition-all duration-300"
                  title={`Principal: ${result.principalPercent}%`}
                />
                <div
                  style={{ width: `${result.interestPercent}%` }}
                  className="bg-emerald-600 dark:bg-emerald-500 transition-all duration-300"
                  title={`Interest: ${result.interestPercent}%`}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Principal ({result.principalPercent}%)</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">Interest ({result.interestPercent}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
