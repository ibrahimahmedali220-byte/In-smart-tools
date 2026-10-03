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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90">
        <div className="flex items-center gap-2">
          <label htmlFor="salary-fy-select" className="text-xs font-semibold text-slate-700">Financial Year:</label>
          <select
            id="salary-fy-select"
            value={financialYear}
            onChange={e => setFinancialYear(e.target.value as FinancialYear)}
            className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="FY 2025-26">FY 2025-26 (AY 2026-27)</option>
            <option value="FY 2026-27">FY 2026-27 (AY 2027-28)</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setRegime('new')}
            className={`text-xs px-3 py-1 font-semibold rounded-md transition-colors ${
              regime === 'new'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Regime (Default)
          </button>
          <button
            type="button"
            onClick={() => setRegime('old')}
            className={`text-xs px-3 py-1 font-semibold rounded-md transition-colors ${
              regime === 'old'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Old Regime
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">CTC & Salary Structure</h2>
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

          {/* Annual CTC Input */}
          <CalculatorInput
            id="salary-ctc"
            label="Annual Cost to Company (CTC)"
            value={annualCtc}
            onChange={setAnnualCtc}
            min={100000}
            max={50000000}
            step={50000}
            unit="₹"
            unitPosition="prefix"
            presets={[
              { label: '₹6L', value: 600000 },
              { label: '₹9L', value: 900000 },
              { label: '₹15L', value: 1500000 },
              { label: '₹25L', value: 2500000 }
            ]}
            helperText="Total annual package mentioned in your employment contract"
          />

          {/* Collapsible Advanced Salary Customization */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <span>Customize Basic Pay & Professional Tax</span>
              {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>

            {showAdvanced && (
              <div className="p-4 bg-white space-y-4 border-t border-slate-200">
                <CalculatorInput
                  id="salary-basic"
                  label="Annual Basic Pay (Defaults to 40% of CTC)"
                  value={customBasic > 0 ? customBasic : Math.round(annualCtc * 0.40)}
                  onChange={setCustomBasic}
                  min={50000}
                  max={annualCtc}
                  step={10000}
                  unit="₹"
                  unitPosition="prefix"
                  helperText="EPF (12%) is deducted from this Basic Pay"
                />

                <CalculatorInput
                  id="salary-pt"
                  label="Monthly Professional Tax (PT)"
                  value={customPt}
                  onChange={setCustomPt}
                  min={0}
                  max={500}
                  step={50}
                  unit="₹"
                  unitPosition="prefix"
                  helperText="Standard across most states is ₹200/month"
                />
              </div>
            )}
          </div>

          {/* Regime explanation callout */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              {regime === 'new'
                ? 'Under the New Tax Regime, salaried employees get a flat ₹75,000 standard deduction and Section 87A rebate for taxable income up to ₹7,00,000 (making CTC up to ₹7.75L zero tax).'
                : 'Under the Old Tax Regime, standard deduction is ₹50,000 with Section 87A rebate up to ₹5,00,000.'}
            </p>
          </div>
        </div>

        {/* Right Output Section (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Estimated Monthly In-Hand Pay
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 text-emerald-400">
                {formatINR(result.inHandMonthly)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Net take-home credited to your bank account each month
              </p>
            </div>

            {/* Deductions Breakdown */}
            <div className="border-t border-slate-800 pt-5 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>Monthly Gross CTC</span>
                <span className="font-semibold text-white">{formatINR(result.monthlyGross)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Employee PF (12% of Basic)</span>
                <span className="text-amber-400">-{formatINR(result.deductions.employeePfMonthly)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Professional Tax (PT)</span>
                <span className="text-amber-400">-{formatINR(result.deductions.professionalTaxMonthly)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Estimated Income Tax (TDS)</span>
                <span className="text-amber-400">-{formatINR(result.deductions.incomeTaxMonthly)}</span>
              </div>

              <div className="border-t border-slate-800 pt-2.5 flex justify-between items-center font-bold text-sm">
                <span className="text-white">Annual In-Hand Total</span>
                <span className="text-emerald-400">{formatINR(result.inHandAnnual)}</span>
              </div>
            </div>
          </div>

          {/* Contextual Legal Disclaimer */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              Salary and tax calculations are estimates based on the information and assumptions entered. Actual salary, deductions and tax liability may vary. Verify important tax information with official sources or a qualified professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
