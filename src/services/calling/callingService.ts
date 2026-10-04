import { CallingServiceResponse, CallingSession } from './types';

/**
 * Calling Service Interface Placeholder
 * Future implementation will integrate with authorized telecom voice bridges.
 * 
 * Safety Guarantee:
 * - Never spoofs numbers or generates random caller IDs.
 * - Never pretends real calls are connected in preview mode.
 */
export const callingService = {
  async startCall(senderNumber?: string, receiverNumber?: string): Promise<CallingServiceResponse<CallingSession>> {
    return {
      status: 'coming_soon',
      message: 'Private Calling is not available yet. Real calling will be enabled after compliance and telecom integration are completed.',
      data: {
        sessionId: 'demo-preview-session',
        maskedProxyNumber: '+91 80000 00000 (Authorized Proxy Placeholder)',
        expiresAt: Date.now() + 600000,
        status: 'coming_soon'
      }
    };
  },

  async endCall(sessionId: string): Promise<CallingServiceResponse> {
    return {
      status: 'coming_soon',
      message: 'Call session interface is in preview mode.'
    };
  },

  async getCallStatus(sessionId: string): Promise<CallingServiceResponse> {
    return {
      status: 'coming_soon',
      message: 'Call status is unavailable in Coming Soon mode.'
    };
  }
};
