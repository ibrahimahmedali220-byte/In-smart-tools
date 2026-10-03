/**
 * CGPA & SGPA Calculator Engine
 * 
 * Supports:
 * 1. Weighted CGPA: CGPA = Σ(Grade Point × Credit) / Σ(Credit)
 * 2. Simple Average: CGPA = Σ(Grade Point) / N
 * 3. Configurable CGPA to Percentage Conversion (Default 9.5, or user-selected factor)
 */

export interface SubjectEntry {
  id: string;
  name: string;
  gradePoint: number; // 0 to 10
  credit: number;     // e.g. 1 to 6
}

export interface CgpaInput {
  entries: SubjectEntry[];
  isWeighted: boolean;
  conversionFactor?: number; // e.g. 9.5 for CBSE/AICTE, 10.0, etc.
}

export interface CgpaResult {
  cgpa: number;
  totalCredits: number;
  totalWeightedPoints: number;
  subjectCount: number;
  estimatedPercentage: number;
  conversionFactor: number;
  isWeighted: boolean;
  isValid: boolean;
  errorMessage?: string;
}

export function calculateCgpa(input: CgpaInput): CgpaResult {
  const { entries, isWeighted, conversionFactor = 9.5 } = input;

  // Filter out completely empty or invalid entries
  const validEntries = entries.filter(e => {
    return !isNaN(e.gradePoint) && e.gradePoint >= 0 && (!isWeighted || (!isNaN(e.credit) && e.credit >= 0));
  });

  if (validEntries.length === 0) {
    return {
      cgpa: 0,
      totalCredits: 0,
      totalWeightedPoints: 0,
      subjectCount: 0,
      estimatedPercentage: 0,
      conversionFactor,
      isWeighted,
      isValid: false,
      errorMessage: 'Please add at least one subject with a valid grade point.'
    };
  }

  let totalCredits = 0;
  let totalWeightedPoints = 0;
  let simpleSum = 0;

  for (const entry of validEntries) {
    const gp = Math.min(10, Math.max(0, entry.gradePoint));
    const credit = Math.max(0, entry.credit);

    simpleSum += gp;
    totalCredits += credit;
    totalWeightedPoints += gp * credit;
  }

  let cgpa = 0;

  if (isWeighted) {
    if (totalCredits <= 0) {
      return {
        cgpa: 0,
        totalCredits: 0,
        totalWeightedPoints: 0,
        subjectCount: validEntries.length,
        estimatedPercentage: 0,
        conversionFactor,
        isWeighted,
        isValid: false,
        errorMessage: 'Total course credits must be greater than zero for weighted calculation.'
      };
    }
    cgpa = totalWeightedPoints / totalCredits;
  } else {
    cgpa = simpleSum / validEntries.length;
  }

  // Round CGPA to 2 decimal places
  const roundedCgpa = Math.round(cgpa * 100) / 100;
  const factor = Math.max(0, conversionFactor);
  const estimatedPercentage = Math.round(roundedCgpa * factor * 100) / 100;

  return {
    cgpa: roundedCgpa,
    totalCredits,
    totalWeightedPoints: Math.round(totalWeightedPoints * 100) / 100,
    subjectCount: validEntries.length,
    estimatedPercentage,
    conversionFactor: factor,
    isWeighted,
    isValid: true
  };
}
