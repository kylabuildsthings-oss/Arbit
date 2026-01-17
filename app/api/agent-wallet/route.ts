import { NextRequest, NextResponse } from 'next/server'
import { pearClient } from '@/lib/pearClient'

/**
 * GET /api/agent-wallet - Check agent wallet status
 * POST /api/agent-wallet - Create agent wallet
 */
export async function GET(request: NextRequest) {
  try {
    const wallet = await pearClient.checkAgentWallet()
    
    if (!wallet || Object.keys(wallet).length === 0) {
      return NextResponse.json(
        {
          exists: false,
          message: 'Agent wallet is empty or not found. Use POST to create one.',
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        exists: true,
        wallet,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error checking agent wallet:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if wallet already exists first
    const existingWallet = await pearClient.checkAgentWallet()
    const isEmpty = !existingWallet || Object.keys(existingWallet).length === 0
    
    if (!isEmpty) {
      return NextResponse.json(
        {
          success: false,
          message: 'Agent wallet already exists but may need approval.',
          wallet: existingWallet,
          hint: 'The wallet exists but appears empty/inactive. You need to approve it to use it for trades.',
        },
        { status: 400 }
      )
    }
    
    // Wallet doesn't exist, try to create it
    const result = await pearClient.createAgentWallet()
    
    // If result indicates wallet already exists, return appropriate message
    if (result?.exists) {
      return NextResponse.json(
        {
          success: false,
          message: 'Agent wallet already exists but needs approval.',
          data: result,
          hint: 'The wallet exists but is not approved. You need to approve it with your wallet signature.',
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: true,
        message: 'Agent wallet created. You need to approve it with your wallet signature.',
        data: result,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error creating agent wallet:', error)
    
    // Extract detailed error information
    let errorMessage = 'Unknown error occurred'
    let errorDetails: any = null
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Check for the specific Content-Type error
      if (errorMessage.includes('Body cannot be empty when content-type')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Agent wallet already exists but needs approval.',
            details: 'The API rejected the creation request. This usually means the wallet exists but is not approved.',
            hint: 'Your agent wallet exists but needs to be approved before you can use it for trades. Please approve it via the Pear Protocol interface or follow the approval flow.',
          },
          { status: 400 }
        )
      }
    }
    
    // Check if it's a 400 error (bad request) - might mean wallet already exists
    if (errorMessage.includes('400') || errorMessage.includes('status code 400')) {
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: errorDetails,
          hint: 'Agent wallet might already exist but needs approval. Check status with GET /api/agent-wallet first.',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    )
  }
}
