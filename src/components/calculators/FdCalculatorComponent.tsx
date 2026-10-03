import React, { useState, useMemo } from 'react';
import {
  calculateFd,
  CompoundingFrequency,
  FdTenureUnit,
  COMPOUNDING_PERIODS
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
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Deposit Parameters</h2>
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
            label="Total Fixed Deposit Amount"
            value={principal}
            onChange={setPrincipal}
            min={5000}
            max={20000000}
            step={5000}
            unit="₹"
            unitPosition="prefix"
            presets={[
              { label: '₹25,000', value: 25000 },
              { label: '₹50,000', value: 50000 },
              { label: '₹1 Lakh', value: 100000 },
              { label: '₹5 Lakh', value: 500000 },
              { label: '₹10 Lakh', value: 1000000 }
            ]}
            helperText="Initial deposit principal"
          />

          {/* Interest Rate */}
          <div className="space-y-3">
            <CalculatorInput
              id="fd-rate"
              label="Interest Rate (p.a.)"
              value={rate}
              onChange={setRate}
              min={1}
              max={15}
              step={0.1}
              unit="%"
              unitPosition="suffix"
              presets={[
                { label: '6.5%', value: 6.5 },
                { label: '7.1%', value: 7.1 },
                { label: '7.5%', value: 7.5 }
              ]}
              helperText="Current standard bank FD rates range between 6.5% – 7.5%"
            />

            {/* Senior Citizen Toggle */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-semibold text-slate-900">
                  Senior Citizen Rate (+0.50% preferential bonus)
                </span>
              </div>
              <input
                id="senior-toggle"
                type="checkbox"
                checked={isSeniorCitizen}
                onChange={e => setIsSeniorCitizen(e.target.checked)}
                aria-label="Toggle senior citizen preferential rate bonus"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              />
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-800">Deposit Tenure</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {(['years', 'months', 'days'] as FdTenureUnit[]).map(unit => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => {
                      if (tenureUnit !== unit) {
                        setTenureUnit(unit);
                        if (unit === 'years') setTenure(5);
                        else if (unit === 'months') setTenure(60);
                        else setTenure(365);
                      }
                    }}
                    className={`text-xs px-2.5 py-1 font-medium capitalize rounded-md transition-colors ${
                      tenureUnit === unit
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            <CalculatorInput
              id="fd-tenure"
              label={`Tenure in ${tenureUnit.charAt(0).toUpperCase() + tenureUnit.slice(1)}`}
              value={tenure}
              onChange={setTenure}
              min={1}
              max={tenureUnit === 'years' ? 25 : tenureUnit === 'months' ? 300 : 3650}
              step={1}
              unit={tenureUnit === 'years' ? 'Yrs' : tenureUnit === 'months' ? 'Mos' : 'Days'}
              unitPosition="suffix"
              presets={
                tenureUnit === 'years'
                  ? [
                      { label: '1 Yr', value: 1 },
                      { label: '3 Yrs', value: 3 },
                      { label: '5 Yrs', value: 5 },
                      { label: '10 Yrs', value: 10 }
                    ]
                  : [
                      { label: '12 Mos', value: 12 },
                      { label: '36 Mos', value: 36 },
                      { label: '60 Mos', value: 60 }
                    ]
              }
            />
          </div>

          {/* Compounding Frequency Selection */}
          <div className="space-y-1.5">
            <label htmlFor="fd-compounding-frequency" className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight block">
              Compounding Frequency
            </label>
            <select
              id="fd-compounding-frequency"
              value={frequency}
              onChange={e => setFrequency(e.target.value as CompoundingFrequency)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
            >
              {Object.entries(COMPOUNDING_PERIODS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Output Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Total Maturity Amount
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 text-emerald-400">
                {formatINR(result.maturityAmount)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                At {result.effectiveRate}% annual interest {isSeniorCitizen ? '(Senior Citizen)' : ''}
              </p>
            </div>

            <div className="border-t border-slate-800 pt-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Initial Principal Amount</span>
                <span className="font-semibold text-white">{formatINR(result.principal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Interest Earned</span>
                <span className="font-semibold text-amber-400">+{formatINR(result.interestEarned)}</span>
              </div>
            </div>

            {/* Distribution */}
            <div className="border-t border-slate-800 pt-5">
              <div className="text-xs font-semibold text-slate-400 mb-2">Deposit vs Interest Share</div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
                <div style={{ width: `${result.principalPercent}%` }} className="bg-white" />
                <div style={{ width: `${result.interestPercent}%` }} className="bg-amber-500" />
              </div>
              <div className="flex justify-between text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-white rounded-sm inline-block" /> Principal ({result.principalPercent}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm inline-block" /> Interest ({result.interestPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
