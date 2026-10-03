import React, { useState, useMemo } from 'react';
import { calculateCgpa, SubjectEntry } from '../../../utils/calculators/cgpaCalculator';
import { Button } from '../../common/Button';
import { Plus, Trash2, RotateCcw, Award, Info, Calculator } from 'lucide-react';

const INITIAL_ENTRIES: SubjectEntry[] = [
  { id: '1', name: 'Subject 1', gradePoint: 9, credit: 4 },
  { id: '2', name: 'Subject 2', gradePoint: 8, credit: 3 },
  { id: '3', name: 'Subject 3', gradePoint: 9, credit: 3 },
  { id: '4', name: 'Subject 4', gradePoint: 10, credit: 4 },
  { id: '5', name: 'Subject 5', gradePoint: 8, credit: 3 }
];

export const CgpaCalculatorComponent: React.FC = () => {
  const [entries, setEntries] = useState<SubjectEntry[]>(INITIAL_ENTRIES);
  const [isWeighted, setIsWeighted] = useState<boolean>(true);
  const [conversionFactor, setConversionFactor] = useState<number>(9.5);

  const result = useMemo(() => {
    return calculateCgpa({
      entries,
      isWeighted,
      conversionFactor
    });
  }, [entries, isWeighted, conversionFactor]);

  const handleAddSubject = () => {
    const nextId = (entries.length + 1).toString();
    setEntries([
      ...entries,
      { id: nextId, name: `Subject ${entries.length + 1}`, gradePoint: 8, credit: 3 }
    ]);
  };

  const handleRemoveSubject = (id: string) => {
    if (entries.length <= 1) return;
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleUpdateEntry = (id: string, field: 'name' | 'gradePoint' | 'credit', value: string | number) => {
    setEntries(entries.map(e => {
      if (e.id === id) {
        return { ...e, [field]: value };
      }
      return e;
    }));
  };

  const handleReset = () => {
    setEntries(INITIAL_ENTRIES);
    setIsWeighted(true);
    setConversionFactor(9.5);
  };

  return (
    <div className="space-y-8">
      {/* Calculation Mode & Factor Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Calculation Mode:</span>
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setIsWeighted(true)}
              className={`text-xs px-3 py-1 font-semibold rounded-md transition-colors ${
                isWeighted
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Credit Weighted (Standard)
            </button>
            <button
              type="button"
              onClick={() => setIsWeighted(false)}
              className={`text-xs px-3 py-1 font-semibold rounded-md transition-colors ${
                !isWeighted
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Simple Average
            </button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Subject / Semester Rows (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Course / Subject Grades</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your grade points (0 to 10 scale) and course credits
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSubject}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Subject
            </Button>
          </div>

          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="p-3 bg-slate-50/60 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <label htmlFor={`sub-name-${entry.id}`} className="sr-only">
                    Subject Name
                  </label>
                  <input
                    id={`sub-name-${entry.id}`}
                    type="text"
                    value={entry.name}
                    placeholder={`Subject ${index + 1}`}
                    onChange={e => handleUpdateEntry(entry.id, 'name', e.target.value)}
                    className="w-full text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <label htmlFor={`sub-gp-${entry.id}`} className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                      Grade Point
                    </label>
                    <input
                      id={`sub-gp-${entry.id}`}
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={entry.gradePoint}
                      onChange={e => handleUpdateEntry(entry.id, 'gradePoint', parseFloat(e.target.value) || 0)}
                      className="w-20 text-xs sm:text-sm font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-center text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  {isWeighted && (
                    <div>
                      <label htmlFor={`sub-cr-${entry.id}`} className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                        Credits
                      </label>
                      <input
                        id={`sub-cr-${entry.id}`}
                        type="number"
                        min={1}
                        max={10}
                        step={1}
                        value={entry.credit}
                        onChange={e => handleUpdateEntry(entry.id, 'credit', parseInt(e.target.value, 10) || 0)}
                        className="w-16 text-xs sm:text-sm font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-center text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  )}

                  <div className="pt-3.5">
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(entry.id)}
                      disabled={entries.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      aria-label={`Remove ${entry.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: CGPA Output & Conversion (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Cumulative Grade Point Average
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-1 text-emerald-400">
                {result.isValid ? result.cgpa.toFixed(2) : '0.00'}
                <span className="text-sm font-normal text-slate-400 ml-2">/ 10.0</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isWeighted ? `Weighted across ${result.totalCredits} course credits` : `Unweighted average of ${result.subjectCount} subjects`}
              </p>
            </div>

            {/* Optional CGPA to Percentage Conversion */}
            <div className="border-t border-slate-800 pt-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1">
                  Estimated Percentage Conversion
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {result.isValid ? `${result.estimatedPercentage}%` : '0%'}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Estimated percentage based on the selected conversion factor.
                </p>
              </div>

              {/* Multiplier selector */}
              <div className="bg-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Conversion Factor:</span>
                  <div className="flex items-center gap-1.5">
                    {[9.5, 10.0].map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setConversionFactor(f)}
                        className={`px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                          conversionFactor === f ? 'bg-white text-slate-900' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        × {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label htmlFor="custom-factor-input" className="text-slate-400">Custom Factor:</label>
                  <input
                    id="custom-factor-input"
                    type="number"
                    step="0.1"
                    min="1"
                    max="15"
                    value={conversionFactor}
                    onChange={e => setConversionFactor(parseFloat(e.target.value) || 9.5)}
                    className="w-16 bg-slate-700 text-white font-mono text-xs rounded px-2 py-1 text-center border border-slate-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contextual Institutional Notice */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">
              <strong>Institutional Note:</strong> CGPA-to-percentage conversion rules differ between universities. While CBSE and AICTE use the 9.5 factor, some autonomous universities utilize custom conversion formulas. Always check your university grade card guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
