/**
 * Multi-Category Unit Conversion Engine
 * 
 * Implements pure mathematical base-unit conversions for linear categories
 * and specialized non-linear formulas for Temperature.
 * Includes regional land measurement units (Bigha, Guntha, Ground, Marla, Gaj).
 */

export type UnitCategory =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'area'
  | 'volume'
  | 'time'
  | 'speed';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
  toBase: (val: number) => number;
  fromBase: (baseVal: number) => number;
  description?: string;
}

export interface UnitCategoryMeta {
  id: UnitCategory;
  name: string;
  baseUnit: string;
  defaultFrom: string;
  defaultTo: string;
}

export const UNIT_CATEGORIES: UnitCategoryMeta[] = [
  { id: 'length', name: 'Length', baseUnit: 'm', defaultFrom: 'meter', defaultTo: 'kilometer' },
  { id: 'weight', name: 'Weight & Mass', baseUnit: 'kg', defaultFrom: 'kilogram', defaultTo: 'pound' },
  { id: 'temperature', name: 'Temperature', baseUnit: 'celsius', defaultFrom: 'celsius', defaultTo: 'fahrenheit' },
  { id: 'area', name: 'Area & Land', baseUnit: 'sq_meter', defaultFrom: 'sq_meter', defaultTo: 'sq_foot' },
  { id: 'volume', name: 'Volume & Capacity', baseUnit: 'liter', defaultFrom: 'liter', defaultTo: 'milliliter' },
  { id: 'time', name: 'Time', baseUnit: 'second', defaultFrom: 'hour', defaultTo: 'minute' },
  { id: 'speed', name: 'Speed', baseUnit: 'm_per_s', defaultFrom: 'km_per_h', defaultTo: 'm_per_s' }
];

