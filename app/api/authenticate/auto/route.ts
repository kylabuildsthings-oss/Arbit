import { NextRequest, NextResponse } from 'next/server'
import { authenticateWithPrivateKey } from '@/lib/auth'

/**
 * Automatic authentication endpoint
 * Accepts address and private key, signs automatically, and returns tokens
 * 
 * Body: { address: string, privateKey: string }
 * 
 * WARNING: Only use this in development! Never expose private keys in production.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, privateKey } = body

    if (!address || !privateKey) {
      return NextResponse.json(
        { error: 'address and privateKey are required in request body' },
        { status: 400 }
      )
    }

    // Validate address format
    if (!address.startsWith('0x') || address.length !== 42) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      )
    }


    // Verify private key matches address
    try {
      const { ethers } = await import('ethers')
      const wallet = new ethers.Wallet(privateKey)
      const walletAddress = wallet.address.toLowerCase()
      const providedAddress = address.toLowerCase()
      
      if (walletAddress !== providedAddress) {
        return NextResponse.json(
          {
            error: 'Private key does not match the provided address',
            expectedAddress: walletAddress,
            providedAddress: providedAddress,
          },
          { status: 400 }
        )
      }
    } catch (error: any) {
      return NextResponse.json(
        {
          error: 'Invalid private key format',
          details: error.message,
        },
        { status: 400 }
      )
    }

    // Complete authentication flow automatically
    const tokens = await authenticateWithPrivateKey(address, privateKey)

    return NextResponse.json({
      success: true,
      message: 'Authentication successful!',
      ...tokens,
      nextSteps: [
        `Add to .env.local: PEAR_CLIENT_SECRET=${tokens.accessToken}`,
        'Remove quotes from .env.local if present',
        'Restart your Next.js dev server (rm -rf .next && npm run dev)',
        'The access token is valid for ~15 minutes',
        'Use refreshToken to get a new access token when needed',
      ],
      securityNote: 'Never commit your private key to version control!',
    })
  } catch (error: any) {
    console.error('Authentication error:', error)
    
    return NextResponse.json(
      {
        error: error.message || 'Authentication failed',
        details: error.response?.data || error.stack,
      },
      { status: error.response?.status || 500 }
    )
  }
}

