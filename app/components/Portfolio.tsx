'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from './Card'
import { Card as CardType } from '@/types/Card'
import './styles/Portfolio.css'

interface PortfolioData {
  walletAddress: string
  totalCards: number
  totalValue: number
  cards: CardType[]
  recentTrades: TradeHistory[]
  performance: {
    totalTrades: number
    winRate: number
    totalProfit: number
  }
}

interface TradeHistory {
  id: string
  cardId: string
  cardName: string
  type: 'buy' | 'sell'
  amount: number
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

const createMockPortfolio = (walletAddress: string): PortfolioData => ({
  walletAddress,
  totalCards: 6,
  totalValue: 25000,
  cards: [],
  recentTrades: [
    {
      id: '1',
      cardId: '1',
      cardName: 'Nexus Prime',
      type: 'buy',
      amount: 10000,
      timestamp: new Date().toISOString(),
      status: 'completed',
    },
  ],
  performance: {
    totalTrades: 12,
    winRate: 75,
    totalProfit: 5000,
  },
})

export default function Portfolio() {
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const loadPortfolio = async () => {
      const storedWallet = localStorage.getItem('walletAddress')
      
      if (!storedWallet) {
        setLoading(false)
        return
      }

      setWalletAddress(storedWallet)

      try {
        const response = await fetch(`/api/portfolio/${storedWallet}`)
        if (response.ok) {
          const data = await response.json()
          setPortfolio(data)
        } else {
          setPortfolio(createMockPortfolio(storedWallet))
        }
      } catch (error) {
        setPortfolio(createMockPortfolio(storedWallet))
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [])

  const handleCardPress = (card: CardType) => {
    router.push(`/card/${card.id}`)
  }

  if (loading) {
    return (
      <div className="screen-container">
        <div className="loading-container">
          <p className="loading-text">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!walletAddress) {
    return (
      <div className="screen-container">
        <div className="empty-container">
          <h2 className="empty-title">Connect Your Wallet</h2>
          <p className="empty-text">
            Please connect your wallet to view your portfolio.
          </p>
          <button className="browse-button" onClick={() => router.push('/')}>
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="screen-container">
        <div className="empty-container">
          <h2 className="empty-title">No Portfolio Data</h2>
          <p className="empty-text">
            Start trading to build your portfolio!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-container portfolio-container">
      <div className="header">
        <h1 className="header-title">Portfolio</h1>
        <p className="header-subtitle">
          {portfolio.walletAddress.slice(0, 6)}...{portfolio.walletAddress.slice(-4)}
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="portfolio-stats">
        <div className="stat-card">
          <div className="stat-label">Total Cards</div>
          <div className="stat-value">{portfolio.totalCards}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Portfolio Value</div>
          <div className="stat-value">${portfolio.totalValue.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Trades</div>
          <div className="stat-value">{portfolio.performance.totalTrades}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Win Rate</div>
          <div className="stat-value">{portfolio.performance.winRate}%</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <h2 className="section-title">Performance</h2>
        <div className="performance-metrics">
          <div className="metric-item">
            <span className="metric-label">Total Profit</span>
            <span className="metric-value profit">
              +${portfolio.performance.totalProfit.toLocaleString()}
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Win Rate</span>
            <span className="metric-value">{portfolio.performance.winRate}%</span>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      {portfolio.recentTrades.length > 0 && (
        <div className="trades-section">
          <h2 className="section-title">Recent Trades</h2>
          <div className="trades-list">
            {portfolio.recentTrades.map((trade) => (
              <div key={trade.id} className="trade-item">
                <div className="trade-info">
                  <span className="trade-card-name">{trade.cardName}</span>
                  <span className={`trade-type ${trade.type}`}>
                    {trade.type === 'buy' ? 'Buy' : 'Sell'}
                  </span>
                </div>
                <div className="trade-details">
                  <span className="trade-amount">${trade.amount.toLocaleString()}</span>
                  <span className={`trade-status ${trade.status}`}>
                    {trade.status}
                  </span>
                </div>
                <div className="trade-time">
                  {new Date(trade.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collection Cards */}
      {portfolio.cards.length > 0 && (
        <div className="collection-section">
          <h2 className="section-title">Your Cards</h2>
          <div className="cards-grid">
            {portfolio.cards.map((card) => (
              <Card key={card.id} card={card} onPress={() => handleCardPress(card)} size="small" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
