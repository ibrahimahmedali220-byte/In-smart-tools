/**
 * Salary & In-Hand Take-Home Calculator
 * 
 * Computes monthly in-hand pay from annual Cost to Company (CTC),
 * factoring in Employee PF, Professional Tax, and estimated Income Tax under New & Old Regimes.
 */

export type TaxRegime = 'new' | 'old';
export type FinancialYear = 'FY 2025-26' | 'FY 2026-27';

export interface SalaryInput {
  annualCtc: number;
  financialYear: FinancialYear;
  regime: TaxRegime;
  customBasicSalary?: number; // If provided, overrides 40% default
  customPfMonthly?: number; // If provided, overrides 12% EPF
  customPtMonthly?: number; // Professional tax, default ₹200/month (₹2,400/yr)
  otherDeductionsMonthly?: number;
}

export interface SalaryDeductionBreakdown {
  employeePfAnnual: number;
  employeePfMonthly: number;
  professionalTaxAnnual: number;
  professionalTaxMonthly: number;
  incomeTaxAnnual: number;
  incomeTaxMonthly: number;
  otherDeductionsAnnual: number;
  otherDeductionsMonthly: number;
  totalDeductionsAnnual: number;
  totalDeductionsMonthly: number;
}

export interface SalaryResult {
  annualCtc: number;
  monthlyCtc: number;
  annualGross: number;
  monthlyGross: number;
  monthlyBasic: number;
  monthlyInHand: number;
  annualInHand: number;
  monthlyEpflDeduction: number;
  monthlyPt: number;
  monthlyTds: number;
  deductions: SalaryDeductionBreakdown;
  inHandAnnual: number;
  inHandMonthly: number;
  effectiveTaxRate: number;
  financialYear: FinancialYear;
  regime: TaxRegime;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Computes estimated annual income tax under the New Tax Regime (Section 115BAC)
 * Incorporating ₹75,000 salaried standard deduction and Section 87A rebate.
 */
function estimateNewRegimeTax(taxableIncome: number): number {
  // Salaried standard deduction: ₹75,000
  const netTaxable = Math.max(0, taxableIncome - 75000);

  // Full rebate under 87A if net taxable income is <= ₹7,00,000 (i.e. CTC up to ~₹7.75L is tax-free)
  if (netTaxable <= 700000) {
    return 0;
  }

  let tax = 0;
  // Slabs:
  // 0 - 3,00,000: Nil
  // 3,00,001 - 7,00,000: 5%
  // 7,00,001 - 10,00,000: 10%
  // 10,00,001 - 12,00,000: 15%
  // 12,00,001 - 15,00,000: 20%
  // Above 15,00,000: 30%

  if (netTaxable > 300000) {
    tax += Math.min(netTaxable - 300000, 400000) * 0.05;
  }
  if (netTaxable > 700000) {
    tax += Math.min(netTaxable - 700000, 300000) * 0.10;
  }
  if (netTaxable > 1000000) {
    tax += Math.min(netTaxable - 1000000, 200000) * 0.15;
  }
  if (netTaxable > 1200000) {
    tax += Math.min(netTaxable - 1200000, 300000) * 0.20;
  }
  if (netTaxable > 1500000) {
    tax += (netTaxable - 1500000) * 0.30;
  }

  // 4% Health & Education Cess
  const cess = tax * 0.04;
  return Math.round(tax + cess);
}

/**
 * Computes estimated annual income tax under the Old Tax Regime
 * Standard deduction of ₹50,000, 87A rebate up to ₹5,00,000.
 */
function estimateOldRegimeTax(taxableIncome: number): number {
  const netTaxable = Math.max(0, taxableIncome - 50000);

  if (netTaxable <= 500000) {
    return 0;
  }

  let tax = 0;
  if (netTaxable > 250000) {
    tax += Math.min(netTaxable - 250000, 250000) * 0.05;
  }
  if (netTaxable > 500000) {
    tax += Math.min(netTaxable - 500000, 500000) * 0.20;
  }
  if (netTaxable > 1000000) {
    tax += (netTaxable - 1000000) * 0.30;
  }

  const cess = tax * 0.04;
  return Math.round(tax + cess);
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const annualCtc = Math.max(0, input.annualCtc || 0);
  const financialYear = input.financialYear || 'FY 2025-26';
  const regime = input.regime || 'new';

  if (annualCtc <= 0) {
    return {
      annualCtc: 0,
      monthlyCtc: 0,
      annualGross: 0,
      monthlyGross: 0,
      monthlyBasic: 0,
      monthlyInHand: 0,
      annualInHand: 0,
      monthlyEpflDeduction: 0,
      monthlyPt: 0,
      monthlyTds: 0,
      deductions: {
        employeePfAnnual: 0,
        employeePfMonthly: 0,
        professionalTaxAnnual: 0,
        professionalTaxMonthly: 0,
        incomeTaxAnnual: 0,
        incomeTaxMonthly: 0,
        otherDeductionsAnnual: 0,
        otherDeductionsMonthly: 0,
        totalDeductionsAnnual: 0,
        totalDeductionsMonthly: 0
      },
      inHandAnnual: 0,
      inHandMonthly: 0,
      effectiveTaxRate: 0,
      financialYear,
      regime,
      isValid: false,
      errorMessage: 'Please enter a valid annual CTC.'
    };
  }

  const monthlyCtc = Math.round(annualCtc / 12);

  // 1. Basic Salary (standard benchmark is ~40% of CTC unless customized)
  const basicAnnual = input.customBasicSalary !== undefined && input.customBasicSalary > 0
    ? input.customBasicSalary
    : Math.round(annualCtc * 0.40);
  const basicMonthly = Math.round(basicAnnual / 12);

  // 2. Employee Provident Fund (EPF: 12% of basic, or custom amount)
  const pfMonthly = input.customPfMonthly !== undefined
    ? Math.max(0, input.customPfMonthly)
    : Math.round(basicMonthly * 0.12);
  const pfAnnual = pfMonthly * 12;

  // 3. Professional Tax (Standard across major states like Maharashtra/Karnataka/TN: ₹200/mo or ₹2,400/yr)
  const ptMonthly = input.customPtMonthly !== undefined
    ? Math.max(0, input.customPtMonthly)
    : 200;
  const ptAnnual = ptMonthly * 12;

  // 4. Other custom monthly deductions
  const otherMonthly = Math.max(0, input.otherDeductionsMonthly || 0);
  const otherAnnual = otherMonthly * 12;

  // 5. Estimated Income Tax (TDS)
  // Employer PF is also in CTC (~12%), so gross salary before employer PF deduction:
  const grossAnnual = annualCtc;
  const grossMonthly = monthlyCtc;

  const estimatedTaxAnnual = regime === 'new'
    ? estimateNewRegimeTax(grossAnnual)
    : estimateOldRegimeTax(grossAnnual);
  const estimatedTaxMonthly = Math.round(estimatedTaxAnnual / 12);

  // 6. Total Deductions
  const totalDeductionsAnnual = pfAnnual + ptAnnual + estimatedTaxAnnual + otherAnnual;
  const totalDeductionsMonthly = pfMonthly + ptMonthly + estimatedTaxMonthly + otherMonthly;

  // 7. Net Take-Home (In-Hand)
  const inHandAnnual = Math.max(0, grossAnnual - totalDeductionsAnnual);
  const inHandMonthly = Math.max(0, grossMonthly - totalDeductionsMonthly);

  const effectiveTaxRate = grossAnnual > 0
    ? Math.round((estimatedTaxAnnual / grossAnnual) * 1000) / 10
    : 0;

  return {
    annualCtc,
    monthlyCtc,
    annualGross: grossAnnual,
    monthlyGross: grossMonthly,
    monthlyBasic: basicMonthly,
    monthlyInHand: inHandMonthly,
    annualInHand: inHandAnnual,
    monthlyEpflDeduction: pfMonthly,
    monthlyPt: ptMonthly,
    monthlyTds: estimatedTaxMonthly,
    deductions: {
      employeePfAnnual: pfAnnual,
      employeePfMonthly: pfMonthly,
      professionalTaxAnnual: ptAnnual,
      professionalTaxMonthly: ptMonthly,
      incomeTaxAnnual: estimatedTaxAnnual,
      incomeTaxMonthly: estimatedTaxMonthly,
      otherDeductionsAnnual: otherAnnual,
      otherDeductionsMonthly: otherMonthly,
      totalDeductionsAnnual,
      totalDeductionsMonthly
    },
    inHandAnnual,
    inHandMonthly,
    effectiveTaxRate,
    financialYear,
    regime,
    isValid: true
  };
}
