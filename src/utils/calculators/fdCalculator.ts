/**
 * Fixed Deposit (FD) Calculator Engine
 * 
 * Formula:
 * A = P × (1 + r/n)^(n × t)
 * Where:
 * A = Maturity Amount
 * P = Principal Deposit Amount
 * r = Annual interest rate (in decimal, e.g. 0.07 for 7%)
 * n = Compounding frequency per year (Monthly: 12, Quarterly: 4, Half-yearly: 2, Yearly: 1)
 * t = Tenure in years
 */

export type CompoundingFrequency = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';
export type FdTenureUnit = 'years' | 'months' | 'days';

export interface FdInput {
  principal: number;
  annualRate: number; // in percentage, e.g. 7.1
  tenure: number;
  tenureUnit: FdTenureUnit;
  compoundingFrequency: CompoundingFrequency;
  isSeniorCitizen?: boolean; // When true, gives +0.50% standard Indian preferential rate
}

export interface FdResult {
  principal: number;
  interestEarned: number;
  maturityAmount: number;
  effectiveRate: number;
  effectiveYield?: number;
  appliedRate?: number;
  isSeniorCitizen?: boolean;
  principalPercent: number;
  interestPercent: number;
  tenureInYears: number;
  compoundingFrequency: CompoundingFrequency;
  isValid: boolean;
  errorMessage?: string;
}

export const COMPOUNDING_PERIODS: Record<CompoundingFrequency, { name: string; n: number }> = {
  monthly: { name: 'Monthly', n: 12 },
  quarterly: { name: 'Quarterly (Most Indian Banks)', n: 4 },
  half_yearly: { name: 'Half-Yearly', n: 2 },
  yearly: { name: 'Yearly', n: 1 }
};

export const COMPOUNDING_OPTIONS: { id: CompoundingFrequency; label: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'half_yearly', label: 'Half-Yearly' },
  { id: 'yearly', label: 'Yearly' }
];

export function calculateFd(input: FdInput): FdResult {
  const principal = Math.max(0, input.principal || 0);
  let baseRate = Math.max(0, input.annualRate || 0);
  if (input.isSeniorCitizen) {
    baseRate += 0.50; // Standard Senior Citizen preferential rate in India
  }
  const tenure = Math.max(0, input.tenure || 0);
  const freq = input.compoundingFrequency || 'quarterly';
  const n = COMPOUNDING_PERIODS[freq]?.n || 4;

  // Convert tenure to years
  let tenureInYears = 0;
  if (input.tenureUnit === 'years') {
    tenureInYears = tenure;
  } else if (input.tenureUnit === 'months') {
    tenureInYears = tenure / 12;
  } else {
    // Days
    tenureInYears = tenure / 365;
  }

  if (principal <= 0 || tenureInYears <= 0) {
    return {
      principal: 0,
      interestEarned: 0,
      maturityAmount: 0,
      effectiveRate: baseRate,
      principalPercent: 100,
      interestPercent: 0,
      tenureInYears: 0,
      compoundingFrequency: freq,
      isValid: false,
      errorMessage: principal <= 0 ? 'Please enter a valid deposit amount.' : 'Please enter a valid deposit tenure.'
    };
  }

  // Guard against excessive tenure (max 30 years)
  if (tenureInYears > 30) {
    return {
      principal,
      interestEarned: 0,
      maturityAmount: principal,
      effectiveRate: baseRate,
      principalPercent: 100,
      interestPercent: 0,
      tenureInYears,
      compoundingFrequency: freq,
      isValid: false,
      errorMessage: 'FD tenure cannot exceed 30 years.'
    };
  }

  let maturityAmount = 0;

  if (baseRate === 0) {
    maturityAmount = principal;
  } else {
    const r = baseRate / 100;
    const exponent = n * tenureInYears;
    const compoundFactor = Math.pow(1 + r / n, exponent);
    const calculated = principal * compoundFactor;

    if (isNaN(calculated) || !isFinite(calculated)) {
      return {
        principal,
        interestEarned: 0,
        maturityAmount: principal,
        effectiveRate: baseRate,
        principalPercent: 100,
        interestPercent: 0,
        tenureInYears,
        compoundingFrequency: freq,
        isValid: false,
        errorMessage: 'Calculation overflow. Please check your inputs.'
      };
    }

    maturityAmount = Math.round(calculated);
  }

  const interestEarned = Math.max(0, maturityAmount - principal);
  const principalPercent = maturityAmount > 0 ? Math.round((principal / maturityAmount) * 100) : 100;
  const interestPercent = Math.max(0, 100 - principalPercent);
  const effectiveYield = (principal > 0 && tenureInYears > 0)
    ? Math.round(((interestEarned / principal) / tenureInYears) * 10000) / 100
    : Math.round(baseRate * 100) / 100;

  return {
    principal,
    interestEarned,
    maturityAmount,
    effectiveRate: Math.round(baseRate * 100) / 100,
    appliedRate: Math.round(baseRate * 100) / 100,
    effectiveYield,
    isSeniorCitizen: Boolean(input.isSeniorCitizen),
    principalPercent,
    interestPercent,
    tenureInYears: Math.round(tenureInYears * 100) / 100,
    compoundingFrequency: freq,
    isValid: true
  };
}
