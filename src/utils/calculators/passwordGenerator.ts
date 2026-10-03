/**
 * Cryptographically Secure Password Generator Engine
 * 
 * Uses Web Crypto API (crypto.getRandomValues) exclusively.
 * Computes descriptive information-theoretic entropy bit scores.
 * Zero storage, zero network transmission, zero predictable pseudorandomness.
 */

export interface PasswordOptions {
  length: number; // 6 to 128
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeAmbiguous?: boolean;
}

export interface PasswordResult {
  password: string;
  entropyBits: number;
  strengthLabel: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  crackTimeEstimate: string;
}

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS_CHARS = new Set(['1', 'l', 'I', '0', 'O', 'o', '|', '`', '\'', '"', ';', ':']);

/**
 * Generates cryptographically secure random integers in range [0, max - 1]
 * using rejection sampling to eliminate modulo bias.
 */
function getSecureRandomInt(max: number): number {
  if (max <= 0) return 0;
  if (max === 1) return 0;

  const cryptoObj = typeof window !== 'undefined' ? window.crypto : (globalThis as unknown as { crypto: Crypto }).crypto;
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Cryptographically secure random number generator (Web Crypto API) is unavailable in this environment.');
  }

  // Rejection sampling against 32-bit integer overflow
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % max);
  const buffer = new Uint32Array(1);

  let randomVal: number;
  do {
    cryptoObj.getRandomValues(buffer);
    randomVal = buffer[0];
  } while (randomVal >= limit);

  return randomVal % max;
}

/**
 * Generates a strong random password based on the provided configuration.
 */
export function generatePassword(options: PasswordOptions): PasswordResult {
  const length = Math.max(6, Math.min(128, options.length || 16));
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = true,
    excludeAmbiguous = false
  } = options;

  let upper = UPPERCASE_CHARS;
  let lower = LOWERCASE_CHARS;
  let numbers = NUMBER_CHARS;
  let symbols = SYMBOL_CHARS;

  if (excludeAmbiguous) {
    upper = upper.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('');
    lower = lower.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('');
    numbers = numbers.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('');
    symbols = symbols.split('').filter(c => !AMBIGUOUS_CHARS.has(c)).join('');
  }

  const selectedPools: string[] = [];
  if (includeUppercase && upper.length > 0) selectedPools.push(upper);
  if (includeLowercase && lower.length > 0) selectedPools.push(lower);
  if (includeNumbers && numbers.length > 0) selectedPools.push(numbers);
  if (includeSymbols && symbols.length > 0) selectedPools.push(symbols);

  // If no pool selected, default safely to lowercase
  if (selectedPools.length === 0) {
    selectedPools.push(lower);
  }

  const combinedCharset = selectedPools.join('');
  const passwordChars: string[] = [];

  // Guarantee at least one character from each selected pool
  for (const pool of selectedPools) {
    if (passwordChars.length < length) {
      const idx = getSecureRandomInt(pool.length);
      passwordChars.push(pool[idx]);
    }
  }

  // Fill remaining characters from combined charset
  while (passwordChars.length < length) {
    const idx = getSecureRandomInt(combinedCharset.length);
    passwordChars.push(combinedCharset[idx]);
  }

  // Fisher-Yates shuffle using cryptographically secure randomness
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    const temp = passwordChars[i];
    passwordChars[i] = passwordChars[j];
    passwordChars[j] = temp;
  }

  const password = passwordChars.join('');

  // Calculate Shannon entropy bits: E = L * log2(poolSize)
  const poolSize = combinedCharset.length;
  const entropyBits = Math.round(length * Math.log2(poolSize));

  let strengthLabel: PasswordResult['strengthLabel'] = 'Weak';
  let crackTimeEstimate = 'Few seconds';

  if (entropyBits < 36) {
    strengthLabel = 'Very Weak';
    crackTimeEstimate = 'Instantly';
  } else if (entropyBits < 50) {
    strengthLabel = 'Weak';
    crackTimeEstimate = 'Minutes to hours';
  } else if (entropyBits < 70) {
    strengthLabel = 'Moderate';
    crackTimeEstimate = 'Several days to months';
  } else if (entropyBits < 90) {
    strengthLabel = 'Strong';
    crackTimeEstimate = 'Centuries (brute force)';
  } else {
    strengthLabel = 'Very Strong';
    crackTimeEstimate = 'Millions of years';
  }

  return {
    password,
    entropyBits,
    strengthLabel,
    crackTimeEstimate
  };
}
