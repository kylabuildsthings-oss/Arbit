'use client'

import { useRouter } from 'next/navigation'
import Card from './Card'
import { Card as CardType, Rarity } from '@/types/Card'
import './styles/CardDetails.css'

interface CardDetailsProps {
  card: CardType
}

export default function CardDetails({ card }: CardDetailsProps) {
  const router = useRouter()

  const getRarityColors = (rarity: Rarity): string => {
    switch (rarity) {
      case Rarity.LEGENDARY:
        return 'linear-gradient(135deg, #FFD700, #FF8C00)'
      case Rarity.EPIC:
        return 'linear-gradient(135deg, #9B59B6, #8E44AD)'
      case Rarity.RARE:
        return 'linear-gradient(135deg, #3498DB, #2980B9)'
      case Rarity.UNCOMMON:
        return 'linear-gradient(135deg, #2ECC71, #27AE60)'
      case Rarity.COMMON:
        return 'linear-gradient(135deg, #95A5A6, #7F8C8D)'
      default:
        return 'linear-gradient(135deg, #34495E, #2C3E50)'
    }
  }

  const handleTrade = async () => {
    try {
      const response = await fetch(`/api/cards/${card.id}/trade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      if (data.success) {
        alert(`Trade executed successfully! Order ID: ${data.orderId}`)
      } else {
        alert('Trade failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute trade'
      alert(`Trade failed: ${errorMessage}`)
    }
  }

  return (
    <div className="screen-container details-screen">
      <button className="back-button" onClick={() => router.back()}>
        ← Back
      </button>

      <div className="card-display">
        <Card card={card} size="large" />
      </div>

      <div className="action-container">
        <button
          className="action-button"
          style={{ background: getRarityColors(card.rarity) }}
          onClick={handleTrade}
        >
          Trade Card
        </button>
      </div>
    </div>
  )
}
