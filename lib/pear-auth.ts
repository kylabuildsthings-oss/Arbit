import axios from 'axios'
import { ethers } from 'ethers'

/**
 * Pear Protocol Authentication Service
 * 
 * Ported from working Python implementation in test/pear_client.py
 * Uses APITRADER client ID and matches the exact authentication flow.
 * 
 * Flow:
 * 1. getAuthMessage - Get EIP-712 message from Pear Protocol
 * 2. signMessage - Sign message using ethers.js signTypedData
 * 3. authenticate - Send signature to Pear Protocol, receive JWT tokens
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_PEAR_API_URL || 'https://hl-v2.pearprotocol.io'
const CLIENT_ID = process.env.PEAR_CLIENT_ID || 'APITRADER' // Use APITRADER like Python version

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface EIP712Message {
  domain: any
  types: any
  message: any
  primaryType?: string
}

/**
 * Step 1: Get EIP-712 message from Pear Protocol
 * Matches Python: get_eip712_message()
 */
export async function getAuthMessage(
  walletAddress: string,
  clientId: string = CLIENT_ID
): Promise<EIP712Message> {
  const url = `${API_BASE_URL}/auth/eip712-message`
  const params = {
    address: walletAddress,
    clientId: clientId,
  }

  const response = await axios.get(url, { params })
  return response.data
}

/**
 * Step 2: Sign EIP-712 message using ethers.js
 * Matches Python: sign_eip712_message()
 */
export async function signMessage(
  eip712Message: EIP712Message,
  privateKey: string
): Promise<string> {
  // Create wallet from private key
  const wallet = new ethers.Wallet(privateKey)

  // Sign using ethers.js signTypedData (matches Python's encode_typed_data approach)
  const signature = await wallet.signTypedData(
    eip712Message.domain,
    eip712Message.types,
    eip712Message.message
  )

  return signature
}

/**
 * Step 3: Authenticate with Pear Protocol using signature
 * Matches Python: authenticate() - sends signature and optionally timestamp in details
 */
export async function authenticate(
  walletAddress: string,
  signature: string,
  clientId: string = CLIENT_ID,
  timestamp?: number
): Promise<AuthTokens> {
  const url = `${API_BASE_URL}/auth/login`

  // Ensure signature has 0x prefix (standard format)
  const signatureFormatted = signature.startsWith('0x') ? signature : '0x' + signature

  // Payload matches Python version exactly - signature in details, timestamp if provided
  const payload: any = {
    method: 'eip712',
    address: walletAddress,
    clientId: clientId,
    details: {
      signature: signatureFormatted,
    },
  }

  // Add timestamp if provided (matches Python line 142-143)
  if (timestamp) {
    payload.details.timestamp = timestamp
  }

  const response = await axios.post(url, payload)

  // Handle both camelCase and snake_case response formats
  const data = response.data
  return {
    accessToken: data.accessToken || data.access_token || '',
    refreshToken: data.refreshToken || data.refresh_token || '',
  }
}

/**
 * Complete authentication flow: get message, sign, and authenticate
 * Matches Python: login() method
 */
export async function authenticateWithPrivateKey(
  walletAddress: string,
  privateKey: string,
  clientId: string = CLIENT_ID
): Promise<AuthTokens> {
  try {
    console.log(`[1/3] Getting EIP-712 message for client ID: ${clientId}`)
    const eip712Message = await getAuthMessage(walletAddress, clientId)

    // Extract timestamp if present in message (matches Python line 175-176)
    const timestamp = eip712Message?.message?.timestamp

    console.log(`[2/3] Signing EIP-712 message...`)
    const signature = await signMessage(eip712Message, privateKey)

    console.log(`[3/3] Authenticating...`)
    const tokens = await authenticate(walletAddress, signature, clientId, timestamp)

    console.log(`✅ Authentication successful!`)
    console.log(`  Access token expires in: 15 minutes`)
    console.log(`  Refresh token expires in: 30 days`)

    return tokens
  } catch (error) {
    console.error('Authentication failed:', error)
    if (axios.isAxiosError(error)) {
      const errorDetails = error.response?.data || error.message
      throw new Error(
        `Pear Protocol authentication failed: ${error.response?.status} - ${JSON.stringify(errorDetails)}`
      )
    }
    throw error
  }
}

/**
 * Get wallet address from private key (for convenience)
 */
export function getWalletAddress(privateKey: string): string {
  const wallet = new ethers.Wallet(privateKey)
  return wallet.address
}

