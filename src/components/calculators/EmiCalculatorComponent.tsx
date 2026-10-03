import React, { useState, useMemo } from 'react';
import { calculateEmi } from '../../utils/calculators/emiCalculator';
import { formatINR } from '../../utils/formatters/currency';
import { CalculatorInput } from './CalculatorInput';
import { DistributionBar } from './DistributionBar';
import { Button } from '../common/Button';
import { RotateCcw, Table, Layers } from 'lucide-react';

export const EmiCalculatorComponent: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(2500000); // ₹25 Lakhs default
  const [rate, setRate] = useState<number>(8.5); // 8.5% default home loan rate
  const [tenure, setTenure] = useState<number>(20); // 20 years default
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  const result = useMemo(() => {
    return calculateEmi({
      principal,
      annualRate: rate,
      tenure,
      tenureUnit
    });
  }, [principal, rate, tenure, tenureUnit]);

  const handleReset = () => {
    setPrincipal(2500000);
    setRate(8.5);
    setTenure(20);
    setTenureUnit('years');
  };

  const distributionItems = [
    {
      label: 'Principal Amount',
      amount: formatINR(result.principal),
      percentage: result.principalPercent,
      color: 'bg-slate-900 dark:bg-sky-500'
    },
    {
      label: 'Total Interest',
      amount: formatINR(result.totalInterest),
      percentage: result.interestPercent,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Interactive Calculator Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Section (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Loan Parameters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              aria-label="Reset loan calculator inputs"
            >
              Reset
            </Button>
          </div>

          <div className="space-y-6">
            {/* Principal Amount */}
            <CalculatorInput
              id="loan-principal"
              label="Loan Amount (Principal)"
              value={principal}
              onChange={setPrincipal}
              min={10000}
              max={20000000}
              step={25000}
              unit="₹"
              presets={[
                { label: '₹10 Lakh', value: 1000000 },
                { label: '₹25 Lakh', value: 2500000 },
                { label: '₹50 Lakh', value: 5000000 },
                { label: '₹75 Lakh', value: 7500000 },
                { label: '₹1 Crore', value: 10000000 }
              ]}
            />

            {/* Interest Rate */}
            <CalculatorInput
              id="loan-rate"
              label="Annual Interest Rate (% p.a.)"
              value={rate}
              onChange={setRate}
              min={1.0}
              max={30.0}
              step={0.05}
              unit="%"
              unitPosition="suffix"
              presets={[
                { label: '8.5% (Home)', value: 8.5 },
                { label: '9.0% (Car)', value: 9.0 },
                { label: '10.5% (Personal)', value: 10.5 },
                { label: '12.0% (NBFC)', value: 12.0 }
              ]}
            />

            {/* Tenure with Unit Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Loan Tenure Unit
                </span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      if (tenureUnit === 'months') {
                        setTenure(Math.max(1, Math.round(tenure / 12)));
                        setTenureUnit('years');
                      }
                    }}
                    className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                      tenureUnit === 'years'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Years
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (tenureUnit === 'years') {
                        setTenure(tenure * 12);
                        setTenureUnit('months');
                      }
                    }}
                    className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                      tenureUnit === 'months'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Months
                  </button>
                </div>
              </div>

              <CalculatorInput
                id="loan-tenure"
                label={tenureUnit === 'years' ? 'Tenure in Years' : 'Tenure in Months'}
                value={tenure}
                onChange={setTenure}
                min={1}
                max={tenureUnit === 'years' ? 30 : 360}
                step={1}
                unit={tenureUnit === 'years' ? 'Yrs' : 'Mos'}
                unitPosition="suffix"
                presets={
                  tenureUnit === 'years'
                    ? [
                        { label: '5 Yrs', value: 5 },
                        { label: '10 Yrs', value: 10 },
                        { label: '15 Yrs', value: 15 },
                        { label: '20 Yrs', value: 20 },
                        { label: '30 Yrs', value: 30 }
                      ]
                    : [
                        { label: '12 Mos', value: 12 },
                        { label: '24 Mos', value: 24 },
                        { label: '36 Mos', value: 36 },
                        { label: '60 Mos', value: 60 }
                      ]
                }
              />
            </div>
          </div>
        </div>

        {/* Right Summary Section (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Monthly Repayment
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                {formatINR(result.monthlyEmi)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Equated Monthly Installment (EMI)</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Principal Amount</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatINR(result.principal)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Total Interest Payable</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{formatINR(result.totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-900 dark:text-slate-100 font-bold pt-2 border-t border-slate-100 dark:border-slate-800 text-sm sm:text-base">
                <span>Total Payment (Principal + Interest)</span>
                <span>{formatINR(result.totalAmount)}</span>
              </div>
            </div>

            {/* Distribution Stacked Bar */}
            <div className="pt-2">
              <DistributionBar
                items={distributionItems}
                title="Repayment Breakdown"
              />
            </div>

            {/* Toggle Amortization View */}
            <div className="pt-2">
              <Button
                variant={showAmortization ? 'secondary' : 'outline'}
                size="sm"
                fullWidth
                onClick={() => setShowAmortization(!showAmortization)}
                icon={<Table className="w-4 h-4" />}
              >
                {showAmortization ? 'Hide Amortization Schedule' : 'View Yearly Amortization Schedule'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Amortization Schedule Table */}
      {showAmortization && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-4 animate-in fade-in-0 duration-200 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-800 dark:text-sky-400" />
                <span>Year-by-Year Amortization Schedule</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Principal and interest paid across the {result.tenureMonths} month loan term.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3 text-right">Principal Paid</th>
                  <th className="py-2.5 px-3 text-right">Interest Paid</th>
                  <th className="py-2.5 px-3 text-right">Total Annual Payment</th>
                  <th className="py-2.5 px-3 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px] sm:text-xs">
                {result.yearlySchedule.map((row) => (
                  <tr key={row.period} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">Year {row.period}</td>
                    <td className="py-2.5 px-3 text-right text-slate-900 dark:text-slate-100">{formatINR(row.principalPaid)}</td>
                    <td className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400">{formatINR(row.interestPaid)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-800 dark:text-slate-200 font-semibold">{formatINR(row.totalPayment)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">{formatINR(row.remainingBalance)}</td>
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