export const UNITS: UnitDefinition[] = [
  // 1. Length (Base: Meter)
  { id: 'millimeter', name: 'Millimeter', symbol: 'mm', category: 'length', toBase: v => v * 0.001, fromBase: b => b / 0.001 },
  { id: 'centimeter', name: 'Centimeter', symbol: 'cm', category: 'length', toBase: v => v * 0.01, fromBase: b => b / 0.01 },
  { id: 'meter', name: 'Meter', symbol: 'm', category: 'length', toBase: v => v, fromBase: b => b },
  { id: 'kilometer', name: 'Kilometer', symbol: 'km', category: 'length', toBase: v => v * 1000, fromBase: b => b / 1000 },
  { id: 'inch', name: 'Inch', symbol: 'in', category: 'length', toBase: v => v * 0.0254, fromBase: b => b / 0.0254 },
  { id: 'foot', name: 'Foot', symbol: 'ft', category: 'length', toBase: v => v * 0.3048, fromBase: b => b / 0.3048 },
  { id: 'yard', name: 'Yard', symbol: 'yd', category: 'length', toBase: v => v * 0.9144, fromBase: b => b / 0.9144 },
  { id: 'mile', name: 'Mile', symbol: 'mi', category: 'length', toBase: v => v * 1609.344, fromBase: b => b / 1609.344 },

  // 2. Weight / Mass (Base: Kilogram)
  { id: 'milligram', name: 'Milligram', symbol: 'mg', category: 'weight', toBase: v => v * 1e-6, fromBase: b => b / 1e-6 },
  { id: 'gram', name: 'Gram', symbol: 'g', category: 'weight', toBase: v => v * 0.001, fromBase: b => b / 0.001 },
  { id: 'kilogram', name: 'Kilogram', symbol: 'kg', category: 'weight', toBase: v => v, fromBase: b => b },
  { id: 'ounce', name: 'Ounce', symbol: 'oz', category: 'weight', toBase: v => v * 0.028349523125, fromBase: b => b / 0.028349523125 },
  { id: 'pound', name: 'Pound', symbol: 'lb', category: 'weight', toBase: v => v * 0.45359237, fromBase: b => b / 0.45359237 },
  { id: 'ton', name: 'Metric Ton', symbol: 't', category: 'weight', toBase: v => v * 1000, fromBase: b => b / 1000 },

  // 3. Temperature (Base: Celsius)
  {
    id: 'celsius',
    name: 'Celsius',
    symbol: '°C',
    category: 'temperature',
    toBase: v => v,
    fromBase: b => b
  },
  {
    id: 'fahrenheit',
    name: 'Fahrenheit',
    symbol: '°F',
    category: 'temperature',
    toBase: v => ((v - 32) * 5) / 9,
    fromBase: b => (b * 9) / 5 + 32
  },
  {
    id: 'kelvin',
    name: 'Kelvin',
    symbol: 'K',
    category: 'temperature',
    toBase: v => v - 273.15,
    fromBase: b => b + 273.15
  },

  // 4. Area & Traditional Land (Base: Square Meter)
  { id: 'sq_meter', name: 'Square Meter', symbol: 'm²', category: 'area', toBase: v => v, fromBase: b => b },
  { id: 'sq_kilometer', name: 'Square Kilometer', symbol: 'km²', category: 'area', toBase: v => v * 1e6, fromBase: b => b / 1e6 },
  { id: 'sq_foot', name: 'Square Foot', symbol: 'sq ft', category: 'area', toBase: v => v * 0.09290304, fromBase: b => b / 0.09290304 },
  { id: 'sq_yard', name: 'Square Yard (Gaj)', symbol: 'sq yd (Gaj)', category: 'area', toBase: v => v * 0.83612736, fromBase: b => b / 0.83612736, description: '1 Gaj = 9 sq ft' },
  { id: 'acre', name: 'Acre', symbol: 'ac', category: 'area', toBase: v => v * 4046.8564224, fromBase: b => b / 4046.8564224 },
  { id: 'hectare', name: 'Hectare', symbol: 'ha', category: 'area', toBase: v => v * 10000, fromBase: b => b / 10000 },
  { id: 'bigha', name: 'Bigha (Standard)', symbol: 'Bigha', category: 'area', toBase: v => v * 2500, fromBase: b => b / 2500, description: 'Standard regional reference (~26,910 sq ft)' },
  { id: 'guntha', name: 'Guntha (MH / KA / GJ)', symbol: 'Guntha', category: 'area', toBase: v => v * 101.17141, fromBase: b => b / 101.17141, description: '1 Guntha = 1,089 sq ft (33 ft × 33 ft)' },
  { id: 'ground', name: 'Ground (Tamil Nadu)', symbol: 'Ground', category: 'area', toBase: v => v * 222.967, fromBase: b => b / 222.967, description: '1 Ground = 2,400 sq ft' },
  { id: 'marla', name: 'Marla (Punjab / Haryana)', symbol: 'Marla', category: 'area', toBase: v => v * 25.29285, fromBase: b => b / 25.29285, description: '1 Marla = ~272.25 sq ft' },
  { id: 'kanal', name: 'Kanal (Punjab / Haryana)', symbol: 'Kanal', category: 'area', toBase: v => v * 505.857, fromBase: b => b / 505.857, description: '1 Kanal = 20 Marlas = ~5,445 sq ft' },

  // 5. Volume (Base: Liter)
  { id: 'milliliter', name: 'Milliliter', symbol: 'mL', category: 'volume', toBase: v => v * 0.001, fromBase: b => b / 0.001 },
  { id: 'liter', name: 'Liter', symbol: 'L', category: 'volume', toBase: v => v, fromBase: b => b },
  { id: 'cubic_meter', name: 'Cubic Meter', symbol: 'm³', category: 'volume', toBase: v => v * 1000, fromBase: b => b / 1000 },
  { id: 'gallon_us', name: 'Gallon (US)', symbol: 'gal', category: 'volume', toBase: v => v * 3.785411784, fromBase: b => b / 3.785411784 },
  { id: 'cup_us', name: 'Cup (US)', symbol: 'cup', category: 'volume', toBase: v => v * 0.2365882365, fromBase: b => b / 0.2365882365 },

  // 6. Time (Base: Second)
  { id: 'millisecond', name: 'Millisecond', symbol: 'ms', category: 'time', toBase: v => v * 0.001, fromBase: b => b / 0.001 },
  { id: 'second', name: 'Second', symbol: 's', category: 'time', toBase: v => v, fromBase: b => b },
  { id: 'minute', name: 'Minute', symbol: 'min', category: 'time', toBase: v => v * 60, fromBase: b => b / 60 },
  { id: 'hour', name: 'Hour', symbol: 'hr', category: 'time', toBase: v => v * 3600, fromBase: b => b / 3600 },
  { id: 'day', name: 'Day', symbol: 'day', category: 'time', toBase: v => v * 86400, fromBase: b => b / 86400 },
  { id: 'week', name: 'Week', symbol: 'wk', category: 'time', toBase: v => v * 604800, fromBase: b => b / 604800 },

  // 7. Speed (Base: Meter per second)
  { id: 'm_per_s', name: 'Meter per second', symbol: 'm/s', category: 'speed', toBase: v => v, fromBase: b => b },
  { id: 'km_per_h', name: 'Kilometer per hour', symbol: 'km/h', category: 'speed', toBase: v => v / 3.6, fromBase: b => b * 3.6 },
  { id: 'mph', name: 'Mile per hour', symbol: 'mph', category: 'speed', toBase: v => v * 0.44704, fromBase: b => b / 0.44704 }
];

