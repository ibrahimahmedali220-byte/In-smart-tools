/**
 * GST (Goods and Services Tax) Calculator Engine
 * 
 * Supports:
 * 1. Add GST (Exclusive to Inclusive)
 *    GST Amount = (Base Amount × GST Rate) / 100
 *    Final Amount = Base Amount + GST Amount
 * 
 * 2. Remove GST (Inclusive to Exclusive)
 *    Base Amount = (Inclusive Amount × 100) / (100 + GST Rate)
 *    GST Amount = Inclusive Amount - Base Amount
 */

export type GstMode = 'add' | 'remove';

export interface GstInput {
  amount: number;
  rate: number; // e.g. 5, 12, 18, 28
  mode: GstMode;
}

export interface GstResult {
  baseAmount: number;
  gstAmount: number;
  finalAmount: number;
  cgst: number; // 50% of GST Amount
  sgst: number; // 50% of GST Amount
  rate: number;
  mode: GstMode;
  isValid: boolean;
  errorMessage?: string;
}

export const STANDARD_GST_SLABS = [0, 5, 12, 18, 28];

export function calculateGst(input: GstInput): GstResult {
  const amount = Math.max(0, input.amount || 0);
  const rate = Math.max(0, input.rate || 0);
  const mode = input.mode || 'add';

  if (amount <= 0) {
    return {
      baseAmount: 0,
      gstAmount: 0,
      finalAmount: 0,
      cgst: 0,
      sgst: 0,
      rate,
      mode,
      isValid: false,
      errorMessage: 'Please enter a valid amount greater than 0.'
    };
  }

  if (rate > 100) {
    return {
      baseAmount: 0,
      gstAmount: 0,
      finalAmount: 0,
      cgst: 0,
      sgst: 0,
      rate,
      mode,
      isValid: false,
      errorMessage: 'GST rate cannot exceed 100%.'
    };
  }

  let baseAmount = 0;
  let gstAmount = 0;
  let finalAmount = 0;

  if (mode === 'add') {
    // Adding GST to base amount
    baseAmount = Math.round(amount * 100) / 100;
    gstAmount = Math.round(((baseAmount * rate) / 100) * 100) / 100;
    finalAmount = Math.round((baseAmount + gstAmount) * 100) / 100;
  } else {
    // Removing GST from inclusive amount
    finalAmount = Math.round(amount * 100) / 100;
    baseAmount = Math.round(((finalAmount * 100) / (100 + rate)) * 100) / 100;
    gstAmount = Math.round((finalAmount - baseAmount) * 100) / 100;
  }

  const cgst = Math.round((gstAmount / 2) * 100) / 100;
  const sgst = Math.round((gstAmount / 2) * 100) / 100;

  return {
    baseAmount,
    gstAmount,
    finalAmount,
    cgst,
    sgst,
    rate,
    mode,
    isValid: true
  };
}
