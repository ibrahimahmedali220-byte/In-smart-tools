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
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Investment Strategy</h2>
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
              { label: '₹2,500', value: 2500 },
              { label: '₹5,000', value: 5000 },
              { label: '₹10,000', value: 10000 },
              { label: '₹25,000', value: 25000 }
            ]}
            helperText="Monthly SIP installment"
          />

          {/* Expected Annual Return */}
          <CalculatorInput
            id="sip-return"
            label="Expected Annual Return"
            value={annualReturn}
            onChange={setAnnualReturn}
            min={1}
            max={30}
            step={0.5}
            unit="%"
            unitPosition="suffix"
            presets={[
              { label: '10% (Conservative)', value: 10 },
              { label: '12% (Balanced)', value: 12 },
              { label: '15% (Aggressive)', value: 15 }
            ]}
            helperText="Historical mutual fund returns typically range between 10%–14%"
          />

          {/* Investment Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-800">Time Horizon</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    if (durationUnit === 'months') {
                      setDuration(Math.max(1, Math.round(duration / 12)));
                      setDurationUnit('years');
                    }
                  }}
                  className={`text-xs px-3 py-1 font-medium rounded-md transition-colors ${
                    durationUnit === 'years'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
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
                  className={`text-xs px-3 py-1 font-medium rounded-md transition-colors ${
                    durationUnit === 'months'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Months
                </button>
              </div>
            </div>

            <CalculatorInput
              id="sip-duration"
              label={`Investment Duration (${durationUnit === 'years' ? 'Years' : 'Months'})`}
              value={duration}
              onChange={setDuration}
              min={1}
              max={durationUnit === 'years' ? 35 : 420}
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
                      { label: '36 Mos', value: 36 },
                      { label: '60 Mos', value: 60 },
                      { label: '120 Mos', value: 120 }
                    ]
              }
            />
          </div>
        </div>

        {/* Right Results Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Estimated Maturity Wealth
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                {formatINR(result.estimatedFinalValue)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Projected value after {duration} {durationUnit} of compounding
              </p>
            </div>

            <div className="border-t border-slate-800 pt-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Invested Amount</span>
                <span className="font-semibold text-white">{formatINR(result.totalInvested)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Estimated Wealth Gain</span>
                <span className="font-semibold text-emerald-400">+{formatINR(result.estimatedReturns)}</span>
              </div>
            </div>

            {/* Visual breakdown bar */}
            <div className="border-t border-slate-800 pt-5">
              <div className="text-xs font-semibold text-slate-400 mb-2">Growth Distribution</div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
                <div style={{ width: `${result.investedPercent}%` }} className="bg-white" />
                <div style={{ width: `${result.returnsPercent}%` }} className="bg-emerald-500" />
              </div>
              <div className="flex justify-between text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-white rounded-sm inline-block" /> Invested ({result.investedPercent}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block" /> Returns ({result.returnsPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Contextual Legal Disclaimer */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              Returns shown are estimates based on the rate entered and are not guaranteed. Actual investment returns can vary depending on market conditions.
            </p>
          </div>

          {/* Yearly Growth Toggle */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <Table className="w-4 h-4 text-slate-600" />
              <span>Year-by-Year Growth Table</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)}
            >
              {showYearlyBreakdown ? 'Hide Table' : 'View Table'}
            </Button>
          </div>
        </div>
      </div>

      {/* Year-by-Year Table */}
      {showYearlyBreakdown && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Yearly Wealth Accumulation</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Principal invested vs estimated compounding returns over time
              </p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
            <table className="w-full text-xs text-left text-slate-700 min-w-[450px]">
              <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-3 px-3">Year</th>
                  <th scope="col" className="py-3 px-3">Total Invested</th>
                  <th scope="col" className="py-3 px-3">Estimated Wealth</th>
                  <th scope="col" className="py-3 px-3 text-right">Wealth Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.yearlyBreakdown.map(row => (
                  <tr key={row.year} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">Year {row.year}</td>
                    <td className="py-2.5 px-3 text-slate-800">{formatINR(row.investedAmount)}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{formatINR(row.estimatedWealth)}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-medium">+{formatINR(row.returnsEarned)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
