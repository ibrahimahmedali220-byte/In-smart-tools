/**
 * EMI Calculator Engine (Standard Indian Reducing Balance Formula)
 * 
 * Formula:
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 * Where:
 * P = Principal loan amount
 * r = Monthly interest rate (annualRate / 12 / 100)
 * n = Number of monthly payments
 */

export interface EmiInput {
  principal: number;
  annualRate: number; // in percentage, e.g. 8.5
  tenure: number;
  tenureUnit: 'years' | 'months';
}

export interface AmortizationPeriod {
  period: number; // Year or Month index
  label: string;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
  remainingBalance: number;
}

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalAmount: number;
  principal: number;
  tenureMonths: number;
  principalPercent: number;
  interestPercent: number;
  yearlySchedule: AmortizationPeriod[];
  isValid: boolean;
  errorMessage?: string;
}

export function calculateEmi(input: EmiInput): EmiResult {
  const principal = Math.max(0, input.principal || 0);
  const annualRate = Math.max(0, input.annualRate || 0);
  const tenure = Math.max(0, input.tenure || 0);

  // Validate bounds
  const tenureMonths = input.tenureUnit === 'years' ? Math.round(tenure * 12) : Math.round(tenure);

  if (principal <= 0 || tenureMonths <= 0) {
    return {
      monthlyEmi: 0,
      totalInterest: 0,
      totalAmount: principal,
      principal,
      tenureMonths,
      principalPercent: 100,
      interestPercent: 0,
      yearlySchedule: [],
      isValid: false,
      errorMessage: principal <= 0 ? 'Please enter a valid loan amount.' : 'Please enter a valid tenure.'
    };
  }

  // Hard sanity guard (max 100 Crore, max 100% interest, max 480 months / 40 years)
  if (tenureMonths > 480) {
    return {
      monthlyEmi: 0,
      totalInterest: 0,
      totalAmount: 0,
      principal,
      tenureMonths,
      principalPercent: 100,
      interestPercent: 0,
      yearlySchedule: [],
      isValid: false,
      errorMessage: 'Loan tenure cannot exceed 40 years (480 months).'
    };
  }

  let monthlyEmi = 0;
  let totalAmount = 0;
  let totalInterest = 0;

  // 1. Zero percent interest rate handling
  if (annualRate === 0) {
    monthlyEmi = Math.round(principal / tenureMonths);
    totalAmount = principal;
    totalInterest = 0;
  } else {
    // Standard reducing balance
    const monthlyRate = (annualRate / 12) / 100;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    const calculatedEmi = (principal * monthlyRate * factor) / (factor - 1);

    if (isNaN(calculatedEmi) || !isFinite(calculatedEmi)) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalAmount: 0,
        principal,
        tenureMonths,
        principalPercent: 100,
        interestPercent: 0,
        yearlySchedule: [],
        isValid: false,
        errorMessage: 'Calculation overflow. Please check your inputs.'
      };
    }

    monthlyEmi = Math.round(calculatedEmi);
    totalAmount = Math.round(monthlyEmi * tenureMonths);
    totalInterest = Math.max(0, totalAmount - principal);
  }

  // Compute percentages for distribution breakdown
  const principalPercent = totalAmount > 0 ? Math.round((principal / totalAmount) * 100) : 100;
  const interestPercent = Math.max(0, 100 - principalPercent);

  // 2. Generate Yearly Amortization Schedule
  const yearlySchedule: AmortizationPeriod[] = [];
  let balance = principal;
  const monthlyRate = (annualRate / 12) / 100;
  const totalYears = Math.ceil(tenureMonths / 12);

  for (let year = 1; year <= totalYears; year++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    const monthsInThisYear = Math.min(12, tenureMonths - (year - 1) * 12);

    for (let m = 1; m <= monthsInThisYear; m++) {
      if (balance <= 0) break;
      const interestForMonth = annualRate === 0 ? 0 : balance * monthlyRate;
      const principalForMonth = Math.min(balance, monthlyEmi - interestForMonth);

      yearInterest += interestForMonth;
      yearPrincipal += principalForMonth;
      balance = Math.max(0, balance - principalForMonth);
    }

    yearlySchedule.push({
      period: year,
      label: `Year ${year}`,
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      totalPayment: Math.round(yearPrincipal + yearInterest),
      remainingBalance: Math.round(balance)
    });

    if (balance <= 0) break;
  }

  return {
    monthlyEmi,
    totalInterest,
    totalAmount,
    principal,
    tenureMonths,
    principalPercent,
    interestPercent,
    yearlySchedule,
    isValid: true
  };
}
