'use client'

import { useState } from 'react'
import './styles/About.css'

export default function About() {
  const [showInfoTooltip, setShowInfoTooltip] = useState(false)

  return (
    <div className="screen-container about-container">
      <div className="header">
        <div className="header-title-container">
          <h1 className="header-title">About ARBIT</h1>
          <div className="info-button-container">
            <button
              className="info-button"
              onMouseEnter={() => setShowInfoTooltip(true)}
              onMouseLeave={() => setShowInfoTooltip(false)}
              onClick={() => setShowInfoTooltip(!showInfoTooltip)}
              aria-label="Information about ARBIT"
            >
              <span className="info-icon">i</span>
            </button>
            {showInfoTooltip && (
              <div className="info-tooltip">
                Learn about ARBIT Trading Cards and our mission to gamify crypto trading.
              </div>
            )}
          </div>
        </div>
        <p className="header-subtitle">
          Transforming crypto trades into collectible trading cards
        </p>
      </div>

      <div className="about-content">
        {/* Mission Section */}
        <section className="about-section">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-text">
            ARBIT is revolutionizing the way traders interact with cryptocurrency markets by 
            transforming every trade into a collectible trading card. We believe that trading 
            should be engaging, rewarding, and educational—not just profitable.
          </p>
          <p className="section-text">
            Our platform gamifies the trading experience, allowing users to collect, trade, and 
            showcase their trading achievements as unique digital trading cards. Each card 
            represents a real trade, capturing its performance, rarity, and story.
          </p>
        </section>

        {/* What We Do Section */}
        <section className="about-section">
          <h2 className="section-title">What We Do</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎴</div>
              <h3 className="feature-title">Generate Trading Cards</h3>
              <p className="feature-description">
                Every successful trade generates a unique trading card based on ROI, stake amount, 
                and volatility. Cards range from Common to Legendary rarity.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Track Performance</h3>
              <p className="feature-description">
                Monitor your trading portfolio, view detailed statistics, and analyze your 
                trading history through an intuitive dashboard.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Trade Cards</h3>
              <p className="feature-description">
                Build your collection by trading cards with other users. Each card has unique 
                stats and rarity that determine its value.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Visualize Trades</h3>
              <p className="feature-description">
                View candlestick charts, portfolio performance graphs, and detailed analytics 
                to understand your trading patterns.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="about-section">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-list">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Connect Your Wallet</h3>
                <p className="step-description">
                  Link your cryptocurrency wallet to start tracking your trades and generating cards.
                </p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Execute Trades</h3>
                <p className="step-description">
                  Trade on supported platforms like Pear Protocol. Each trade is automatically 
                  tracked and analyzed.
                </p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Generate Cards</h3>
                <p className="step-description">
                  Based on your trade performance (ROI, stake amount, volatility), unique trading 
                  cards are generated with varying rarities.
                </p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="step-title">Build Your Collection</h3>
                <p className="step-description">
                  Collect, trade, and showcase your cards. Build a portfolio that tells the 
                  story of your trading journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Section */}
        <section className="about-section learning-section">
          <h2 className="section-title">Learn About Pair Trading</h2>
          <p className="section-text">
            ARBIT integrates with Pear Protocol, the leading platform for decentralized pair and 
            basket trading. Learn the fundamentals of pair trading and advanced strategies to 
            improve your trading skills.
          </p>
          
          <div className="learning-resources">
            <div className="resource-card">
              <div className="resource-header">
                <h3 className="resource-title">Pear Protocol Education Hub</h3>
                <span className="resource-badge">External</span>
              </div>
              <p className="resource-description">
                Access comprehensive articles, videos, and courses on pair trading strategies, 
                risk management, and market analysis.
              </p>
              <a 
                href="https://www.pear.garden/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="resource-link"
              >
                Visit Pear Garden →
              </a>
            </div>

            <div className="resource-card">
              <div className="resource-header">
                <h3 className="resource-title">Pair Trading Basics</h3>
                <span className="resource-badge">Learn</span>
              </div>
              <p className="resource-description">
                Pair trading is a strategy where you simultaneously go long on one asset and 
                short on another, aiming to profit from their relative performance rather than 
                overall market direction.
              </p>
              <a 
                href="https://www.pear.garden/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="resource-link"
              >
                Learn More →
              </a>
            </div>

            <div className="resource-card">
              <div className="resource-header">
                <h3 className="resource-title">Advanced Strategies</h3>
                <span className="resource-badge">Advanced</span>
              </div>
              <p className="resource-description">
                Explore advanced pair trading techniques including beta-weighted positions, 
                volatility adjustments, and mean reversion strategies.
              </p>
              <a 
                href="https://www.pear.garden/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="resource-link"
              >
                Explore Strategies →
              </a>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="about-section">
          <h2 className="section-title">Key Features</h2>
          <ul className="features-list">
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>Automatic card generation from trades</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>Rarity system based on trade performance</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>Portfolio tracking and analytics</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>Card trading marketplace</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>Integration with Pear Protocol</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>Real-time market data and charts</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>Secure wallet integration</span>
            </li>
            <li className="feature-item">
              <span className="feature-check">✓</span>
              <span>Mobile and web support</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
