import React, { useState, useMemo } from 'react';
import {
  calculateSalary,
  FinancialYear,
  TaxRegime
} from '../../utils/calculators/salaryCalculator';
import { formatINR } from '../../utils/formatters/currency';
import { CalculatorInput } from './CalculatorInput';
import { Button } from '../common/Button';
import { RotateCcw, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

export const SalaryCalculatorComponent: React.FC = () => {
  const [annualCtc, setAnnualCtc] = useState<number>(900000); // ₹9 Lakhs CTC default
  const [financialYear, setFinancialYear] = useState<FinancialYear>('FY 2025-26');
  const [regime, setRegime] = useState<TaxRegime>('new');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [customBasic, setCustomBasic] = useState<number>(0);
  const [customPt, setCustomPt] = useState<number>(200);

  const result = useMemo(() => {
    return calculateSalary({
      annualCtc,
      financialYear,
      regime,
      customBasicSalary: customBasic > 0 ? customBasic : undefined,
      customPtMonthly: customPt
    });
  }, [annualCtc, financialYear, regime, customBasic, customPt]);

  const handleReset = () => {
    setAnnualCtc(900000);
    setFinancialYear('FY 2025-26');
    setRegime('new');
    setCustomBasic(0);
    setCustomPt(200);
  };

  return (
    <div className="space-y-8">
      {/* Financial Year & Regime Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2">
          <label htmlFor="salary-fy-select" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Financial Year:</label>
          <select
            id="salary-fy-select"
            value={financialYear}
            onChange={e => setFinancialYear(e.target.value as FinancialYear)}
            className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-sky-400"
          >
            <option value="FY 2025-26">FY 2025-26 (AY 2026-27)</option>
            <option value="FY 2026-27">FY 2026-27 (AY 2027-28)</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setRegime('new')}
            className={`text-xs px-3 py-1.5 font-semibold rounded-lg transition-colors min-h-[32px] ${
              regime === 'new'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            New Tax Regime (Default)
          </button>
          <button
            type="button"
            onClick={() => setRegime('old')}
            className={`text-xs px-3 py-1.5 font-semibold rounded-lg transition-colors min-h-[32px] ${
              regime === 'old'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Old Tax Regime
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Annual CTC Structure</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              aria-label="Reset salary inputs"
            >
              Reset
            </Button>
          </div>

          <div className="space-y-6">
            {/* CTC Input */}
            <CalculatorInput
              id="salary-ctc"
              label="Annual Cost to Company (CTC)"
              value={annualCtc}
              onChange={setAnnualCtc}
              min={100000}
              max={20000000}
              step={25000}
              unit="₹"
              presets={[
                { label: '₹4.5 Lakh', value: 450000 },
                { label: '₹6 Lakh', value: 600000 },
                { label: '₹9 Lakh', value: 900000 },
                { label: '₹12 Lakh', value: 1200000 },
                { label: '₹15 Lakh', value: 1500000 },
                { label: '₹25 Lakh', value: 2500000 }
              ]}
              helperText={`Monthly Gross: ${formatINR(result.monthlyGross)}`}
            />

            {/* Customization Accordion */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1"
              >
                <span>Customize Basic Pay & Professional Tax (Optional)</span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvanced && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-4 animate-in fade-in-0 duration-150">
                  <CalculatorInput
                    id="salary-custom-basic"
                    label="Custom Monthly Basic Salary (Defaults to 40% of Gross)"
                    value={customBasic}
                    onChange={setCustomBasic}
                    min={0}
                    max={1000000}
                    step={1000}
                    unit="₹"
                    helperText={customBasic > 0 ? `Custom basic set to ${formatINR(customBasic)}/mo` : `Auto: ${formatINR(result.monthlyBasic)}/mo`}
                  />

                  <CalculatorInput
                    id="salary-custom-pt"
                    label="Monthly Professional Tax (Standard ₹200)"
                    value={customPt}
                    onChange={setCustomPt}
                    min={0}
                    max={2500}
                    step={50}
                    unit="₹"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right In-Hand Salary Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Monthly Take-Home Pay
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 tracking-tight mt-1">
                {formatINR(result.monthlyInHand)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Annual In-Hand: {formatINR(result.annualInHand)}
              </p>
            </div>

            {/* Itemized Deductions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Gross Monthly CTC</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatINR(result.monthlyGross)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Employee PF (12% of Basic)</span>
                <span className="font-mono text-red-600 dark:text-red-400">-{formatINR(result.monthlyEpflDeduction)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Professional Tax (PT)</span>
                <span className="font-mono text-red-600 dark:text-red-400">-{formatINR(result.monthlyPt)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Estimated Monthly Income Tax (TDS)</span>
                <span className="font-mono text-red-600 dark:text-red-400">-{formatINR(result.monthlyTds)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-900 dark:text-slate-100 font-bold pt-3 border-t border-slate-100 dark:border-slate-800 text-sm sm:text-base">
                <span>Net In-Hand (Per Month)</span>
                <span>{formatINR(result.monthlyInHand)}</span>
              </div>
            </div>

            {/* Tax Regime Information Note */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
                <Info className="w-3.5 h-3.5 text-slate-700 dark:text-sky-400" />
                <span>{regime === 'new' ? 'New Tax Regime (Section 115BAC)' : 'Old Tax Regime'}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Standard deduction of ₹75,000 applied. Nil tax applies up to ₹7,00,000 taxable income under Section 87A rebate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong>Statutory Note:</strong> This calculator provides mathematical estimates of monthly net take-home pay based on standard Indian corporate pay structures and Central Board of Direct Taxes (CBDT) tax slabs. Actual payroll numbers may vary depending on voluntary NPS contributions (80CCD), medical insurance deductions (80D), and specific corporate gratuity provisions.
        </p>
      </div>
    </div>
  );
};
