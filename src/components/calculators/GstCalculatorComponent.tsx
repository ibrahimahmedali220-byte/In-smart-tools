import React, { useState, useMemo } from 'react';
import { calculateGst, GstMode, STANDARD_GST_SLABS } from '../../utils/calculators/gstCalculator';
import { formatINR } from '../../utils/formatters/currency';
import { CalculatorInput } from './CalculatorInput';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { safeClipboardCopy } from '../../utils/security';
import { RotateCcw, Copy, CheckCircle2, SplitSquareVertical } from 'lucide-react';

export const GstCalculatorComponent: React.FC = () => {
  const { showToast } = useToast();
  const [amount, setAmount] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18); // 18% standard GST slab
  const [mode, setMode] = useState<GstMode>('add'); // 'add' | 'remove'
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    return calculateGst({
      amount,
      rate,
      mode
    });
  }, [amount, rate, mode]);

  const handleReset = () => {
    setAmount(10000);
    setRate(18);
    setMode('add');
  };

  const handleCopyBreakup = async () => {
    const text = mode === 'add'
      ? `GST Breakdown (Add GST):
Base Amount: ${formatINR(result.baseAmount)}
GST (${rate}%): ${formatINR(result.gstAmount)}
  - CGST (${rate / 2}%): ${formatINR(result.cgst)}
  - SGST (${rate / 2}%): ${formatINR(result.sgst)}
Final Invoice Total: ${formatINR(result.finalAmount)}`
      : `GST Breakdown (Remove GST):
Original Total: ${formatINR(result.finalAmount)}
Net Base Amount: ${formatINR(result.baseAmount)}
GST Component (${rate}%): ${formatINR(result.gstAmount)}
  - CGST (${rate / 2}%): ${formatINR(result.cgst)}
  - SGST (${rate / 2}%): ${formatINR(result.sgst)}`;

    const success = await safeClipboardCopy(text);
    if (success) {
      setCopied(true);
      showToast('Tax breakup copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Mode Switcher Banner */}
      <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setMode('add')}
          className={`py-2 text-xs font-semibold rounded-xl transition-colors min-h-[40px] ${
            mode === 'add'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Add GST (Net Price)
        </button>
        <button
          type="button"
          onClick={() => setMode('remove')}
          className={`py-2 text-xs font-semibold rounded-xl transition-colors min-h-[40px] ${
            mode === 'remove'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Remove GST (Gross Price)
        </button>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {mode === 'add' ? 'Base Amount & Slab' : 'Gross Invoice Total & Slab'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              aria-label="Reset GST inputs"
            >
              Reset
            </Button>
          </div>

          <div className="space-y-6">
            {/* Amount Input */}
            <CalculatorInput
              id="gst-amount"
              label={mode === 'add' ? 'Net Base Amount (₹)' : 'Total Invoice Amount including GST (₹)'}
              value={amount}
              onChange={setAmount}
              min={1}
              max={100000000}
              step={100}
              unit="₹"
              presets={[
                { label: '₹1,000', value: 1000 },
                { label: '₹5,000', value: 5000 },
                { label: '₹18,000', value: 18000 },
                { label: '₹50,000', value: 50000 },
                { label: '₹1 Lakh', value: 100000 }
              ]}
            />

            {/* Slab Selection */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 block">
                Standard GST Tariff Slab
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {STANDARD_GST_SLABS.map((slab) => {
                  const isSelected = rate === slab;
                  return (
                    <button
                      key={slab}
                      type="button"
                      onClick={() => setRate(slab)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all min-h-[38px] ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {slab}%
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Rate Input */}
            <CalculatorInput
              id="gst-custom-rate"
              label="Or Enter Custom GST Rate (%)"
              value={rate}
              onChange={setRate}
              min={0}
              max={50}
              step={0.25}
              unit="%"
              unitPosition="suffix"
            />
          </div>
        </div>

        {/* Right Summary Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 space-y-6 transition-colors">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {mode === 'add' ? 'Total Invoice Price' : 'Net Base Price (Excluding Tax)'}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                {mode === 'add' ? formatINR(result.finalAmount) : formatINR(result.baseAmount)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'add'
                  ? `Base ₹${result.baseAmount.toLocaleString('en-IN')} + ${rate}% GST`
                  : `Gross ₹${result.finalAmount.toLocaleString('en-IN')} minus ${rate}% GST`}
              </p>
            </div>

            {/* Itemized Splits */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Net Base Amount</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatINR(result.baseAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Total GST Amount ({rate}%)</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{formatINR(result.gstAmount)}</span>
              </div>

              {/* Intra-state split card */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 pb-1 border-b border-slate-200/60 dark:border-slate-700">
                  <SplitSquareVertical className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  <span>Intra-State GST Split</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>CGST ({rate / 2}%)</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{formatINR(result.cgst)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>SGST / UTGST ({rate / 2}%)</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{formatINR(result.sgst)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700 text-[11px]">
                  <span>Inter-State IGST (100%)</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{formatINR(result.gstAmount)}</span>
                </div>
              </div>
            </div>

            {/* Copy Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleCopyBreakup}
                icon={copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? 'Copied to Clipboard' : 'Copy Tax Breakdown'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
