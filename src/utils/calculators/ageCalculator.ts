/**
 * Calendar-Aware Chronological Age Calculator Engine
 * 
 * Computes exact chronological age in Years, Months, and Days as of a target date.
 * Accurately accounts for leap years and varying days in each calendar month.
 */

export interface AgeInput {
  dobString: string;       // YYYY-MM-DD
  targetDateString: string; // YYYY-MM-DD (defaults to current date)
}

export interface NextBirthdayInfo {
  monthsRemaining: number;
  daysRemaining: number;
  dayOfWeek: string;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  nextBirthday: NextBirthdayInfo;
  isLeapYearBaby: boolean;
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Returns number of days in a specific year and month (1-indexed month: 1=Jan, 12=Dec)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Checks if a given year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function calculateAge(input: AgeInput): AgeResult {
  const { dobString, targetDateString } = input;

  if (!dobString || !targetDateString) {
    return createEmptyResult('Please enter both date of birth and target date.');
  }

  const dobParts = dobString.split('-').map(Number);
  const targetParts = targetDateString.split('-').map(Number);

  if (dobParts.length !== 3 || targetParts.length !== 3) {
    return createEmptyResult('Invalid date format. Use YYYY-MM-DD.');
  }

  const [bYear, bMonth, bDay] = dobParts;
  const [tYear, tMonth, tDay] = targetParts;

  const birthDate = new Date(bYear, bMonth - 1, bDay);
  const targetDate = new Date(tYear, tMonth - 1, tDay);

  if (isNaN(birthDate.getTime()) || isNaN(targetDate.getTime())) {
    return createEmptyResult('Invalid calendar date provided.');
  }

  if (birthDate > targetDate) {
    return createEmptyResult('Date of birth cannot be in the future relative to the target date.');
  }

  // Exact calendar-aware math
  let years = tYear - bYear;
  let months = tMonth - bMonth;
  let days = tDay - bDay;

  // If days are negative, borrow from previous month
  if (days < 0) {
    months -= 1;
    // Previous month relative to target
    const prevMonth = tMonth === 1 ? 12 : tMonth - 1;
    const prevYear = tMonth === 1 ? tYear - 1 : tYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    days += daysInPrevMonth;
  }

  // If months are negative, borrow from years
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Calculate total elapsed days
  const diffMs = targetDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;

  // Next Birthday calculation
  let nextBdayYear = tYear;
  let nextBdayMonth = bMonth;
  let nextBdayDay = bDay;

  // Handle Feb 29 for non-leap years (celebrate on Feb 28 or March 1)
  if (bMonth === 2 && bDay === 29 && !isLeapYear(nextBdayYear)) {
    nextBdayDay = 28;
  }

  let nextBdayDate = new Date(nextBdayYear, nextBdayMonth - 1, nextBdayDay);
  if (nextBdayDate < targetDate) {
    nextBdayYear += 1;
    if (bMonth === 2 && bDay === 29 && !isLeapYear(nextBdayYear)) {
      nextBdayDay = 28;
    }
    nextBdayDate = new Date(nextBdayYear, nextBdayMonth - 1, nextBdayDay);
  }

  // Compute countdown to next birthday
  let nbMonths = nextBdayDate.getMonth() - targetDate.getMonth();
  let nbDays = nextBdayDate.getDate() - targetDate.getDate();

  if (nbDays < 0) {
    nbMonths -= 1;
    const prevM = targetDate.getMonth() === 0 ? 12 : targetDate.getMonth();
    const prevY = targetDate.getMonth() === 0 ? targetDate.getFullYear() - 1 : targetDate.getFullYear();
    nbDays += getDaysInMonth(prevY, prevM);
  }
  if (nbMonths < 0) {
    nbMonths += 12;
  }

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const nextBirthdayDayOfWeek = daysOfWeek[nextBdayDate.getDay()];

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    nextBirthday: {
      monthsRemaining: nbMonths,
      daysRemaining: nbDays,
      dayOfWeek: nextBirthdayDayOfWeek
    },
    isLeapYearBaby: bMonth === 2 && bDay === 29,
    isValid: true
  };
}

function createEmptyResult(msg: string): AgeResult {
  return {
    years: 0,
    months: 0,
    days: 0,
    totalDays: 0,
    totalWeeks: 0,
    totalMonths: 0,
    nextBirthday: { monthsRemaining: 0, daysRemaining: 0, dayOfWeek: '' },
    isLeapYearBaby: false,
    isValid: false,
    errorMessage: msg
  };
}
