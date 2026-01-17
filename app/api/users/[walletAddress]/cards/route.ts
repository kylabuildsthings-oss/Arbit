import { NextResponse } from 'next/server'
import { mockCards } from '@/lib/mockCards'
import { UserCollection } from '@/types/Card'

export async function GET(
  request: Request,
  { params }: { params: { walletAddress: string } }
) {
  // TODO: Replace with actual database query
  // For now, return mock collection
  const walletAddress = params.walletAddress

  // Simulate user owning first 6 cards
  const userCards = mockCards.slice(0, 6)
  const totalValue = userCards.reduce((sum, card) => sum + (card.marketValue || 0), 0)

  const collection: UserCollection = {
    walletAddress,
    cards: userCards,
    totalCards: userCards.length,
    totalValue,
  }

  return NextResponse.json(collection)
}
