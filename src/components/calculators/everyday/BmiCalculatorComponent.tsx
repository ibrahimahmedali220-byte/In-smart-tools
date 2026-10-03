import React, { useState, useMemo } from 'react';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';
import {
  calculateBmi,
  convertImperialToMetric,
  UnitSystem,
  BmiCalculationResult
} from '../../../utils/calculators/bmiCalculator';
import {
  Activity,
  RotateCcw,
  Info,
  ShieldAlert,
  CheckCircle2,
  HeartPulse
} from 'lucide-react';

export const BmiCalculatorComponent: React.FC = () => {
  const { showToast } = useToast();

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  // Metric state
  const [heightCm, setHeightCm] = useState<number>(172);
  const [weightKg, setWeightKg] = useState<number>(68);

  // Imperial state
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(8);
  const [pounds, setPounds] = useState<number>(150);

  // Sync / calculate active metric figures
  const activeMetric = useMemo(() => {
    if (unitSystem === 'metric') {
      return { cm: heightCm, kg: weightKg };
    } else {
      const { heightCm: c, weightKg: k } = convertImperialToMetric(feet, inches, pounds);
      return { cm: c, kg: k };
    }
  }, [unitSystem, heightCm, weightKg, feet, inches, pounds]);

  const bmiResult: BmiCalculationResult = useMemo(() => {
    return calculateBmi(activeMetric.cm, activeMetric.kg);
  }, [activeMetric]);

  const handleReset = () => {
    setUnitSystem('metric');
    setHeightCm(172);
    setWeightKg(68);
    setFeet(5);
    setInches(8);
    setPounds(150);
    showToast('BMI calculator reset to default.', 'info');
  };

  // Color mapping
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Underweight': return { text: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
      case 'Normal': return { text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
      case 'Overweight': return { text: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
      case 'Obese': return { text: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' };
      default: return { text: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' };
    }
  };

  const whoStyle = getCategoryColor(bmiResult.whoCategory.category);
  const asianStyle = getCategoryColor(bmiResult.asianCategory.category);

  // Calculate visual gauge position (clamp between 15 and 35)
  const gaugePercent = Math.max(0, Math.min(100, ((bmiResult.bmi - 15) / (35 - 15)) * 100));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Input Workspace Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Unit Toggle Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Measurement Standard
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setUnitSystem('metric')}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all ${
                unitSystem === 'metric' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Metric (cm, kg)
            </button>
            <button
              type="button"
              onClick={() => setUnitSystem('imperial')}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all ${
                unitSystem === 'imperial' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Imperial (ft/in, lbs)
            </button>
          </div>
        </div>

        {/* Input Fields */}
        {unitSystem === 'metric' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <label htmlFor="metric-height">Height (cm)</label>
                <span className="font-mono text-slate-600">{heightCm} cm</span>
              </div>
              <input
                id="metric-height"
                type="number"
                min={50}
                max={250}
                value={heightCm || ''}
                onChange={e => setHeightCm(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <input
                type="range"
                min={100}
                max={220}
                value={heightCm}
                onChange={e => setHeightCm(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <label htmlFor="metric-weight">Weight (kg)</label>
                <span className="font-mono text-slate-600">{weightKg} kg</span>
              </div>
              <input
                id="metric-weight"
                type="number"
                min={20}
                max={300}
                value={weightKg || ''}
                onChange={e => setWeightKg(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <input
                type="range"
                min={30}
                max={150}
                value={weightKg}
                onChange={e => setWeightKg(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="imp-feet" className="block text-xs font-semibold text-slate-800">
                Height (Feet)
              </label>
              <input
                id="imp-feet"
                type="number"
                min={1}
                max={8}
                value={feet || ''}
                onChange={e => setFeet(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="imp-inches" className="block text-xs font-semibold text-slate-800">
                Height (Inches)
              </label>
              <input
                id="imp-inches"
                type="number"
                min={0}
                max={11}
                value={inches || ''}
                onChange={e => setInches(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="imp-pounds" className="block text-xs font-semibold text-slate-800">
                Weight (Pounds)
              </label>
              <input
                id="imp-pounds"
                type="number"
                min={30}
                max={600}
                value={pounds || ''}
                onChange={e => setPounds(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        )}

        {/* Reset Toolbar */}
        <div className="flex justify-end pt-2">
          <Button variant="ghost" size="sm" onClick={handleReset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Inputs
          </Button>
        </div>

      </div>

      {/* Result Section */}
      {bmiResult.isValid && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
          
          {/* Highlight Value Banner */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Your Body Mass Index (BMI)
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tracking-tight">
              {bmiResult.bmi}
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${whoStyle.bg} ${whoStyle.text}`}>
                WHO: {bmiResult.whoCategory.category}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${asianStyle.bg} ${asianStyle.text}`}>
                Asian-Indian: {bmiResult.asianCategory.category}
              </span>
            </div>
          </div>

          {/* Visual BMI Scale Gauge */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>BMI Scale</span>
              <span className="font-mono text-slate-500">{bmiResult.bmi}</span>
            </div>

            {/* Gradient Track */}
            <div className="relative w-full h-3 rounded-full overflow-hidden flex">
              <div className="bg-sky-400 h-full w-[17.5%]" title="Underweight (< 18.5)" />
              <div className="bg-emerald-500 h-full w-[32%]" title="Normal (18.5 - 24.9)" />
              <div className="bg-amber-500 h-full w-[25%]" title="Overweight (25 - 29.9)" />
              <div className="bg-rose-500 h-full w-[25.5%]" title="Obese (>= 30)" />
            </div>

            {/* Pointer marker */}
            <div className="relative w-full h-4">
              <div
                className="absolute -top-1 -ml-1.5 w-3 h-3 bg-slate-900 rotate-45 border-2 border-white shadow-sm transition-all duration-300"
                style={{ left: `${gaugePercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>15 (Under)</span>
              <span>18.5 (Normal)</span>
              <span>23 (Asian Limit)</span>
              <span>25 (WHO Overweight)</span>
              <span>30 (Obese)</span>
              <span>35+</span>
            </div>
          </div>

          {/* Dual Guideline Comparison Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* WHO Standard */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Standard WHO Criteria</span>
                <span className={`text-[11px] font-bold ${whoStyle.text}`}>{bmiResult.whoCategory.category}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {bmiResult.whoCategory.description}
              </p>
              <div className="pt-1 text-[11px] text-slate-600 border-t border-slate-100">
                Healthy weight for height: <strong>{bmiResult.whoHealthyWeightMinKg} kg – {bmiResult.whoHealthyWeightMaxKg} kg</strong>
              </div>
            </div>

            {/* Asian-Indian Guideline */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Asian-Indian Consensus</span>
                <span className={`text-[11px] font-bold ${asianStyle.text}`}>{bmiResult.asianCategory.category}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Indian guidelines set lower cutoffs (Overweight at 23, Obese at 25) due to higher abdominal adiposity risks.
              </p>
              <div className="pt-1 text-[11px] text-slate-600 border-t border-slate-100">
                Optimal weight target: <strong>{bmiResult.asianHealthyWeightMinKg} kg – {bmiResult.asianHealthyWeightMaxKg} kg</strong>
              </div>
            </div>

          </div>

          {/* Non-Diagnostic Medical Disclaimer Card */}
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
              <span>Important Adult Health Disclaimer</span>
            </div>
            <p className="leading-relaxed text-amber-800">
              BMI is a general screening measure and does not directly measure body fat, bone density, or muscle mass. It is not a medical diagnosis of disease. This calculator is strictly intended for adults (aged 18+) and should not be used to interpret children's or adolescents' health. Always consult a qualified medical professional for health evaluations.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
