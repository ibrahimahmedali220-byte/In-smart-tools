import React, { useState, useMemo } from 'react';
import { calculateEmi } from '../../utils/calculators/emiCalculator';
import { formatINR } from '../../utils/formatters/currency';
import { CalculatorInput } from './CalculatorInput';
import { DistributionBar } from './DistributionBar';
import { Button } from '../common/Button';
import { RotateCcw, Table, Layers, CheckCircle2 } from 'lucide-react';

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
      color: 'bg-slate-900'
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
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Loan Parameters</h2>
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

          {/* 1. Loan Amount */}
          <CalculatorInput
            id="emi-principal"
            label="Loan Amount"
            value={principal}
            onChange={setPrincipal}
            min={10000}
            max={20000000}
            step={50000}
            unit="₹"
            unitPosition="prefix"
            presets={[
              { label: '₹10L', value: 1000000 },
              { label: '₹25L', value: 2500000 },
              { label: '₹50L', value: 5000000 },
              { label: '₹1 Cr', value: 10000000 }
            ]}
            helperText="Total borrowed loan principal"
          />

          {/* 2. Interest Rate */}
          <CalculatorInput
            id="emi-rate"
            label="Interest Rate (p.a.)"
            value={rate}
            onChange={setRate}
            min={0}
            max={25}
            step={0.1}
            unit="%"
            unitPosition="suffix"
            presets={[
              { label: '7.5%', value: 7.5 },
              { label: '8.5%', value: 8.5 },
              { label: '9.5%', value: 9.5 },
              { label: '12%', value: 12.0 }
            ]}
            helperText="Annual percentage lending rate"
          />

          {/* 3. Loan Tenure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-800">Tenure Mode</span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    if (tenureUnit === 'months') {
                      setTenure(Math.max(1, Math.round(tenure / 12)));
                      setTenureUnit('years');
                    }
                  }}
                  className={`text-xs px-3 py-1 font-medium rounded-md transition-colors ${
                    tenureUnit === 'years'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
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
                  className={`text-xs px-3 py-1 font-medium rounded-md transition-colors ${
                    tenureUnit === 'months'
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Months
                </button>
              </div>
            </div>

            <CalculatorInput
              id="emi-tenure"
              label={`Loan Tenure (${tenureUnit === 'years' ? 'Years' : 'Months'})`}
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
                      { label: '60 Mos', value: 60 },
                      { label: '120 Mos', value: 120 },
                      { label: '240 Mos', value: 240 }
                    ]
              }
            />
          </div>
        </div>

        {/* Right Output & Breakdown Section (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Monthly Loan Installment
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                {formatINR(result.monthlyEmi)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Payable monthly for {result.tenureMonths} installments
              </p>
            </div>

            <div className="border-t border-slate-800 pt-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Interest Payable</span>
                <span className="font-semibold text-amber-400">{formatINR(result.totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Payment (Principal + Interest)</span>
                <span className="font-semibold text-white">{formatINR(result.totalAmount)}</span>
              </div>
            </div>

            {/* Visual stacked distribution */}
            <div className="border-t border-slate-800 pt-5">
              <div className="text-xs font-semibold text-slate-400 mb-2">Payment Distribution</div>
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

          {/* Quick Toggle for Amortization Schedule */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
              <Table className="w-4 h-4 text-slate-600" />
              <span>Yearly Amortization Schedule</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAmortization(!showAmortization)}
            >
              {showAmortization ? 'Hide Table' : 'View Schedule'}
            </Button>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Section */}
      {showAmortization && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Yearly Amortization Breakdown</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Principal and interest repayment schedule over {result.yearlySchedule.length} years
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              Total {result.tenureMonths} Months
            </span>
          </div>

          <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
            <table className="w-full text-xs text-left text-slate-700 min-w-[500px]">
              <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                <tr>
                  <th scope="col" className="py-3 px-3">Period</th>
                  <th scope="col" className="py-3 px-3">Principal Paid</th>
                  <th scope="col" className="py-3 px-3">Interest Paid</th>
                  <th scope="col" className="py-3 px-3">Total Payment</th>
                  <th scope="col" className="py-3 px-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.yearlySchedule.map(row => (
                  <tr key={row.period} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{row.label}</td>
                    <td className="py-2.5 px-3 text-slate-800">{formatINR(row.principalPaid)}</td>
                    <td className="py-2.5 px-3 text-amber-700 font-medium">{formatINR(row.interestPaid)}</td>
                    <td className="py-2.5 px-3 text-slate-900 font-medium">{formatINR(row.totalPayment)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-900">{formatINR(row.remainingBalance)}</td>
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
