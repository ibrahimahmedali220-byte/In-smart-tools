import React, { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { useToast } from '../../common/Toast';
import {
  UNIT_CATEGORIES,
  UNITS,
  UnitCategory,
  convertUnit,
  getUnitsByCategory,
  getUnitById,
  formatConversionNumber
} from '../../../utils/converters/unitConverter';
import { safeClipboardCopy } from '../../../utils/security';
import {
  ArrowRightLeft,
  Copy,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

export const UnitConverterComponent: React.FC = () => {
  const { showToast } = useToast();

  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnitId, setFromUnitId] = useState<string>('meter');
  const [toUnitId, setToUnitId] = useState<string>('kilometer');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Available units in currently active category
  const availableUnits = useMemo(() => {
    return getUnitsByCategory(category);
  }, [category]);

  // When category changes, set sensible default from & to
  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const meta = UNIT_CATEGORIES.find(c => c.id === cat);
    if (meta) {
      setFromUnitId(meta.defaultFrom);
      setToUnitId(meta.defaultTo);
    }
  };

  // Conversion computation
  const conversionResult = useMemo(() => {
    try {
      return convertUnit(inputValue, fromUnitId, toUnitId);
    } catch {
      return {
        fromValue: inputValue,
        toValue: 0,
        formattedResult: '0',
        formulaNote: '',
        isApproximate: false
      };
    }
  }, [inputValue, fromUnitId, toUnitId]);

  const handleSwap = () => {
    const prevFrom = fromUnitId;
    const prevTo = toUnitId;
    setFromUnitId(prevTo);
    setToUnitId(prevFrom);
    showToast('Swapped units.', 'info');
  };

  const handleCopy = async () => {
    const fromUnit = getUnitById(fromUnitId);
    const toUnit = getUnitById(toUnitId);
    const text = `${formatConversionNumber(inputValue)} ${fromUnit?.symbol || ''} = ${conversionResult.formattedResult} ${toUnit?.symbol || ''}`;
    const ok = await safeClipboardCopy(text);
    if (ok) {
      setIsCopied(true);
      showToast('Conversion copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setCategory('length');
    setInputValue(1);
    setFromUnitId('meter');
    setToUnitId('kilometer');
    showToast('Unit converter reset.', 'info');
  };

  const activeFrom = getUnitById(fromUnitId);
  const activeTo = getUnitById(toUnitId);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Category Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-sm">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-2 px-1">
          Select Measurement Category
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {UNIT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`shrink-0 py-2 px-3.5 rounded-xl text-xs font-bold border transition-all ${
                category === cat.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Conversion Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Unit Selectors & Value Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          
          {/* FROM COLUMN (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div>
              <label htmlFor="from-unit-sel" className="block text-xs font-semibold text-slate-700 mb-1">
                From Unit
              </label>
              <select
                id="from-unit-sel"
                value={fromUnitId}
                onChange={e => setFromUnitId(e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="from-val-input" className="block text-xs font-semibold text-slate-700 mb-1">
                Value
              </label>
              <input
                id="from-val-input"
                type="number"
                step="any"
                value={isNaN(inputValue) ? '' : inputValue}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setInputValue(isNaN(val) ? 0 : val);
                }}
                className="w-full h-12 px-3.5 bg-white border border-slate-200 rounded-xl text-base sm:text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* SWAP BUTTON (1 col) */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap from and to units"
              className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO COLUMN (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div>
              <label htmlFor="to-unit-sel" className="block text-xs font-semibold text-slate-700 mb-1">
                To Unit
              </label>
              <select
                id="to-unit-sel"
                value={toUnitId}
                onChange={e => setToUnitId(e.target.value)}
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="to-val-display" className="block text-xs font-semibold text-slate-700 mb-1">
                Result
              </label>
              <div
                id="to-val-display"
                className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-base sm:text-lg font-bold text-slate-900 font-mono select-all overflow-x-auto"
              >
                <span>{conversionResult.formattedResult}</span>
                <span className="text-xs font-semibold text-slate-500 font-sans ml-2">
                  {activeTo?.symbol}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Conversion Formula & Note */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span>
              Formula reference: <strong className="font-semibold text-slate-900">{conversionResult.formulaNote}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              icon={isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {isCopied ? 'Copied' : 'Copy Result'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset
            </Button>
          </div>
        </div>

        {/* Regional Land Units Reference Card (Shown if Area category selected) */}
        {category === 'area' && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-900 block">
              Regional & Traditional Land Area Reference:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div>• <strong>1 Gaj (Square Yard):</strong> 9 sq ft ≈ 0.836 m²</div>
              <div>• <strong>1 Guntha:</strong> 1,089 sq ft (33 ft × 33 ft) ≈ 101.17 m²</div>
              <div>• <strong>1 Ground:</strong> 2,400 sq ft ≈ 222.96 m²</div>
              <div>• <strong>1 Marla:</strong> 272.25 sq ft ≈ 25.29 m²</div>
              <div>• <strong>1 Kanal:</strong> 20 Marlas = 5,445 sq ft</div>
              <div>• <strong>1 Bigha:</strong> Standard ~26,910 sq ft (Regional standard)</div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
