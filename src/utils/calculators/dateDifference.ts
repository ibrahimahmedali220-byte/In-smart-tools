/**
 * Calendar-Aware Date Difference Calculator Engine
 * 
 * Accurately computes:
 * 1. Calendar Breakdown: Exact Years, Months, and Days
 * 2. Total Days (Inclusive vs. Exclusive)
 * 3. Total Weeks + Days
 * 4. Working Business Days (Excluding Saturdays & Sundays)
 * 
 * Handles leap years, February 28/29, varying month lengths, and inverted ranges.
 */

export interface DateDifferenceResult {
  isValid: boolean;
  error?: string;
  isSameDate: boolean;
  isInverted: boolean; // true if start date was after end date
  startDateStr: string;
  endDateStr: string;

  // Calendar Breakdown
  years: number;
  months: number;
  days: number;
  calendarSummary: string; // e.g. "2 years, 3 months, 12 days"

  // Aggregate Metrics (Exclusive: end - start)
  totalDaysExclusive: number;
  totalDaysInclusive: number;
  totalWeeks: number;
  remainingDaysAfterWeeks: number;
  totalHours: number;

  // Business Days
  workingDaysExclusive: number;
  workingDaysInclusive: number;
  weekendDays: number;
}

/**
 * Checks if a year is a leap year (Gregorian)
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Returns number of days in a specific month of a specific year (1-indexed month: 1=Jan, 12=Dec)
 */
function getDaysInMonth(year: number, month: number): number {
  switch (month) {
    case 1: return 31; // Jan
    case 2: return isLeapYear(year) ? 29 : 28; // Feb
    case 3: return 31; // Mar
    case 4: return 30; // Apr
    case 5: return 31; // May
    case 6: return 30; // Jun
    case 7: return 31; // Jul
    case 8: return 31; // Aug
    case 9: return 30; // Sep
    case 10: return 31; // Oct
    case 11: return 30; // Nov
    case 12: return 31; // Dec
    default: return 30;
  }
}

/**
 * Pure Calendar difference calculation (Years, Months, Days)
 */
function calculateCalendarSpan(
  startYear: number,
  startMonth: number,
  startDay: number,
  endYear: number,
  endMonth: number,
  endDay: number
): { years: number; months: number; days: number } {
  let years = endYear - startYear;
  let months = endMonth - startMonth;
  let days = endDay - startDay;

  if (days < 0) {
    // Borrow days from previous month
    months -= 1;
    // Month to borrow from is the month prior to endMonth
    let prevMonth = endMonth - 1;
    let prevYear = endYear;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    days += getDaysInMonth(prevYear, prevMonth);
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Computes business days (Monday through Friday) between two UTC Date representations
 */
function countBusinessDays(dStart: Date, dEnd: Date): { workingDays: number; weekendDays: number } {
  let workingDays = 0;
  let weekendDays = 0;

  const current = new Date(dStart.getTime());
  while (current < dEnd) {
    const dayOfWeek = current.getUTCDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendDays++;
    } else {
      workingDays++;
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return { workingDays, weekendDays };
}

/**
 * Main Date Difference calculation entry point
 */
export function calculateDateDifference(
  startDateInput: string,
  endDateInput: string,
  mode: 'exclusive' | 'inclusive' = 'exclusive'
): DateDifferenceResult {
  if (!startDateInput || !endDateInput) {
    return {
      isValid: false,
      error: 'Please select both start and end dates.',
      isSameDate: false,
      isInverted: false,
      startDateStr: startDateInput,
      endDateStr: endDateInput,
      years: 0,
      months: 0,
      days: 0,
      calendarSummary: '0 days',
      totalDaysExclusive: 0,
      totalDaysInclusive: 0,
      totalWeeks: 0,
      remainingDaysAfterWeeks: 0,
      totalHours: 0,
      workingDaysExclusive: 0,
      workingDaysInclusive: 0,
      weekendDays: 0
    };
  }

  const [sY, sM, sD] = startDateInput.split('-').map(Number);
  const [eY, eM, eD] = endDateInput.split('-').map(Number);

  if (!sY || !sM || !sD || !eY || !eM || !eD) {
    return {
      isValid: false,
      error: 'Invalid date format provided.',
      isSameDate: false,
      isInverted: false,
      startDateStr: startDateInput,
      endDateStr: endDateInput,
      years: 0,
      months: 0,
      days: 0,
      calendarSummary: '0 days',
      totalDaysExclusive: 0,
      totalDaysInclusive: 0,
      totalWeeks: 0,
      remainingDaysAfterWeeks: 0,
      totalHours: 0,
      workingDaysExclusive: 0,
      workingDaysInclusive: 0,
      weekendDays: 0
    };
  }

  const startUtc = Date.UTC(sY, sM - 1, sD);
  const endUtc = Date.UTC(eY, eM - 1, eD);

  const isSameDate = startUtc === endUtc;
  const isInverted = startUtc > endUtc;

  // Normalize chronological order
  const [startY, startMonth, startDay] = isInverted ? [eY, eM, eD] : [sY, sM, sD];
  const [endY, endMonth, endDay] = isInverted ? [sY, sM, sD] : [eY, eM, eD];

  const minUtc = Math.min(startUtc, endUtc);
  const maxUtc = Math.max(startUtc, endUtc);

  // 1. Calendar breakdown
  const { years, months, days } = calculateCalendarSpan(
    startY,
    startMonth,
    startDay,
    endY,
    endMonth,
    endDay
  );

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  const calendarSummary = parts.join(', ');

  // 2. Total Days
  const msInDay = 86400000;
  const totalDaysExclusive = Math.round((maxUtc - minUtc) / msInDay);
  const totalDaysInclusive = totalDaysExclusive + 1;

  // 3. Weeks
  const effectiveDays = mode === 'inclusive' ? totalDaysInclusive : totalDaysExclusive;
  const totalWeeks = Math.floor(effectiveDays / 7);
  const remainingDaysAfterWeeks = effectiveDays % 7;
  const totalHours = effectiveDays * 24;

  // 4. Business Days
  const dStart = new Date(minUtc);
  const dEndExclusive = new Date(maxUtc);
  const dEndInclusive = new Date(maxUtc + msInDay);

  const { workingDays: workingDaysExclusive, weekendDays } = countBusinessDays(dStart, dEndExclusive);
  const { workingDays: workingDaysInclusive } = countBusinessDays(dStart, dEndInclusive);

  return {
    isValid: true,
    isSameDate,
    isInverted,
    startDateStr: startDateInput,
    endDateStr: endDateInput,
    years,
    months,
    days,
    calendarSummary,
    totalDaysExclusive,
    totalDaysInclusive,
    totalWeeks,
    remainingDaysAfterWeeks,
    totalHours,
    workingDaysExclusive,
    workingDaysInclusive,
    weekendDays
  };
}
