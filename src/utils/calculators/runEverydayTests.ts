/**
 * Automated Test Suite for Everyday Tools Calculation Engines
 * Tests: QR Generator, Password Generator, Unit Converter, Date Difference, and BMI Calculator.
 */

import {
  validateQrUrl,
  formatWifiPayload,
  formatEmailPayload,
  formatPhonePayload,
  generateQrPngDataUrl,
  generateQrSvgString
} from './qrGenerator';

import { generatePassword } from './passwordGenerator';
import { convertUnit, getUnitById } from '../converters/unitConverter';
import { calculateDateDifference } from './dateDifference';
import { calculateBmi, convertImperialToMetric } from './bmiCalculator';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, actual?: unknown, expected?: unknown) {
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} | Expected: ${expected}, Got: ${actual}`);
    failed++;
  }
}

console.log('--- RUNNING EVERYDAY TOOLS TEST SUITE ---');

// 1. QR Code Generator
console.log('\nTesting QR Generator Engine:');
const urlValid = validateQrUrl('https://example.com/path');
assert(urlValid.isValid, 'QR: https URL is valid');

const urlHttp = validateQrUrl('http://example.com');
assert(urlHttp.isValid, 'QR: http URL is valid');

const urlNoScheme = validateQrUrl('smartlytools.vercel.app');
assert(urlNoScheme.isValid && urlNoScheme.sanitizedUrl === 'https://smartlytools.vercel.app', 'QR: Auto-prepends https://');

const urlJs = validateQrUrl('javascript:alert(1)');
assert(!urlJs.isValid, 'QR: Blocks javascript: scheme');

const urlData = validateQrUrl('data:text/html,<script>alert(1)</script>');
assert(!urlData.isValid, 'QR: Blocks data: scheme');

const wifiWpa = formatWifiPayload({ ssid: 'MyNetwork;Test', password: 'pass:word', security: 'WPA' });
assert(wifiWpa === 'WIFI:T:WPA;S:MyNetwork\\;Test;P:pass\\:word;H:false;;', 'QR: Escapes Wi-Fi SSID and Password');

const emailPayload = formatEmailPayload({ to: 'user@example.com', subject: 'Hello World', body: 'Test Body' });
assert(emailPayload === 'mailto:user@example.com?subject=Hello%20World&body=Test%20Body', 'QR: Formats mailto link');

const phonePayload = formatPhonePayload('+91 (987) 654-3210');
assert(phonePayload === 'tel:+919876543210', 'QR: Cleans telephone number');

async function testQrAsync() {
  const png = await generateQrPngDataUrl('Hello World', { width: 200 });
  assert(png.startsWith('data:image/png;base64,'), 'QR: Generates valid PNG Data URL');

  const svg = await generateQrSvgString('https://smartlytools.vercel.app', { width: 250 });
  assert(svg.includes('<svg') && svg.includes('</svg>'), 'QR: Generates valid SVG markup');
}

// 2. Password Generator
console.log('\nTesting Password Generator Engine:');
const pass16 = generatePassword({ length: 16 });
assert(pass16.password.length === 16, 'Password: Generates 16 char password', pass16.password.length, 16);
assert(pass16.entropyBits >= 80, 'Password: 16-char full-charset has high entropy', pass16.entropyBits, '>=80');

const passMin = generatePassword({ length: 4 }); // Should clamp to 6
assert(passMin.password.length === 6, 'Password: Enforces minimum length 6', passMin.password.length, 6);

const passMax = generatePassword({ length: 200 }); // Should clamp to 128
assert(passMax.password.length === 128, 'Password: Enforces maximum length 128', passMax.password.length, 128);

const passNoUpper = generatePassword({
  length: 20,
  includeUppercase: false,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false
});
assert(!/[A-Z]/.test(passNoUpper.password), 'Password: Respects includeUppercase=false');
assert(/[a-z]/.test(passNoUpper.password), 'Password: Contains lowercase');
assert(/[0-9]/.test(passNoUpper.password), 'Password: Contains numbers');

const passNoAmbiguous = generatePassword({
  length: 30,
  excludeAmbiguous: true
});
const ambiguousList = ['1', 'l', 'I', '0', 'O', 'o', '|'];
const hasAmbiguous = ambiguousList.some(c => passNoAmbiguous.password.includes(c));
assert(!hasAmbiguous, 'Password: Excludes ambiguous characters when requested');

const passFallback = generatePassword({
  length: 12,
  includeUppercase: false,
  includeLowercase: false,
  includeNumbers: false,
  includeSymbols: false
});
assert(passFallback.password.length === 12, 'Password: Fallback defaults safely when no pool selected');

// 3. Unit Converter
console.log('\nTesting Unit Converter Engine:');
// Length
const mToKm = convertUnit(5000, 'meter', 'kilometer');
assert(mToKm.toValue === 5, 'Unit: 5000 m = 5 km', mToKm.toValue, 5);

const ftToM = convertUnit(10, 'foot', 'meter');
assert(Math.abs(ftToM.toValue - 3.048) < 1e-4, 'Unit: 10 ft = 3.048 m', ftToM.toValue, 3.048);

// Weight
const kgToLb = convertUnit(1, 'kilogram', 'pound');
assert(Math.abs(kgToLb.toValue - 2.20462) < 1e-4, 'Unit: 1 kg ≈ 2.20462 lb', kgToLb.toValue, 2.20462);

// Temperature
const cToF = convertUnit(100, 'celsius', 'fahrenheit');
assert(cToF.toValue === 212, 'Unit: 100°C = 212°F', cToF.toValue, 212);

const fToC = convertUnit(32, 'fahrenheit', 'celsius');
assert(fToC.toValue === 0, 'Unit: 32°F = 0°C', fToC.toValue, 0);

const cToK = convertUnit(0, 'celsius', 'kelvin');
assert(cToK.toValue === 273.15, 'Unit: 0°C = 273.15 K', cToK.toValue, 273.15);

// Traditional Indian Land Units
const sqYdToGaj = convertUnit(9, 'sq_foot', 'sq_yard');
assert(Math.abs(sqYdToGaj.toValue - 1) < 1e-9, 'Unit: 9 sq ft = 1 Gaj (sq yd)', sqYdToGaj.toValue, 1);

const gunthaToSqFt = convertUnit(1, 'guntha', 'sq_foot');
assert(Math.abs(gunthaToSqFt.toValue - 1089) < 1, 'Unit: 1 Guntha ≈ 1,089 sq ft', gunthaToSqFt.toValue, 1089);

const groundToSqFt = convertUnit(1, 'ground', 'sq_foot');
assert(Math.abs(groundToSqFt.toValue - 2400) < 1, 'Unit: 1 Ground ≈ 2,400 sq ft', groundToSqFt.toValue, 2400);

// Speed
const kmhToMs = convertUnit(90, 'km_per_h', 'm_per_s');
assert(kmhToMs.toValue === 25, 'Unit: 90 km/h = 25 m/s', kmhToMs.toValue, 25);

// Volume
const lToMl = convertUnit(2.5, 'liter', 'milliliter');
assert(lToMl.toValue === 2500, 'Unit: 2.5 L = 2500 mL', lToMl.toValue, 2500);

// Time
const hrToMin = convertUnit(3, 'hour', 'minute');
assert(hrToMin.toValue === 180, 'Unit: 3 hr = 180 min', hrToMin.toValue, 180);

// Identity
const sameUnit = convertUnit(42, 'meter', 'meter');
assert(sameUnit.toValue === 42, 'Unit: Same unit identity returns input value', sameUnit.toValue, 42);

// 4. Date Difference
console.log('\nTesting Date Difference Engine:');
const sameDate = calculateDateDifference('2026-05-15', '2026-05-15');
assert(sameDate.isSameDate && sameDate.totalDaysExclusive === 0, 'Date: Same date has 0 exclusive days');

const leapYearSpan = calculateDateDifference('2024-02-28', '2024-03-01');
assert(leapYearSpan.totalDaysExclusive === 2, 'Date: 2024 leap year Feb has 29 days (2 days diff)', leapYearSpan.totalDaysExclusive, 2);

const nonLeapYearSpan = calculateDateDifference('2025-02-28', '2025-03-01');
assert(nonLeapYearSpan.totalDaysExclusive === 1, 'Date: 2025 non-leap year Feb has 28 days (1 day diff)', nonLeapYearSpan.totalDaysExclusive, 1);

const multiYearSpan = calculateDateDifference('2024-01-15', '2026-04-20');
assert(multiYearSpan.years === 2 && multiYearSpan.months === 3 && multiYearSpan.days === 5, 'Date: Exact calendar breakdown 2y 3m 5d', multiYearSpan.calendarSummary, '2 years, 3 months, 5 days');

const invertedDate = calculateDateDifference('2026-10-10', '2026-05-10');
assert(invertedDate.isInverted && invertedDate.months === 5, 'Date: Gracefully handles inverted start/end order');

const businessDaysTest = calculateDateDifference('2026-05-01', '2026-05-08'); // Friday to Friday = 7 days, 5 working days
assert(businessDaysTest.workingDaysExclusive === 5, 'Date: Computes 5 working days in 7-day span', businessDaysTest.workingDaysExclusive, 5);

// 5. BMI Calculator
console.log('\nTesting BMI Calculator Engine:');
const standardBmi = calculateBmi(175, 70);
assert(standardBmi.isValid, 'BMI: Standard metric is valid');
assert(standardBmi.bmi === 22.9, 'BMI: 175cm / 70kg gives 22.9 BMI', standardBmi.bmi, 22.9);
assert(standardBmi.whoCategory.category === 'Normal', 'BMI: 22.9 is Normal for WHO', standardBmi.whoCategory.category, 'Normal');
assert(standardBmi.asianCategory.category === 'Normal', 'BMI: 22.9 is Normal for Asian-Indian (<23)', standardBmi.asianCategory.category, 'Normal');

const overweightAsian = calculateBmi(170, 68);
assert(overweightAsian.bmi === 23.5, 'BMI: 170cm / 68kg gives 23.5 BMI', overweightAsian.bmi, 23.5);
assert(overweightAsian.whoCategory.category === 'Normal', 'BMI: 23.5 is Normal for WHO (<25)', overweightAsian.whoCategory.category, 'Normal');
assert(overweightAsian.asianCategory.category === 'Overweight', 'BMI: 23.5 is Overweight for Asian-Indian (>=23)', overweightAsian.asianCategory.category, 'Overweight');

const imperialConv = convertImperialToMetric(5, 10, 154); // 5'10" (177.8cm), 154 lbs (69.9kg)
assert(Math.abs(imperialConv.heightCm - 177.8) < 0.2, 'BMI: Converts 5ft 10in to ~177.8 cm', imperialConv.heightCm, 177.8);
assert(Math.abs(imperialConv.weightKg - 69.9) < 0.2, 'BMI: Converts 154 lbs to ~69.9 kg', imperialConv.weightKg, 69.9);

const invalidBmi = calculateBmi(0, 70);
assert(!invalidBmi.isValid, 'BMI: Rejects zero height');

const negativeBmi = calculateBmi(170, -50);
assert(!negativeBmi.isValid, 'BMI: Rejects negative weight');

// Run async tests
testQrAsync().then(() => {
  console.log('\n========================================');
  console.log(`EVERYDAY TOOLS TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================');
  if (failed > 0) process.exit(1);
});
