/**
 * Body Mass Index (BMI) Calculation Engine
 * 
 * Supports Metric (cm, kg) and Imperial (ft/in, lbs) measurement systems.
 * Provides dual classification:
 * 1. Standard International WHO Guidelines
 * 2. Asian-Indian Consensus Guidelines (Overweight at >=23, Obese at >=25)
 * 
 * Includes healthy weight range computation and non-diagnostic educational disclaimers.
 */

export type UnitSystem = 'metric' | 'imperial';

export interface BmiCategoryInfo {
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  color: string; // Tailwind color token
  description: string;
}

export interface BmiCalculationResult {
  isValid: boolean;
  error?: string;
  bmi: number;
  heightCm: number;
  weightKg: number;

  // WHO Standard
  whoCategory: BmiCategoryInfo;
  whoHealthyWeightMinKg: number;
  whoHealthyWeightMaxKg: number;

  // Asian-Indian Adjusted
  asianCategory: BmiCategoryInfo;
  asianHealthyWeightMinKg: number;
  asianHealthyWeightMaxKg: number;

  // Display helpers
  healthyWeightRangeFormatted: string;
}

/**
 * Standard WHO Adult BMI classification
 */
function getWhoCategory(bmi: number): BmiCategoryInfo {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: 'text-amber-600',
      description: 'Below typical adult range. May indicate nutritional deficit.'
    };
  }
  if (bmi < 25.0) {
    return {
      category: 'Normal',
      color: 'text-emerald-600',
      description: 'Within standard healthy adult range according to WHO guidelines.'
    };
  }
  if (bmi < 30.0) {
    return {
      category: 'Overweight',
      color: 'text-amber-600',
      description: 'Above standard adult reference range.'
    };
  }
  return {
    category: 'Obese',
    color: 'text-rose-600',
    description: 'Significantly above standard adult reference range.'
  };
}

/**
 * Asian-Indian Consensus adult BMI classification
 * (Health Ministry of India & WHO SEARO guidelines)
 */
function getAsianIndianCategory(bmi: number): BmiCategoryInfo {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: 'text-amber-600',
      description: 'Below reference threshold for South Asian adults.'
    };
  }
  if (bmi < 23.0) {
    return {
      category: 'Normal',
      color: 'text-emerald-600',
      description: 'Optimal metabolic risk range for Indian adults.'
    };
  }
  if (bmi < 25.0) {
    return {
      category: 'Overweight',
      color: 'text-amber-600',
      description: 'Higher cardiovascular/metabolic risk threshold for Indian adults.'
    };
  }
  return {
    category: 'Obese',
    color: 'text-rose-600',
    description: 'Elevated cardiovascular and metabolic risk threshold for Indian adults.'
  };
}

/**
 * Converts imperial units (feet, inches, pounds) to metric (cm, kg)
 */
export function convertImperialToMetric(
  feet: number,
  inches: number,
  pounds: number
): { heightCm: number; weightKg: number } {
  const totalInches = (feet || 0) * 12 + (inches || 0);
  const heightCm = Math.round(totalInches * 2.54 * 10) / 10;
  const weightKg = Math.round((pounds || 0) * 0.45359237 * 10) / 10;
  return { heightCm, weightKg };
}

/**
 * Calculates BMI from Metric inputs (cm and kg)
 */
export function calculateBmi(heightCm: number, weightKg: number): BmiCalculationResult {
  if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) {
    return {
      isValid: false,
      error: 'Please enter positive numeric values for height and weight.',
      bmi: 0,
      heightCm: 0,
      weightKg: 0,
      whoCategory: getWhoCategory(0),
      whoHealthyWeightMinKg: 0,
      whoHealthyWeightMaxKg: 0,
      asianCategory: getAsianIndianCategory(0),
      asianHealthyWeightMinKg: 0,
      asianHealthyWeightMaxKg: 0,
      healthyWeightRangeFormatted: '0 - 0 kg'
    };
  }

  // Safety checks
  if (heightCm < 50 || heightCm > 300) {
    return {
      isValid: false,
      error: 'Height must be between 50 cm and 300 cm.',
      bmi: 0,
      heightCm,
      weightKg,
      whoCategory: getWhoCategory(0),
      whoHealthyWeightMinKg: 0,
      whoHealthyWeightMaxKg: 0,
      asianCategory: getAsianIndianCategory(0),
      asianHealthyWeightMinKg: 0,
      asianHealthyWeightMaxKg: 0,
      healthyWeightRangeFormatted: '0 - 0 kg'
    };
  }

  if (weightKg < 10 || weightKg > 500) {
    return {
      isValid: false,
      error: 'Weight must be between 10 kg and 500 kg.',
      bmi: 0,
      heightCm,
      weightKg,
      whoCategory: getWhoCategory(0),
      whoHealthyWeightMinKg: 0,
      whoHealthyWeightMaxKg: 0,
      asianCategory: getAsianIndianCategory(0),
      asianHealthyWeightMinKg: 0,
      asianHealthyWeightMaxKg: 0,
      healthyWeightRangeFormatted: '0 - 0 kg'
    };
  }

  const heightM = heightCm / 100;
  const heightMSquared = heightM * heightM;

  const rawBmi = weightKg / heightMSquared;
  const bmi = Math.round(rawBmi * 10) / 10;

  // WHO Reference Range (18.5 - 24.9)
  const whoHealthyWeightMinKg = Math.round(18.5 * heightMSquared * 10) / 10;
  const whoHealthyWeightMaxKg = Math.round(24.9 * heightMSquared * 10) / 10;

  // Asian-Indian Consensus Range (18.5 - 22.9)
  const asianHealthyWeightMinKg = Math.round(18.5 * heightMSquared * 10) / 10;
  const asianHealthyWeightMaxKg = Math.round(22.9 * heightMSquared * 10) / 10;

  return {
    isValid: true,
    bmi,
    heightCm,
    weightKg,
    whoCategory: getWhoCategory(bmi),
    whoHealthyWeightMinKg,
    whoHealthyWeightMaxKg,
    asianCategory: getAsianIndianCategory(bmi),
    asianHealthyWeightMinKg,
    asianHealthyWeightMaxKg,
    healthyWeightRangeFormatted: `${whoHealthyWeightMinKg} kg – ${whoHealthyWeightMaxKg} kg`
  };
}
