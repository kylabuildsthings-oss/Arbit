import { NextRequest, NextResponse } from 'next/server'
import { getEIP712Message } from '@/lib/auth'

/**
 * Get EIP-712 message for authentication
 * This endpoint helps you get the message that needs to be signed
 */
export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address')
    
    if (!address) {
      return NextResponse.json(
        { error: 'address query parameter is required' },
        { status: 400 }
      )
    }

    const message = await getEIP712Message(address)

    return NextResponse.json({
      success: true,
      message: 'EIP-712 message retrieved',
      eip712Message: message,
      instructions: [
        '1. Sign this EIP-712 message with your wallet (private key)',
        '2. POST the signature to /api/authenticate/login with body: { address, signature }',
        '3. You will receive accessToken and refreshToken',
        '4. Use accessToken as PEAR_CLIENT_SECRET in .env.local (or set it directly)',
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

