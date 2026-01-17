import { NextRequest, NextResponse } from 'next/server'
import { authenticateWithSignature, getEIP712Message } from '@/lib/auth'

/**
 * Authenticate with Pear Protocol using EIP-712 signature
 * Body: { address: string, signature: string, eip712Message?: any }
 * If eip712Message is not provided, we'll fetch it (but it's better to use the one used for signing)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, signature, eip712Message } = body

    if (!address || !signature) {
      return NextResponse.json(
        { error: 'address and signature are required in request body' },
        { status: 400 }
      )
    }

    // If eip712Message is not provided, fetch it (but this may cause timestamp issues)
    let message = eip712Message
    if (!message) {
      console.warn('⚠️ eip712Message not provided, fetching fresh message (may cause timestamp issues)')
      message = await getEIP712Message(address)
    }

    const tokens = await authenticateWithSignature(address, signature, message)

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      ...tokens,
      nextSteps: [
        `Add to .env.local: PEAR_CLIENT_SECRET=${tokens.accessToken}`,
        'Restart your Next.js dev server',
        'The access token is valid for ~15 minutes',
        'Use refreshToken to get a new access token when needed',
      ],
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.response?.data,
      },
      { status: error.response?.status || 500 }
    )
  }
}