export function getUnitsByCategory(category: UnitCategory): UnitDefinition[] {
  return UNITS.filter(u => u.category === category);
}

export function getUnitById(id: string): UnitDefinition | undefined {
  return UNITS.find(u => u.id === id);
}

export interface ConversionResult {
  fromValue: number;
  toValue: number;
  formattedResult: string;
  formulaNote: string;
  isApproximate: boolean;
}

/**
 * Converts a numeric value between two units in the same category.
 */
export function convertUnit(
  value: number,
  fromUnitId: string,
  toUnitId: string
): ConversionResult {
  if (isNaN(value) || !isFinite(value)) {
    return {
      fromValue: 0,
      toValue: 0,
      formattedResult: '0',
      formulaNote: '',
      isApproximate: false
    };
  }

  const fromUnit = getUnitById(fromUnitId);
  const toUnit = getUnitById(toUnitId);

  if (!fromUnit || !toUnit || fromUnit.category !== toUnit.category) {
    throw new Error('Incompatible or invalid units specified for conversion.');
  }

  // Same unit identity
  if (fromUnit.id === toUnit.id) {
    return {
      fromValue: value,
      toValue: value,
      formattedResult: formatConversionNumber(value),
      formulaNote: `1 ${fromUnit.symbol} = 1 ${toUnit.symbol}`,
      isApproximate: false
    };
  }

  // Convert via base unit
  const baseValue = fromUnit.toBase(value);
  const rawTarget = toUnit.fromBase(baseValue);

  // Format cleanly
  const formattedResult = formatConversionNumber(rawTarget);

  // Formula note
  let formulaNote = '';
  if (fromUnit.category === 'temperature') {
    if (fromUnit.id === 'celsius' && toUnit.id === 'fahrenheit') formulaNote = '°F = (°C × 9/5) + 32';
    else if (fromUnit.id === 'fahrenheit' && toUnit.id === 'celsius') formulaNote = '°C = (°F - 32) × 5/9';
    else if (fromUnit.id === 'celsius' && toUnit.id === 'kelvin') formulaNote = 'K = °C + 273.15';
    else if (fromUnit.id === 'kelvin' && toUnit.id === 'celsius') formulaNote = '°C = K - 273.15';
    else if (fromUnit.id === 'fahrenheit' && toUnit.id === 'kelvin') formulaNote = 'K = (°F - 32) × 5/9 + 273.15';
    else if (fromUnit.id === 'kelvin' && toUnit.id === 'fahrenheit') formulaNote = '°F = (K - 273.15) × 9/5 + 32';
  } else {
    const unitRatio = toUnit.fromBase(fromUnit.toBase(1));
    formulaNote = `1 ${fromUnit.symbol} ≈ ${formatConversionNumber(unitRatio)} ${toUnit.symbol}`;
  }

  return {
    fromValue: value,
    toValue: rawTarget,
    formattedResult,
    formulaNote,
    isApproximate: !Number.isInteger(rawTarget)
  };
}

/**
 * Formats numbers avoiding awkward floating point inaccuracies (e.g. 0.0000000000000004)
 */
export function formatConversionNumber(val: number): string {
  if (val === 0) return '0';
  if (!isFinite(val)) return '0';

  const abs = Math.abs(val);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-6)) {
    return val.toExponential(6).replace(/\.?0+e/, 'e');
  }

  // Round to max 6 significant decimal places, stripping unnecessary trailing zeros
  const rounded = parseFloat(val.toFixed(6));
  return rounded.toLocaleString('en-IN', { maximumFractionDigits: 6 });
}
