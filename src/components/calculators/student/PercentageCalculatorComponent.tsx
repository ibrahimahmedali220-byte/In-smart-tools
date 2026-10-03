import React, { useState, useMemo } from 'react';
import { calculatePercentage, PercentageMode } from '../../../utils/calculators/percentageCalculator';
import { Button } from '../../common/Button';
import { RotateCcw, ArrowRight, Lightbulb, Calculator } from 'lucide-react';

interface ExamplePreset {
  label: string;
  mode: PercentageMode;
  val1: number;
  val2: number;
  description: string;
}

const PRESET_EXAMPLES: ExamplePreset[] = [
  {
    label: '20% of ₹5,000',
    mode: 'percent_of',
    val1: 20,
    val2: 5000,
    description: 'Calculate 20% discount on ₹5,000 fee'
  },
  {
    label: '450 out of 500',
    mode: 'what_percent',
    val1: 450,
    val2: 500,
    description: 'Board exam score 450/500 marks'
  },
  {
    label: 'Score from 70 to 85',
    mode: 'increase',
    val1: 70,
    val2: 85,
    description: 'Marks percentage improvement'
  },
  {
    label: 'Price from 1,200 to 900',
    mode: 'decrease',
    val1: 1200,
    val2: 900,
    description: 'Book sale price reduction'
  }
];

export const PercentageCalculatorComponent: React.FC = () => {
  const [mode, setMode] = useState<PercentageMode>('percent_of');
  const [val1, setVal1] = useState<number>(20);
  const [val2, setVal2] = useState<number>(500);

  const result = useMemo(() => {
    return calculatePercentage({ mode, val1, val2 });
  }, [mode, val1, val2]);

  const handleReset = () => {
    setVal1(0);
    setVal2(0);
  };

  const loadExample = (example: ExamplePreset) => {
    setMode(example.mode);
    setVal1(example.val1);
    setVal2(example.val2);
  };

  const getLabels = () => {
    switch (mode) {
      case 'percent_of':
        return {
          title: 'What is X% of Y?',
          label1: 'Percentage (X)',
          unit1: '%',
          label2: 'Total Value (Y)',
          unit2: '',
          help1: 'Enter the percentage rate',
          help2: 'Enter the base or total amount'
        };
      case 'what_percent':
        return {
          title: 'X is what percentage of Y?',
          label1: 'Portion / Marks Obtained (X)',
          unit1: '',
          label2: 'Total / Maximum Marks (Y)',
          unit2: '',
          help1: 'Score or part value',
          help2: 'Maximum or base value'
        };
      case 'increase':
        return {
          title: 'Percentage Increase',
          label1: 'Initial / Old Value (X)',
          unit1: '',
          label2: 'Final / New Value (Y)',
          unit2: '',
          help1: 'Starting baseline value',
          help2: 'Increased value'
        };
      case 'decrease':
        return {
          title: 'Percentage Decrease',
          label1: 'Initial / Old Value (X)',
          unit1: '',
          label2: 'Final / New Value (Y)',
          unit2: '',
          help1: 'Original higher value',
          help2: 'Reduced value'
        };
    }
  };

  const labels = getLabels();

  return (
    <div className="space-y-8">
      {/* Mode Selector */}
      <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-1">
        <button
          type="button"
          onClick={() => setMode('percent_of')}
          className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            mode === 'percent_of'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          What is X% of Y?
        </button>
        <button
          type="button"
          onClick={() => setMode('what_percent')}
          className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            mode === 'what_percent'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          X is what % of Y?
        </button>
        <button
          type="button"
          onClick={() => setMode('increase')}
          className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            mode === 'increase'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          % Increase
        </button>
        <button
          type="button"
          onClick={() => setMode('decrease')}
          className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            mode === 'decrease'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          % Decrease
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Section (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">{labels.title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              aria-label="Reset percentage inputs"
            >
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input 1 */}
            <div className="space-y-1.5">
              <label htmlFor="percent-val1" className="block text-xs sm:text-sm font-semibold text-slate-800">
                {labels.label1}
              </label>
              <div className="relative flex items-center">
                <input
                  id="percent-val1"
                  type="number"
                  step="any"
                  value={val1 || ''}
                  onChange={e => setVal1(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                {labels.unit1 && (
                  <span className="absolute right-3.5 text-xs font-semibold text-slate-500 pointer-events-none">
                    {labels.unit1}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">{labels.help1}</p>
            </div>

            {/* Input 2 */}
            <div className="space-y-1.5">
              <label htmlFor="percent-val2" className="block text-xs sm:text-sm font-semibold text-slate-800">
                {labels.label2}
              </label>
              <div className="relative flex items-center">
                <input
                  id="percent-val2"
                  type="number"
                  step="any"
                  value={val2 || ''}
                  onChange={e => setVal2(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                {labels.unit2 && (
                  <span className="absolute right-3.5 text-xs font-semibold text-slate-500 pointer-events-none">
                    {labels.unit2}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">{labels.help2}</p>
            </div>
          </div>
        </div>

        {/* Right Output Section (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Calculated Result
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 text-emerald-400">
                {result.isValid ? result.formattedResult : '0'}
              </div>
              {result.errorMessage && (
                <p className="text-xs text-red-400 mt-1 font-medium">{result.errorMessage}</p>
              )}
            </div>

            {result.isValid && (
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Applied Formula</span>
                  <div className="font-mono text-xs text-slate-200 bg-slate-800/80 px-3 py-2 rounded-lg">
                    {result.formula}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Explanation</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Useful Real-World Examples */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Lightbulb className="w-5 h-5 text-amber-500" aria-hidden="true" />
          <h2>Practice Examples</h2>
        </div>
        <p className="text-xs text-slate-500">
          Click any example below to automatically load the parameters into the calculator:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {PRESET_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadExample(ex)}
              className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-slate-950">
                <span>{ex.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {ex.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
