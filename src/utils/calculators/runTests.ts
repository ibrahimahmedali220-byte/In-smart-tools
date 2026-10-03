/**
 * Automated Test Suite for Financial Calculation Engines
 * Tests: EMI, SIP, GST, Salary, and FD calculations.
 */

import { calculateEmi } from './emiCalculator';
import { calculateSip } from './sipCalculator';
import { calculateGst } from './gstCalculator';
import { calculateSalary } from './salaryCalculator';
import { calculateFd } from './fdCalculator';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${testName}`);
  } else {
    failed++;
    console.error(`  ✗ ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

console.log('--- RUNNING FINANCE CALCULATORS TEST SUITE ---');

// 1. EMI Calculator Tests
console.log('\nTesting EMI Calculator:');
{
  // Test case 1: Standard Home Loan (₹10,00,000, 8.5%, 20 years = 240 months)
  // Expected EMI: ~₹8,678
  const emi1 = calculateEmi({ principal: 1000000, annualRate: 8.5, tenure: 20, tenureUnit: 'years' });
  assert(emi1.isValid, 'EMI: Standard loan is valid');
  assert(emi1.monthlyEmi >= 8670 && emi1.monthlyEmi <= 8685, `EMI: Monthly EMI is correct (got ${emi1.monthlyEmi}, expected ~8678)`);
  assert(emi1.totalAmount > emi1.principal, 'EMI: Total payment exceeds principal');
  assert(emi1.totalInterest > 0, 'EMI: Total interest is calculated');
  assert(emi1.yearlySchedule.length === 20, `EMI: Yearly schedule has 20 periods (got ${emi1.yearlySchedule.length})`);

  // Test case 2: 0% Interest Loan
  const emiZero = calculateEmi({ principal: 120000, annualRate: 0, tenure: 12, tenureUnit: 'months' });
  assert(emiZero.isValid, 'EMI: 0% loan is valid');
  assert(emiZero.monthlyEmi === 10000, `EMI: 0% loan EMI equals P/N (got ${emiZero.monthlyEmi}, expected 10000)`);
  assert(emiZero.totalInterest === 0, 'EMI: 0% loan has zero interest');

  // Test case 3: Edge cases (0 principal, negative, tenure > 40 yrs)
  const emiInvalid = calculateEmi({ principal: 0, annualRate: 8.5, tenure: 5, tenureUnit: 'years' });
  assert(!emiInvalid.isValid, 'EMI: Zero principal is marked invalid');

  const emiTooLong = calculateEmi({ principal: 500000, annualRate: 8.5, tenure: 50, tenureUnit: 'years' });
  assert(!emiTooLong.isValid, 'EMI: Over 40 years tenure is rejected');
}

// 2. SIP Calculator Tests
console.log('\nTesting SIP Calculator:');
{
  // Test case 1: Standard monthly SIP (₹5,000/mo, 12% annual return, 10 years = 120 months)
  // Invested: ₹6,00,000, Estimated Final Value: ~₹11,61,695
  const sip1 = calculateSip({ monthlyInvestment: 5000, expectedAnnualReturn: 12, duration: 10, durationUnit: 'years' });
  assert(sip1.isValid, 'SIP: Standard calculation is valid');
  assert(sip1.totalInvested === 600000, `SIP: Total invested is 600000 (got ${sip1.totalInvested})`);
  assert(sip1.estimatedFinalValue >= 1150000 && sip1.estimatedFinalValue <= 1180000, `SIP: Final value is ~11.6L (got ${sip1.estimatedFinalValue})`);
  assert(sip1.estimatedReturns > 0, 'SIP: Estimated returns are positive');

  // Test case 2: 0% return
  const sipZero = calculateSip({ monthlyInvestment: 2000, expectedAnnualReturn: 0, duration: 12, durationUnit: 'months' });
  assert(sipZero.isValid, 'SIP: 0% return is valid');
  assert(sipZero.estimatedFinalValue === 24000, `SIP: 0% return final value equals invested (got ${sipZero.estimatedFinalValue})`);
  assert(sipZero.estimatedReturns === 0, 'SIP: 0% return has zero returns');

  // Test case 3: Invalid input
  const sipInvalid = calculateSip({ monthlyInvestment: 0, expectedAnnualReturn: 12, duration: 5, durationUnit: 'years' });
  assert(!sipInvalid.isValid, 'SIP: Zero investment is marked invalid');
}

