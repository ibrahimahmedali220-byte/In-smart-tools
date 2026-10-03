/**
 * Automated Test Suite for Student Calculation Engines
 * Tests: Percentage Calculator, CGPA Calculator, Age Calculator, Word Counter.
 */

import { calculatePercentage } from './percentageCalculator';
import { calculateCgpa } from './cgpaCalculator';
import { calculateAge, isLeapYear } from './ageCalculator';
import { analyzeText } from './wordCounter';

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

console.log('--- RUNNING STUDENT TOOLS TEST SUITE ---');

// 1. Percentage Calculator Tests
console.log('\nTesting Percentage Calculator:');
{
  // A. What is 20% of 500? -> 100
  const p1 = calculatePercentage({ mode: 'percent_of', val1: 20, val2: 500 });
  assert(p1.isValid, 'Percentage: 20% of 500 is valid');
  assert(p1.result === 100, `Percentage: 20% of 500 is 100 (got ${p1.result})`);

  // B. 100 is what percentage of 500? -> 20%
  const p2 = calculatePercentage({ mode: 'what_percent', val1: 100, val2: 500 });
  assert(p2.isValid, 'Percentage: 100 out of 500 is valid');
  assert(p2.result === 20, `Percentage: 100 out of 500 is 20% (got ${p2.result})`);

  // Division by zero in what_percent
  const pZero = calculatePercentage({ mode: 'what_percent', val1: 100, val2: 0 });
  assert(!pZero.isValid, 'Percentage: Division by zero handled gracefully');

  // C. Percentage increase: from 500 to 600 -> 20%
  const pInc = calculatePercentage({ mode: 'increase', val1: 500, val2: 600 });
  assert(pInc.isValid && pInc.result === 20, `Percentage: Increase from 500 to 600 is 20% (got ${pInc.result})`);

  // D. Percentage decrease: from 600 to 500 -> 16.67%
  const pDec = calculatePercentage({ mode: 'decrease', val1: 600, val2: 500 });
  assert(pDec.isValid && Math.abs(pDec.result - 16.67) < 0.05, `Percentage: Decrease from 600 to 500 is ~16.67% (got ${pDec.result})`);
}

// 2. CGPA Calculator Tests
console.log('\nTesting CGPA Calculator:');
{
  // Test case 1: Weighted CGPA
  // Subject 1: GP 9, Credit 4 = 36
  // Subject 2: GP 8, Credit 3 = 24
  // Subject 3: GP 10, Credit 3 = 30
  // Total credits = 10, Total points = 90 -> CGPA = 9.0
  const cgpa1 = calculateCgpa({
    entries: [
      { id: '1', name: 'Mathematics', gradePoint: 9, credit: 4 },
      { id: '2', name: 'Physics', gradePoint: 8, credit: 3 },
      { id: '3', name: 'Computer Science', gradePoint: 10, credit: 3 }
    ],
    isWeighted: true,
    conversionFactor: 9.5
  });
  assert(cgpa1.isValid, 'CGPA: Weighted calculation is valid');
  assert(cgpa1.cgpa === 9.0, `CGPA: Calculated CGPA is 9.0 (got ${cgpa1.cgpa})`);
  assert(cgpa1.totalCredits === 10, `CGPA: Total credits is 10 (got ${cgpa1.totalCredits})`);
  assert(cgpa1.estimatedPercentage === 85.5, `CGPA: Percentage with 9.5x is 85.5% (got ${cgpa1.estimatedPercentage})`);

  // Test case 2: Simple average (unweighted)
  // Grades: 8, 9, 10 -> Average = 9.0
  const cgpaSimple = calculateCgpa({
    entries: [
      { id: '1', name: 'A', gradePoint: 8, credit: 1 },
      { id: '2', name: 'B', gradePoint: 9, credit: 1 },
      { id: '3', name: 'C', gradePoint: 10, credit: 1 }
    ],
    isWeighted: false
  });
  assert(cgpaSimple.cgpa === 9.0, 'CGPA: Simple average calculation is correct');

  // Test case 3: Zero credits guard
  const cgpaZero = calculateCgpa({
    entries: [{ id: '1', name: 'X', gradePoint: 9, credit: 0 }],
    isWeighted: true
  });
  assert(!cgpaZero.isValid, 'CGPA: Zero credit is safely rejected');
}

// 3. Age Calculator Tests
console.log('\nTesting Age Calculator:');
{
  // Test case 1: Known fixed dates
  // DOB: 2000-01-15, Target: 2026-10-03 -> 26 years, 8 months, 18 days
  const age1 = calculateAge({ dobString: '2000-01-15', targetDateString: '2026-10-03' });
  assert(age1.isValid, 'Age: Standard chronological age is valid');
  assert(age1.years === 26, `Age: Years is 26 (got ${age1.years})`);
  assert(age1.months === 8, `Age: Months is 8 (got ${age1.months})`);
  assert(age1.days === 18, `Age: Days is 18 (got ${age1.days})`);
  assert(age1.totalDays > 9000, 'Age: Total days is calculated');

  // Test case 2: Leap year leap baby
  assert(isLeapYear(2024), 'Age: 2024 is a leap year');
  assert(!isLeapYear(2025), 'Age: 2025 is not a leap year');
  const leapAge = calculateAge({ dobString: '2000-02-29', targetDateString: '2024-03-01' });
  assert(leapAge.isValid, 'Age: Leap year DOB is valid');
  assert(leapAge.isLeapYearBaby, 'Age: Correctly flags leap year baby');

  // Test case 3: Future DOB error handling
  const ageFuture = calculateAge({ dobString: '2030-01-01', targetDateString: '2026-10-03' });
  assert(!ageFuture.isValid, 'Age: Future DOB is rejected with error');
}

// 4. Word Counter Tests
console.log('\nTesting Word Counter:');
{
  // Test case 1: Standard English with multiple spaces and newlines
  const text1 = '  India   Smart Tools  is   fast. \n\nIt works   offline!  ';
  const w1 = analyzeText(text1);
  assert(w1.wordCount === 8, `Word Counter: Counts 8 words despite messy whitespace (got ${w1.wordCount})`);
  assert(w1.sentenceCount === 2, `Word Counter: Counts 2 sentences (got ${w1.sentenceCount})`);
  assert(w1.paragraphCount === 2, `Word Counter: Counts 2 paragraphs (got ${w1.paragraphCount})`);

  // Test case 2: Devanagari Hindi text with Purna Viram (।)
  const hindiText = 'भारत एक महान देश है। यहाँ कई भाषाएँ बोली जाती हैं।';
  const wHindi = analyzeText(hindiText);
  assert(wHindi.wordCount >= 8, `Word Counter: Handles Hindi text words (got ${wHindi.wordCount})`);
  assert(wHindi.sentenceCount === 2, `Word Counter: Splits Hindi sentences with Purna Viram (got ${wHindi.sentenceCount})`);

  // Test case 3: Bengali / Assamese text
  const bengaliText = 'আমি বাংলা ভালোবাসি। আপনি কেমন আছেন?';
  const wBengali = analyzeText(bengaliText);
  assert(wBengali.wordCount >= 5, `Word Counter: Handles Bengali words (got ${wBengali.wordCount})`);
  assert(wBengali.sentenceCount === 2, `Word Counter: Detects 2 sentences in Bengali (got ${wBengali.sentenceCount})`);

  // Test case 4: Empty string
  const wEmpty = analyzeText('');
  assert(wEmpty.wordCount === 0 && wEmpty.characterCount === 0, 'Word Counter: Empty string returns zero metrics');
}

console.log(`\n========================================`);
console.log(`STUDENT TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
}
