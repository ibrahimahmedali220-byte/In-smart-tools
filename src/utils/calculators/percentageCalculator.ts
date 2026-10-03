/**
 * Percentage Calculator Engine
 * 
 * Supports:
 * 1. percent_of: What is X% of Y?
 * 2. what_percent: X is what percentage of Y?
 * 3. increase: Percentage increase from X (old) to Y (new)
 * 4. decrease: Percentage decrease from X (old) to Y (new)
 */

export type PercentageMode = 'percent_of' | 'what_percent' | 'increase' | 'decrease';

export interface PercentageInput {
  mode: PercentageMode;
  val1: number; // X
  val2: number; // Y
}

export interface PercentageResult {
  result: number;
  formattedResult: string;
  formula: string;
  explanation: string;
  mode: PercentageMode;
  isValid: boolean;
  errorMessage?: string;
}

export function calculatePercentage(input: PercentageInput): PercentageResult {
  const { mode, val1, val2 } = input;

  if (isNaN(val1) || !isFinite(val1) || isNaN(val2) || !isFinite(val2)) {
    return {
      result: 0,
      formattedResult: '0',
      formula: '',
      explanation: 'Please enter valid numerical values.',
      mode,
      isValid: false,
      errorMessage: 'Invalid numeric input.'
    };
  }

  let result = 0;
  let formula = '';
  let explanation = '';
  let formattedResult = '';

  switch (mode) {
    case 'percent_of': {
      // What is X% of Y?
      result = (val1 * val2) / 100;
      formula = `(${val1} × ${val2}) ÷ 100`;
      formattedResult = formatNumber(result);
      explanation = `${val1}% of ${val2} is ${formattedResult}. Calculation: (${val1} × ${val2}) ÷ 100 = ${formattedResult}.`;
      break;
    }

    case 'what_percent': {
      // X is what percentage of Y?
      if (val2 === 0) {
        return {
          result: 0,
          formattedResult: '0%',
          formula: `(${val1} ÷ 0) × 100`,
          explanation: 'Cannot divide by zero. The total value (Y) must be greater than zero.',
          mode,
          isValid: false,
          errorMessage: 'Total value (Y) cannot be zero.'
        };
      }
      result = (val1 / val2) * 100;
      formula = `(${val1} ÷ ${val2}) × 100`;
      formattedResult = `${formatNumber(result)}%`;
      explanation = `${val1} is ${formattedResult} of ${val2}. Calculation: (${val1} ÷ ${val2}) × 100 = ${formattedResult}.`;
      break;
    }

    case 'increase': {
      // Percentage increase from X to Y
      if (val1 === 0) {
        return {
          result: 0,
          formattedResult: '0%',
          formula: `((${val2} - 0) ÷ 0) × 100`,
          explanation: 'Initial value cannot be zero when calculating percentage increase.',
          mode,
          isValid: false,
          errorMessage: 'Initial value (X) cannot be zero.'
        };
      }
      result = ((val2 - val1) / Math.abs(val1)) * 100;
      formula = `((${val2} - ${val1}) ÷ |${val1}|) × 100`;
      formattedResult = `${formatNumber(result)}%`;
      explanation = `Changing from ${val1} to ${val2} represents a ${result >= 0 ? 'growth' : 'decrease'} of ${formattedResult}.`;
      break;
    }

    case 'decrease': {
      // Percentage decrease from X to Y
      if (val1 === 0) {
        return {
          result: 0,
          formattedResult: '0%',
          formula: `((${val1} - ${val2}) ÷ 0) × 100`,
          explanation: 'Initial value cannot be zero when calculating percentage decrease.',
          mode,
          isValid: false,
          errorMessage: 'Initial value (X) cannot be zero.'
        };
      }
      result = ((val1 - val2) / Math.abs(val1)) * 100;
      formula = `((${val1} - ${val2}) ÷ |${val1}|) × 100`;
      formattedResult = `${formatNumber(result)}%`;
      explanation = `Reducing from ${val1} to ${val2} is a decrease of ${formattedResult}.`;
      break;
    }
  }

  return {
    result: Math.round(result * 100) / 100,
    formattedResult,
    formula,
    explanation,
    mode,
    isValid: true
  };
}

function formatNumber(num: number): string {
  if (isNaN(num) || !isFinite(num)) return '0';
  // Round to max 2 decimal places, strip trailing zeros
  const rounded = Math.round(num * 100) / 100;
  return rounded.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}
