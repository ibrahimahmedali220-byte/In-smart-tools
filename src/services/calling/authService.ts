import { CallingServiceResponse } from './types';

/**
 * Authentication Service Interface Placeholder
 * Future implementation will verify session tokens and cryptographic signatures.
 */
export const authService = {
  async authenticateSession(token?: string): Promise<CallingServiceResponse<{ isAuthenticated: boolean }>> {
    return {
      status: 'coming_soon',
      message: 'Authentication service is not active in Coming Soon preview mode.',
      data: { isAuthenticated: false }
    };
  }
};
