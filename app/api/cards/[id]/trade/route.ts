import { NextRequest, NextResponse } from 'next/server'
import { pearClient } from '@/lib/pearClient'
import { mockCards } from '@/lib/mockCards'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const card = mockCards.find((c) => c.id === params.id)

    if (!card) {
      return NextResponse.json(
        {
          success: false,
          error: `Card with id "${params.id}" not found`,
        },
        { status: 404 }
      )
    }

    const tradingPair = card.tradingPair || 'BTC/USD'
    const coinSymbol = tradingPair.split('/')[0]
    const longAssets = [coinSymbol]
    const shortAssets: string[] = []
    const notional = 10

    const result = await pearClient.executeBasketTrade(
      {
        long: longAssets,
        short: shortAssets,
      },
      notional
    )

    return NextResponse.json(
      {
        success: true,
        orderId: result.orderId,
        status: result.status,
        message: `Trade executed for ${card.name}`,
        card: {
          id: card.id,
          name: card.name,
        },
        basket: {
          long: longAssets,
          short: shortAssets,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    const safeErrorMessage =
      errorMessage.includes('API key') ||
      errorMessage.includes('secret') ||
      errorMessage.includes('token')
        ? 'Authentication or configuration error'
        : errorMessage

    return NextResponse.json(
      {
        success: false,
        error: safeErrorMessage,
      },
      { status: 500 }
    )
  }
}
