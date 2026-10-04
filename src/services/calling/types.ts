/**
 * Modular Architecture Types for Private / Masked Calling Service
 * 
 * Note: Feature is in COMING SOON status.
 * Real SMS OTP, live phone connections, and provider credentials are NOT active.
 * Production integrations will connect with authorized telecom providers and verified proxy pools.
 */

export interface CallingServiceResponse<T = unknown> {
  status: 'coming_soon' | 'success' | 'error' | 'rate_limited';
  message: string;
  data?: T;
}

export interface CallingSession {
  sessionId: string;
  maskedProxyNumber: string;
  expiresAt: number;
  status: 'pending_verification' | 'active' | 'completed' | 'terminated' | 'coming_soon';
  callDurationSeconds?: number;
}

export interface OTPVerificationRequest {
  phoneNumber: string;
  channel?: 'sms' | 'whatsapp';
}

export interface OTPVerificationResult {
  verified: boolean;
  token?: string;
  message: string;
}

export interface AbuseReport {
  id: string;
  reportType: 'spam' | 'scam' | 'harassment' | 'fraud' | 'impersonation';
  details: string;
  createdAt: number;
}

export interface BlockRequest {
  targetIdentifier: string;
  reason: string;
}
