import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

/**
 * Test endpoint to verify authentication and check agent wallet
 * This helps debug 404 issues
 */
export async function GET(request: NextRequest) {
  try {
    // Force correct base URL for Hyperliquid integration
    const apiUrl = process.env.NEXT_PUBLIC_PEAR_API_URL || 'https://hl-v2.pearprotocol.io'
    
    // Override if env var is set incorrectly
    if (process.env.NEXT_PUBLIC_PEAR_API_URL === 'https://api.pearprotocol.io') {
      console.warn('Warning: NEXT_PUBLIC_PEAR_API_URL is set to wrong base URL. Using https://hl-v2.pearprotocol.io instead.')
    }
    let clientSecret = process.env.PEAR_CLIENT_SECRET || ''
    
    // Remove quotes if present
    if (clientSecret && ((clientSecret.startsWith('"') && clientSecret.endsWith('"')) ||
        (clientSecret.startsWith("'") && clientSecret.endsWith("'")))) {
      clientSecret = clientSecret.slice(1, -1)
    }

    const token = clientSecret.startsWith('0x') ? clientSecret : null

    if (!token) {
      return NextResponse.json({
        error: 'No valid Bearer token found in PEAR_CLIENT_SECRET',
        note: 'PEAR_CLIENT_SECRET should be a Bearer token (starts with 0x or similar)'
      }, { status: 400 })
    }

    // Test agent wallet endpoint (known to exist)
    try {
      const response = await axios.get(`${apiUrl}/agentWallet`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Authentication works! Agent wallet endpoint accessible.',
        agentWallet: response.data,
        apiUrl,
        endpointsToTry: [
          '/positions',
          '/orders',
          '/baskets',
          '/trade',
          '/execute-trade',
        ]
      })
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return NextResponse.json({
          success: false,
          error: 'Agent wallet endpoint test failed',
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          apiUrl,
          note: 'If 401/403, token is invalid. If 404, endpoint might not exist or auth needed first.'
        }, { status: error.response?.status || 500 })
      }
      throw error
    }
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

