import { NextResponse } from 'next/server'
import { mockCards } from '@/lib/mockCards'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rarity = searchParams.get('rarity')
  const faction = searchParams.get('faction')

  let cards = [...mockCards]

  if (rarity) {
    cards = cards.filter((card) => card.rarity === rarity)
  }

  if (faction) {
    cards = cards.filter((card) => card.faction === faction)
  }

  return NextResponse.json(cards)
}