// 3. GST Calculator Tests
console.log('\nTesting GST Calculator:');
{
  // Test case 1: Add GST (₹1,000 base, 18% GST)
  // Expected GST: ₹180, Final: ₹1,180, CGST: ₹90, SGST: ₹90
  const gstAdd = calculateGst({ amount: 1000, rate: 18, mode: 'add' });
  assert(gstAdd.isValid, 'GST: Add GST is valid');
  assert(gstAdd.gstAmount === 180, `GST: Add GST amount is 180 (got ${gstAdd.gstAmount})`);
  assert(gstAdd.finalAmount === 1180, `GST: Add final amount is 1180 (got ${gstAdd.finalAmount})`);
  assert(gstAdd.cgst === 90 && gstAdd.sgst === 90, 'GST: CGST/SGST split is 50/50');

  // Test case 2: Remove GST (₹1,180 inclusive, 18% GST)
  // Expected Base: ₹1,000, GST: ₹180
  const gstRemove = calculateGst({ amount: 1180, rate: 18, mode: 'remove' });
  assert(gstRemove.isValid, 'GST: Remove GST is valid');
  assert(Math.round(gstRemove.baseAmount) === 1000, `GST: Remove base amount is 1000 (got ${gstRemove.baseAmount})`);
  assert(Math.round(gstRemove.gstAmount) === 180, `GST: Remove GST amount is 180 (got ${gstRemove.gstAmount})`);

  // Test case 3: 0% GST
  const gstZero = calculateGst({ amount: 500, rate: 0, mode: 'add' });
  assert(gstZero.gstAmount === 0 && gstZero.finalAmount === 500, 'GST: 0% rate produces 0 GST');

  // Test case 4: Invalid amount
  const gstInvalid = calculateGst({ amount: -100, rate: 18, mode: 'add' });
  assert(!gstInvalid.isValid, 'GST: Negative amount is rejected');
}

// 4. Salary Calculator Tests
console.log('\nTesting Salary Calculator:');
{
  // Test case 1: Standard salaried CTC (₹6,00,000 New Regime FY 2025-26)
  // Tax should be 0 because net taxable is <= ₹7,00,000 after standard deduction
  const sal1 = calculateSalary({ annualCtc: 600000, financialYear: 'FY 2025-26', regime: 'new' });
  assert(sal1.isValid, 'Salary: Standard CTC calculation is valid');
  assert(sal1.deductions.incomeTaxAnnual === 0, `Salary: CTC 6L has 0 income tax under new regime rebate (got ${sal1.deductions.incomeTaxAnnual})`);
  assert(sal1.inHandMonthly > 0, `Salary: Monthly take-home is positive (got ${sal1.inHandMonthly})`);
  assert(sal1.deductions.employeePfMonthly > 0, 'Salary: EPF is deducted');
  assert(sal1.deductions.professionalTaxMonthly === 200, 'Salary: Standard professional tax ₹200/mo is applied');

  // Test case 2: High income CTC (₹15,00,000 New Regime)
  const sal2 = calculateSalary({ annualCtc: 1500000, financialYear: 'FY 2025-26', regime: 'new' });
  assert(sal2.isValid, 'Salary: 15L CTC is valid');
  assert(sal2.deductions.incomeTaxAnnual > 0, 'Salary: 15L CTC incurs income tax');
  assert(sal2.inHandAnnual < sal2.annualGross, 'Salary: In-hand is strictly less than gross');

  // Test case 3: Zero CTC
  const salZero = calculateSalary({ annualCtc: 0, financialYear: 'FY 2025-26', regime: 'new' });
  assert(!salZero.isValid, 'Salary: Zero CTC is rejected');
}

// 5. FD Calculator Tests
console.log('\nTesting FD Calculator:');
{
  // Test case 1: Standard FD (₹1,00,000 at 7.0% for 5 years, quarterly compounding)
  // A = 100000 * (1 + 0.07/4)^(20) = ~₹1,41,478
  const fd1 = calculateFd({ principal: 100000, annualRate: 7.0, tenure: 5, tenureUnit: 'years', compoundingFrequency: 'quarterly' });
  assert(fd1.isValid, 'FD: Standard deposit is valid');
  assert(fd1.maturityAmount >= 141000 && fd1.maturityAmount <= 142000, `FD: Maturity amount is ~1.41L (got ${fd1.maturityAmount})`);
  assert(fd1.interestEarned === fd1.maturityAmount - fd1.principal, 'FD: Interest equals maturity minus principal');

  // Test case 2: Senior Citizen option (+0.50%)
  const fdSenior = calculateFd({ principal: 100000, annualRate: 7.0, tenure: 5, tenureUnit: 'years', compoundingFrequency: 'quarterly', isSeniorCitizen: true });
  assert(fdSenior.effectiveRate === 7.5, `FD: Senior rate adds 0.50% (got ${fdSenior.effectiveRate})`);
  assert(fdSenior.maturityAmount > fd1.maturityAmount, 'FD: Senior citizen receives higher maturity amount');

  // Test case 3: 0% interest
  const fdZero = calculateFd({ principal: 50000, annualRate: 0, tenure: 2, tenureUnit: 'years', compoundingFrequency: 'yearly' });
  assert(fdZero.maturityAmount === 50000, 'FD: 0% interest returns exact principal');
  assert(fdZero.interestEarned === 0, 'FD: 0% interest has zero interest earned');
}

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
