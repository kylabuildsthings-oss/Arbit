'use client'

import { useState, useEffect } from 'react'
import WalletConnect from './WalletConnect'
import './styles/Portfolio.css'

interface CryptoPosition {
  id: string
  symbol: string
  name: string
  amount: number
  value: number
  positionType: 'long' | 'short'
  entryPrice: number
  currentPrice: number
  pnl: number
  pnlPercentage: number
  roi: number
  status: 'hold' | 'sold'
  timestamp: string
  cardGenerated: boolean
}

interface CryptoHoldingsData {
  walletAddress: string
  totalPortfolioValue: number
  totalPnl: number
  totalPnlPercentage: number
  positions: CryptoPosition[]
  chartData: {
    dates: string[]
    values: number[]
    symbols: string[]
  }
}

export default function Portfolio() {
  const [holdings, setHoldings] = useState<CryptoHoldingsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [showInfoTooltip, setShowInfoTooltip] = useState(false)
  const [generatingCard, setGeneratingCard] = useState<string | null>(null)

  useEffect(() => {
    const loadHoldings = async () => {
      if (typeof window !== 'undefined') {
        const storedWallet = localStorage.getItem('walletAddress')
        if (storedWallet) {
          setWalletAddress(storedWallet)

          try {
            const response = await fetch(`/api/portfolio/${storedWallet}`)
            if (response.ok) {
              const data = await response.json()
              setHoldings(data)
            }
          } catch (error) {
            console.error('Error loading holdings:', error)
          } finally {
            setLoading(false)
          }
        } else {
          setLoading(false)
        }
      }
    }

    loadHoldings()
  }, [])

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address || null)
    if (address) {
      const loadHoldings = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/portfolio/${address}`)
          if (response.ok) {
            const data = await response.json()
            setHoldings(data)
          }
        } catch (error) {
          console.error('Error loading holdings:', error)
        } finally {
          setLoading(false)
        }
      }
      loadHoldings()
    }
  }

  const handleGenerateCard = async (position: CryptoPosition) => {
    setGeneratingCard(position.id)
    try {
      // Call API to generate card from transaction
      const response = await fetch('/api/bot-demo', {
        method: 'GET',
      })
      
      if (response.ok) {
        const data = await response.json()
        // Mark position as card generated (in real app, this would update the backend)
        if (holdings) {
          const updatedPositions = holdings.positions.map(p =>
            p.id === position.id ? { ...p, cardGenerated: true } : p
          )
          setHoldings({ ...holdings, positions: updatedPositions })
        }
        alert(`Card generated! Rarity: ${data.rarity}`)
      }
    } catch (error) {
      console.error('Error generating card:', error)
      alert('Failed to generate card. Please try again.')
    } finally {
      setGeneratingCard(null)
    }
  }

  const renderChart = () => {
    if (!holdings || !holdings.chartData) return null

    const { dates, values } = holdings.chartData
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    const range = maxValue - minValue || 1
    
    // Add some padding to the range for better visualization
    const paddedMin = minValue - range * 0.1
    const paddedMax = maxValue + range * 0.1
    const paddedRange = paddedMax - paddedMin

    const chartWidth = 1400
    const chartHeight = 550
    const leftPadding = 85  // More space for Y-axis labels
    const rightPadding = 30
    const topPadding = 30
    const bottomPadding = 50  // More space for X-axis labels
    const chartAreaWidth = chartWidth - leftPadding - rightPadding
    const chartAreaHeight = chartHeight - topPadding - bottomPadding

    const points = values.map((value, index) => {
      const x = leftPadding + (index / (values.length - 1)) * chartAreaWidth
      const y = topPadding + chartAreaHeight - ((value - paddedMin) / paddedRange) * chartAreaHeight
      return `${x},${y}`
    }).join(' ')

    // Generate Y-axis labels
    const yAxisSteps = 5
    const yAxisLabels: number[] = []
    for (let i = 0; i <= yAxisSteps; i++) {
      const value = paddedMin + (paddedMax - paddedMin) * (i / yAxisSteps)
      yAxisLabels.push(value)
    }

    return (
      <div className="holdings-chart-container">
        <svg width={chartWidth} height={chartHeight} className="holdings-chart-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <defs>
            <linearGradient id="holdingsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.05)" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {yAxisLabels.map((labelValue, i) => {
            const y = topPadding + chartAreaHeight - ((labelValue - paddedMin) / paddedRange) * chartAreaHeight
            return (
              <line
                key={i}
                x1={leftPadding}
                y1={y}
                x2={chartWidth - rightPadding}
                y2={y}
                stroke="var(--border-color)"
                strokeWidth="1"
                opacity="0.3"
              />
            )
          })}
          {/* Y-axis labels */}
          {yAxisLabels.map((labelValue, i) => {
            const y = topPadding + chartAreaHeight - ((labelValue - paddedMin) / paddedRange) * chartAreaHeight
            return (
              <text
                key={i}
                x={leftPadding - 15}
                y={y + 4}
                fill="var(--text-secondary)"
                fontSize="18"
                fontWeight="600"
                textAnchor="end"
                dominantBaseline="middle"
              >
                ${(labelValue / 1000).toFixed(0)}k
              </text>
            )
          })}
          {/* Y-axis line */}
          <line
            x1={leftPadding}
            y1={topPadding}
            x2={leftPadding}
            y2={topPadding + chartAreaHeight}
            stroke="var(--border-color)"
            strokeWidth="2"
          />
          {/* X-axis line */}
          <line
            x1={leftPadding}
            y1={topPadding + chartAreaHeight}
            x2={chartWidth - rightPadding}
            y2={topPadding + chartAreaHeight}
            stroke="var(--border-color)"
            strokeWidth="2"
          />
          {/* Area under curve */}
          <polygon
            points={`${leftPadding},${topPadding + chartAreaHeight} ${points} ${chartWidth - rightPadding},${topPadding + chartAreaHeight}`}
            fill="url(#holdingsGradient)"
          />
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Data points */}
          {values.map((value, index) => {
            const x = leftPadding + (index / (values.length - 1)) * chartAreaWidth
            const y = topPadding + chartAreaHeight - ((value - paddedMin) / paddedRange) * chartAreaHeight
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="var(--accent-color)"
                  stroke="var(--text-primary)"
                  strokeWidth="2"
                />
                {/* Value tooltip on hover */}
                <title>${value.toLocaleString()}</title>
              </g>
            )
          })}
          {/* X-axis labels */}
          {dates.map((date, index) => {
            const x = leftPadding + (index / (dates.length - 1)) * chartAreaWidth
            return (
              <text
                key={index}
                x={x}
                y={chartHeight - 15}
                fill="var(--text-secondary)"
                fontSize="18"
                fontWeight="600"
                textAnchor="middle"
              >
                {date}
              </text>
            )
          })}
        </svg>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="screen-container portfolio-container">
        <div className="loading-container">
          <p className="loading-text">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!walletAddress && !holdings) {
    return (
      <div className="screen-container portfolio-container">
        <div className="header">
          <div className="header-title-container">
            <h1 className="header-title">Portfolio</h1>
            <div className="info-button-container">
              <button
                className="info-button"
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
                onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                aria-label="Information about portfolio"
              >
                <span className="info-icon">i</span>
              </button>
              {showInfoTooltip && (
                <div className="info-tooltip">
                  View your crypto holdings, portfolio value, and generate trading cards from transactions. Each trade can create a card.
                </div>
              )}
            </div>
          </div>
          <p className="header-subtitle">
            Connect your wallet to view your crypto holdings portfolio
          </p>
        </div>
        <div className="wallet-connect-section">
          <WalletConnect onConnected={handleWalletConnected} />
        </div>
      </div>
    )
  }

  if (!holdings || (holdings.positions.length === 0 && holdings.totalPortfolioValue === 0)) {
    return (
      <div className="screen-container portfolio-container">
        <div className="header">
          <div className="header-title-container">
            <h1 className="header-title">Portfolio</h1>
            <div className="info-button-container">
              <button
                className="info-button"
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
                onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                aria-label="Information about portfolio"
              >
                <span className="info-icon">i</span>
              </button>
              {showInfoTooltip && (
                <div className="info-tooltip">
                  View your crypto holdings, portfolio value, and generate trading cards from transactions. Each trade can create a card.
                </div>
              )}
            </div>
          </div>
          <p className="header-subtitle">
            {walletAddress 
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : 'Connect your wallet to view your portfolio'}
          </p>
        </div>
        <div className="empty-container">
          <h2 className="empty-title">No Holdings Data</h2>
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
        <div className="header-title-container">
          <h1 className="header-title">Portfolio</h1>
          <div className="info-button-container">
            <button
              className="info-button"
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
              onClick={() => setShowInfoTooltip(!showInfoTooltip)}
              aria-label="Information about portfolio"
            >
              <span className="info-icon">i</span>
            </button>
            {showInfoTooltip && (
              <div className="info-tooltip">
                View your crypto holdings, portfolio value, and generate trading cards from transactions. Each trade can create a card.
              </div>
            )}
          </div>
        </div>
        <p className="header-subtitle">
          {holdings.walletAddress.slice(0, 6)}...{holdings.walletAddress.slice(-4)}
        </p>
      </div>

      {/* Portfolio Summary */}
      <div className="portfolio-summary">
        <div className="summary-card">
          <div className="summary-label">Total Portfolio Value</div>
          <div className="summary-value">${holdings.totalPortfolioValue.toLocaleString()}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total P&L</div>
          <div className={`summary-value ${holdings.totalPnl >= 0 ? 'profit' : 'loss'}`}>
            {holdings.totalPnl >= 0 ? '+' : ''}${holdings.totalPnl.toLocaleString()}
          </div>
          <div className={`summary-percentage ${holdings.totalPnlPercentage >= 0 ? 'profit' : 'loss'}`}>
            {holdings.totalPnlPercentage >= 0 ? '+' : ''}{holdings.totalPnlPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Crypto Holdings Chart */}
      {holdings.chartData && holdings.chartData.dates.length > 0 && (
        <div className="chart-section">
          <h2 className="section-title">Portfolio Value Over Time</h2>
          {renderChart()}
        </div>
      )}

      {/* Crypto Positions List */}
      {holdings.positions.length > 0 && (
        <div className="positions-section">
          <h2 className="section-title">Your Crypto Positions</h2>
          <div className="positions-list">
            {holdings.positions.map((position) => (
            <div key={position.id} className="position-card">
              <div className="position-header">
                <div className="position-crypto">
                  <div className="crypto-symbol">{position.symbol}</div>
                  <div className="crypto-name">{position.name}</div>
                </div>
                <div className={`position-type ${position.positionType}`}>
                  {position.positionType.toUpperCase()}
                </div>
              </div>
              
              <div className="position-details">
                <div className="detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value">{position.amount} {position.symbol}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Value:</span>
                  <span className="detail-value">${position.value.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Entry Price:</span>
                  <span className="detail-value">${position.entryPrice.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Current Price:</span>
                  <span className="detail-value">${position.currentPrice.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">P&L:</span>
                  <span className={`detail-value ${position.pnl >= 0 ? 'profit' : 'loss'}`}>
                    {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()} 
                    ({position.pnlPercentage >= 0 ? '+' : ''}{position.pnlPercentage.toFixed(2)}%)
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ROI:</span>
                  <span className={`detail-value ${position.roi >= 0 ? 'profit' : 'loss'}`}>
                    {position.roi >= 0 ? '+' : ''}{position.roi.toFixed(2)}%
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className={`detail-value status-badge ${position.status}`}>
                    {position.status === 'hold' ? 'Hold' : 'Sold'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Transaction Date:</span>
                  <span className="detail-value">
                    {new Date(position.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="position-actions">
                {position.cardGenerated ? (
                  <button className="card-generated-button" disabled>
                    ✓ Card Generated
                  </button>
                ) : (
                  <button
                    className="generate-card-button"
                    onClick={() => handleGenerateCard(position)}
                    disabled={generatingCard === position.id}
                  >
                    {generatingCard === position.id ? 'Generating...' : 'Generate Trading Card'}
                  </button>
                )}
              </div>
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
