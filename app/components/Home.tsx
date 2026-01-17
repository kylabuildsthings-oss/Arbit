'use client'

import { useState } from 'react'
import Link from 'next/link'
import WalletConnect from './WalletConnect'
import './styles/Home.css'

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  const handleWalletConnected = (address: string) => {
    setWalletAddress(address || null)
  }

  return (
    <div className="home-screen">
      <div className="home-content">
        {/* Logo Section */}
        <div className="logo-container">
          <div className="cards-container">
            {/* Back Card */}
            <div className="trading-card card-back">
              <div className="bitcoin-symbol">₿</div>
            </div>
            {/* Middle Card */}
            <div className="trading-card card-middle"></div>
            {/* Front Card with A */}
            <div className="trading-card card-front">
              <div className="logo-letter">A</div>
            </div>
          </div>
          <h1 className="logo-text">ARBIT</h1>
          <p className="tagline">Trading Cards</p>
        </div>

        {/* Wallet Connection Section */}
        <WalletConnect onConnected={handleWalletConnected} />

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome to ARBIT</h2>
          <p className="welcome-text">
            Collect, trade, and master trading card strategies.
            Learn crypto trading concepts while building your ultimate collection.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="actions-container">
          <Link href="/gallery" className="action-button">
            <span className="action-emoji">🃏</span>
            <span className="action-text">Browse Gallery</span>
          </Link>
          <Link href="/collection" className="action-button">
            <span className="action-emoji">📚</span>
            <span className="action-text">My Collection</span>
          </Link>
          <Link href="/portfolio" className="action-button">
            <span className="action-emoji">💼</span>
            <span className="action-text">Portfolio</span>
          </Link>
          <Link href="/trading" className="action-button">
            <span className="action-emoji">📈</span>
            <span className="action-text">Trading</span>
          </Link>
          <Link href="/help" className="action-button">
            <span className="action-emoji">❓</span>
            <span className="action-text">Help & FAQ</span>
          </Link>
        </div>

        {/* Stats Preview */}
        <div className="stats-preview">
          <div className="stat-item">
            <div className="stat-number">12</div>
            <div className="stat-label">Total Cards</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4</div>
            <div className="stat-label">Rarities</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3</div>
            <div className="stat-label">Factions</div>
          </div>
        </div>
      </div>
    </div>
  )
}
