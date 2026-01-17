import { NextRequest, NextResponse } from 'next/server'
import { pearClient } from '@/lib/pearClient'
import { characters } from '@/lib/characters'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { characterId } = body

    // Validate characterId
    if (!characterId) {
      return NextResponse.json(
        {
          success: false,
          error: 'characterId is required',
        },
        { status: 400 }
      )
    }

    // Find the character
    const character = characters.find((c) => c.id === characterId)

    if (!character) {
      return NextResponse.json(
        {
          success: false,
          error: `Character with id "${characterId}" not found`,
        },
        { status: 404 }
      )
    }

    // Extract coin symbols from basket (long side)
    // Remove /USD, /USDC suffixes and convert to coin names
    const longAssets = character.basket.map((pair) => {
      // Extract coin name from symbol (e.g., 'AI/USD' -> 'AI')
      return pair.symbol.split('/')[0].trim()
    })

    // For now, try long-only trades to simplify and avoid 500 errors
    // Short assets can be added later once agent wallet is properly set up
    const shortAssets: string[] = [] // Empty for long-only trades

    // Set fixed notional to $10 as specified
    const notional = 10

    console.log(`Executing basket trade for character: ${character.name}`)
    console.log(`Long assets: ${longAssets.join(', ')}`)
    console.log(`Short assets: ${shortAssets.join(', ')}`)
    console.log(`Notional: $${notional}`)

    // Execute the basket trade
    const result = await pearClient.executeBasketTrade(
      {
        long: longAssets,
        short: shortAssets,
      },
      notional
    )

    console.log(`Trade executed successfully. Order ID: ${result.orderId}`)

    return NextResponse.json(
      {
        success: true,
        orderId: result.orderId,
        status: result.status,
        message: `Trade executed for ${character.name}`,
        character: {
          id: character.id,
          name: character.name,
        },
        basket: {
          long: longAssets,
          short: shortAssets,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    // Log error but don't expose internal details
    console.error('Error executing trade:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'

    // Don't expose sensitive information like API keys or internal paths
    const safeErrorMessage = errorMessage.includes('API key') ||
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

