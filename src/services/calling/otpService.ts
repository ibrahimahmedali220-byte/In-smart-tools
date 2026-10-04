import { CallingServiceResponse, OTPVerificationResult } from './types';

/**
 * OTP Service Interface Placeholder
 * Future implementation will connect with authorized SMS/telecom gateways.
 * Currently in Coming Soon state: zero SMS dispatched, zero real numbers stored.
 */
export const otpService = {
  async sendOTP(phoneNumber: string): Promise<CallingServiceResponse> {
    return {
      status: 'coming_soon',
      message: 'SMS OTP verification is not available yet. This feature is coming soon.'
    };
  },

  async verifyOTP(phoneNumber: string, otpCode: string): Promise<CallingServiceResponse<OTPVerificationResult>> {
    return {
      status: 'coming_soon',
      message: 'OTP verification system is under development.',
      data: {
        verified: false,
        message: 'Verification is inactive in Coming Soon preview mode.'
      }
    };
  }
};
