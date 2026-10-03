/**
 * SIP (Systematic Investment Plan) Calculator Engine
 * 
 * Formula:
 * M = P × [ (1 + i)^n - 1 ] × (1 + i) / i
 * Where:
 * M = Estimated maturity amount
 * P = Monthly investment amount
 * i = Periodic monthly rate of return (annualReturn / 12 / 100)
 * n = Number of monthly installments
 */

export interface SipInput {
  monthlyInvestment: number;
  expectedAnnualReturn: number; // e.g. 12%
  duration: number;
  durationUnit: 'years' | 'months';
}

export interface SipYearlyBreakdown {
  year: number;
  investedAmount: number;
  estimatedWealth: number;
  returnsEarned: number;
  invested: number;
  returns: number;
  totalValue: number;
}

export interface SipResult {
  totalInvested: number;
  estimatedReturns: number;
  estimatedFinalValue: number;
  totalMaturityAmount: number;
  wealthMultiplier: number;
  durationMonths: number;
  investedPercent: number;
  returnsPercent: number;
  yearlyBreakdown: SipYearlyBreakdown[];
  isValid: boolean;
  errorMessage?: string;
}

export function calculateSip(input: SipInput): SipResult {
  const monthly = Math.max(0, input.monthlyInvestment || 0);
  const rate = Math.max(0, input.expectedAnnualReturn || 0);
  const duration = Math.max(0, input.duration || 0);

  const totalMonths = input.durationUnit === 'years' ? Math.round(duration * 12) : Math.round(duration);

  if (monthly <= 0 || totalMonths <= 0) {
    return {
      totalInvested: 0,
      estimatedReturns: 0,
      estimatedFinalValue: 0,
      totalMaturityAmount: 0,
      wealthMultiplier: 1,
      durationMonths: 0,
      investedPercent: 100,
      returnsPercent: 0,
      yearlyBreakdown: [],
      isValid: false,
      errorMessage: monthly <= 0 ? 'Please enter a monthly investment amount.' : 'Please enter investment duration.'
    };
  }

  // Guard against unrealistic durations (max 40 years / 480 months)
  if (totalMonths > 480) {
    return {
      totalInvested: 0,
      estimatedReturns: 0,
      estimatedFinalValue: 0,
      totalMaturityAmount: 0,
      wealthMultiplier: 1,
      durationMonths: 0,
      investedPercent: 100,
      returnsPercent: 0,
      yearlyBreakdown: [],
      isValid: false,
      errorMessage: 'Investment duration cannot exceed 40 years (480 months).'
    };
  }

  const totalInvested = Math.round(monthly * totalMonths);
  let estimatedFinalValue = 0;

  if (rate === 0) {
    estimatedFinalValue = totalInvested;
  } else {
    const monthlyRate = (rate / 12) / 100;
    // Standard monthly compound interest formula for SIP annuity due
    const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
    const value = monthly * ((compoundFactor - 1) / monthlyRate) * (1 + monthlyRate);

    if (isNaN(value) || !isFinite(value)) {
      return {
        totalInvested,
        estimatedReturns: 0,
        estimatedFinalValue: totalInvested,
        totalMaturityAmount: totalInvested,
        wealthMultiplier: 1,
        durationMonths: totalMonths,
        investedPercent: 100,
        returnsPercent: 0,
        yearlyBreakdown: [],
        isValid: false,
        errorMessage: 'Calculation overflow. Please check your inputs.'
      };
    }

    estimatedFinalValue = Math.round(value);
  }

  const estimatedReturns = Math.max(0, estimatedFinalValue - totalInvested);
  const investedPercent = estimatedFinalValue > 0 ? Math.round((totalInvested / estimatedFinalValue) * 100) : 100;
  const returnsPercent = Math.max(0, 100 - investedPercent);

  // Generate yearly breakdown
  const yearlyBreakdown: SipYearlyBreakdown[] = [];
  const totalYears = Math.ceil(totalMonths / 12);
  const monthlyRate = (rate / 12) / 100;

  for (let y = 1; y <= totalYears; y++) {
    const currentMonths = Math.min(totalMonths, y * 12);
    const currentInvested = monthly * currentMonths;
    let currentWealth = currentInvested;

    if (rate > 0) {
      const factor = Math.pow(1 + monthlyRate, currentMonths);
      currentWealth = Math.round(monthly * ((factor - 1) / monthlyRate) * (1 + monthlyRate));
    }

    yearlyBreakdown.push({
      year: y,
      investedAmount: currentInvested,
      estimatedWealth: currentWealth,
      returnsEarned: Math.max(0, currentWealth - currentInvested),
      invested: currentInvested,
      returns: Math.max(0, currentWealth - currentInvested),
      totalValue: currentWealth
    });
  }

  const wealthMultiplier = totalInvested > 0 ? Math.round((estimatedFinalValue / totalInvested) * 10) / 10 : 1;

  return {
    totalInvested,
    estimatedReturns,
    estimatedFinalValue,
    totalMaturityAmount: estimatedFinalValue,
    wealthMultiplier,
    durationMonths: totalMonths,
    investedPercent,
    returnsPercent,
    yearlyBreakdown,
    isValid: true
  };
}
