'use client'

import { useState, useEffect } from 'react'
import WalletConnect from './WalletConnect'
import './styles/Trading.css'

export default function Trading() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [showInfoTooltip, setShowInfoTooltip] = useState(false)
  
  // Trade form state
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long')
  const [tradeSize, setTradeSize] = useState('')
  const [leverage, setLeverage] = useState(1)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedWallet = localStorage.getItem('walletAddress')
      if (storedWallet) {
        setWalletAddress(storedWallet)
      }
    }
  }, [])

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address || null)
  }

  const handlePlaceOrder = async () => {
    if (!tradeSize || !walletAddress) {
      alert('Please enter a trade size and connect your wallet')
      return
    }

    setIsPlacingOrder(true)
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setTradeSize('')
      alert(`Order placed: ${tradeType.toUpperCase()} ${tradeSize} at ${leverage}x leverage`)
    } catch (error) {
      alert('Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (!walletAddress) {
    return (
      <div className="screen-container trading-container">
        <div className="header">
          <div className="header-title-container">
            <h1 className="header-title">Trading</h1>
            <div className="info-button-container">
              <button
                className="info-button"
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
                onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                aria-label="Information about trading"
              >
                <span className="info-icon">i</span>
              </button>
              {showInfoTooltip && (
                <div className="info-tooltip">
                  Trade cryptocurrency pairs using Pear Protocol. View candlestick charts, place long/short positions, and generate trading cards from your trades.
                </div>
              )}
            </div>
          </div>
          <p className="header-subtitle">
            Connect your wallet to start trading via Pear Protocol
          </p>
        </div>
        <div className="wallet-connect-section">
          <WalletConnect onConnected={handleWalletConnected} />
        </div>
      </div>
    )
  }

  return (
    <div className="screen-container trading-container">
      <div className="header">
        <div className="header-title-container">
          <h1 className="header-title">Trading</h1>
          <div className="info-button-container">
            <button
              className="info-button"
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
              onClick={() => setShowInfoTooltip(!showInfoTooltip)}
              aria-label="Information about trading"
            >
              <span className="info-icon">i</span>
            </button>
            {showInfoTooltip && (
              <div className="info-tooltip">
                Trade cryptocurrency pairs using Pear Protocol. View candlestick charts, place long/short positions, and generate trading cards from your trades.
              </div>
            )}
          </div>
        </div>
        <p className="header-subtitle">
          Trade crypto pairs via Pear Protocol
        </p>
      </div>

      {/* Main Trading Layout */}
      <div className="trading-layout">
        {/* Order Panel */}
        <div className="order-panel">
          <h3 className="panel-title">Place Order</h3>
          
          {/* Trade Type Toggle */}
          <div className="trade-type-toggle">
            <button
              className={`type-btn ${tradeType === 'long' ? 'active long' : ''}`}
              onClick={() => setTradeType('long')}
            >
              Long
            </button>
            <button
              className={`type-btn ${tradeType === 'short' ? 'active short' : ''}`}
              onClick={() => setTradeType('short')}
            >
              Short
            </button>
          </div>

          {/* Trade Form */}
          <div className="trade-form">
            <div className="form-group">
              <label className="form-label">Size</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                value={tradeSize}
                onChange={(e) => setTradeSize(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Leverage</label>
              <div className="leverage-selector">
                {[1, 2, 3, 5, 10].map((lev) => (
                  <button
                    key={lev}
                    className={`leverage-btn ${leverage === lev ? 'active' : ''}`}
                    onClick={() => setLeverage(lev)}
                  >
                    {lev}x
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            {tradeSize && (
              <div className="order-summary">
                <div className="summary-row">
                  <span>Trade Size:</span>
                  <span>{parseFloat(tradeSize).toFixed(4)}</span>
                </div>
                <div className="summary-row">
                  <span>Leverage:</span>
                  <span>{leverage}x</span>
                </div>
                <div className="summary-row">
                  <span>Margin Required:</span>
                  <span>{(parseFloat(tradeSize) / leverage).toFixed(4)}</span>
                </div>
              </div>
            )}

            <button
              className={`place-order-btn ${tradeType}`}
              onClick={handlePlaceOrder}
              disabled={!tradeSize || isPlacingOrder}
            >
              {isPlacingOrder ? 'Placing Order...' : `Place ${tradeType.toUpperCase()} Order`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
