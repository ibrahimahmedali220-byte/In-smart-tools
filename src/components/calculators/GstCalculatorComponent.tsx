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
      <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 max-w-md mx-auto grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setMode('add')}
          className={`py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            mode === 'add'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Add GST (Exclusive)
        </button>
        <button
          type="button"
          onClick={() => setMode('remove')}
          className={`py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            mode === 'remove'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Remove GST (Inclusive)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              {mode === 'add' ? 'Calculate GST Addition' : 'Calculate GST Extraction'}
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

          {/* Amount input */}
          <CalculatorInput
            id="gst-amount"
            label={mode === 'add' ? 'Base Amount (Excluding GST)' : 'Total Amount (Including GST)'}
            value={amount}
            onChange={setAmount}
            min={1}
            max={50000000}
            step={100}
            unit="₹"
            unitPosition="prefix"
            presets={[
              { label: '₹1,000', value: 1000 },
              { label: '₹5,000', value: 5000 },
              { label: '₹18,000', value: 18000 },
              { label: '₹1,00,000', value: 100000 }
            ]}
            helperText={mode === 'add' ? 'Enter the price before tax' : 'Enter the final MRP / invoice price with tax'}
          />

          {/* GST Slabs */}
          <div className="space-y-2">
            <label htmlFor="gst-rate" className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight">
              GST Rate Slab
            </label>
            <div className="grid grid-cols-5 gap-2">
              {STANDARD_GST_SLABS.map(slab => (
                <button
                  key={slab}
                  type="button"
                  onClick={() => setRate(slab)}
                  className={`py-2 px-3 rounded-lg border text-xs sm:text-sm font-bold transition-colors ${
                    rate === slab
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {slab}%
                </button>
              ))}
            </div>

            {/* Custom rate option */}
            <div className="pt-2">
              <CalculatorInput
                id="gst-custom-rate"
                label="Or Custom GST Percentage"
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
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {mode === 'add' ? 'Total Invoice Amount' : 'Net Base Amount'}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                {formatINR(mode === 'add' ? result.finalAmount : result.baseAmount)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'add' ? `Inclusive of ${rate}% GST` : `Exclusive of ${rate}% GST`}
              </p>
            </div>

            <div className="border-t border-slate-800 pt-5 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Total GST ({rate}%)</span>
                <span className="font-semibold text-amber-400">{formatINR(result.gstAmount)}</span>
              </div>

              {/* CGST / SGST split for intra-state billing */}
              <div className="bg-slate-800/80 rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold pb-1 border-b border-slate-700">
                  <SplitSquareVertical className="w-3.5 h-3.5 text-slate-400" />
                  <span>Intra-State Tax Split (50 : 50)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>CGST ({rate / 2}%):</span>
                  <span className="font-mono text-white">{formatINR(result.cgst)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>SGST ({rate / 2}%):</span>
                  <span className="font-mono text-white">{formatINR(result.sgst)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm pt-1">
                <span className="text-slate-400">
                  {mode === 'add' ? 'Original Base Price' : 'Gross Billed Price'}
                </span>
                <span className="font-semibold text-white">
                  {formatINR(mode === 'add' ? result.baseAmount : result.finalAmount)}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={handleCopyBreakup}
              icon={copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied Breakup' : 'Copy Invoice Tax Breakup'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
