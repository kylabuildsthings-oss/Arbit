import axios from 'axios'
import { AuthTokens } from './auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_PEAR_API_URL || 'https://hl-v2.pearprotocol.io'

/**
 * Token Management Utilities
 * Handles refresh token and logout functionality as per Pear Protocol documentation
 * See: https://docs.pearprotocol.io/api-integration/access-management/authentication-process
 */

/**
 * Refresh access token using refresh token
 * 
 * According to Pear Protocol docs:
 * - Access token is valid for 15 minutes
 * - Refresh token is valid for 30 days
 * - Use refresh token to get new access token when current one expires
 * 
 * @param refreshToken - The refresh token from initial authentication
 * @returns New access and refresh tokens
 */
export async function refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      { refreshToken }
    )
    
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorDetails = error.response?.data || error.message
      throw new Error(
        `Token refresh failed: ${error.response?.status} - ${JSON.stringify(errorDetails)}`
      )
    }
    throw error
  }
}

/**
 * Logout and invalidate tokens
 * 
 * According to Pear Protocol docs:
 * - Should clear stored JWT tokens client-side
 * - Should call POST Logout API with refresh token
 * - This invalidates the session on server side
 * 
 * @param refreshToken - The refresh token to invalidate
 */
export async function logout(refreshToken: string): Promise<void> {
  try {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      { refreshToken }
    )
  } catch (error: any) {
    // Log error but don't throw - client-side token clearing should happen regardless
    console.warn('Logout API call failed:', error)
  }
}

/**
 * Check if access token is expired (approximately)
 * Pear Protocol access tokens are valid for 15 minutes
 * 
 * Note: This is a helper function. For production, you should decode the JWT
 * and check the actual expiration time, or handle 401 errors and refresh automatically.
 * 
 * @param tokenIssuedAt - Timestamp when token was issued (in seconds)
 * @returns true if token is likely expired
 */
export function isTokenExpired(tokenIssuedAt: number): boolean {
  const now = Math.floor(Date.now() / 1000)
  const tokenAge = now - tokenIssuedAt
  const fifteenMinutes = 15 * 60 // 15 minutes in seconds
  
  return tokenAge >= fifteenMinutes
}

