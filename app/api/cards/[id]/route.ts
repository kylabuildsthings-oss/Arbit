import { NextResponse } from 'next/server'
import { mockCards } from '@/lib/mockCards'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const card = mockCards.find((c) => c.id === params.id)

  if (!card) {
    return NextResponse.json({ error: 'Card not found' }, { status: 404 })
  }

  return NextResponse.json(card)
}
