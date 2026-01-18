'use client'

import { useState } from 'react'
import './styles/CandlestickChart.css'

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface CandlestickChartProps {
  data: CandlestickData[]
  pair: string
  currentPrice: number
  priceChange24h: number
}

export default function CandlestickChart({ data, pair, currentPrice, priceChange24h }: CandlestickChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="candlestick-chart-container">
        <div className="loading-container">
          <p className="loading-text">No chart data available</p>
        </div>
      </div>
    )
  }

  const width = 900
  const height = 400
  const padding = { top: 50, right: 70, bottom: 80, left: 100 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Calculate price range
  const allPrices = data.flatMap(d => [d.high, d.low])
  const maxPrice = Math.max(...allPrices)
  const minPrice = Math.min(...allPrices)
  const priceRange = maxPrice - minPrice || 0.01
  const paddedMin = minPrice - priceRange * 0.1
  const paddedMax = maxPrice + priceRange * 0.1
  const paddedRange = paddedMax - paddedMin

  // Price to Y coordinate
  const priceToY = (price: number) => {
    return padding.top + chartHeight - ((price - paddedMin) / paddedRange) * chartHeight
  }

  // Generate Y-axis labels
  const yAxisSteps = 5
  const yAxisLabels: number[] = []
  for (let i = 0; i <= yAxisSteps; i++) {
    const price = paddedMin + (paddedMax - paddedMin) * (i / yAxisSteps)
    yAxisLabels.push(price)
  }

  // Calculate candlestick dimensions
  const candleWidth = chartWidth / data.length * 0.7
  const candleGap = chartWidth / data.length * 0.3

  // Get hovered candle position for tooltip
  const hoveredCandle = hoveredIndex !== null ? data[hoveredIndex] : null
  const hoveredX = hoveredIndex !== null 
    ? padding.left + (hoveredIndex / (data.length - 1)) * chartWidth 
    : 0
  const hoveredY = hoveredIndex !== null
    ? priceToY(data[hoveredIndex].high) - 20
    : 0

  return (
    <div className="candlestick-chart-container">
      <div className="chart-header">
        <div className="pair-info">
          <h2 className="pair-name">{pair}</h2>
          <div className="price-info">
            <span className="current-price">{currentPrice.toFixed(4)}</span>
            <span className={`price-change ${priceChange24h >= 0 ? 'positive' : 'negative'}`}>
              {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="timeframe-selector">
          <button className="timeframe-btn active">1H</button>
          <button className="timeframe-btn">4H</button>
          <button className="timeframe-btn">1D</button>
          <button className="timeframe-btn">1W</button>
        </div>
      </div>
      <div className="chart-wrapper">
        <svg className="candlestick-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="candleGradientLong" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="candleGradientShort" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yAxisLabels.map((labelValue, i) => {
            const y = priceToY(labelValue)
            return (
              <line
                key={`grid-${i}`}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="var(--border-color)"
                strokeWidth="1"
                opacity="0.2"
              />
            )
          })}

          {/* Y-axis labels */}
          {yAxisLabels.map((labelValue, i) => {
            const y = priceToY(labelValue)
            return (
              <text
                key={`y-label-${i}`}
                x={padding.left - 20}
                y={y + 4}
                fill="var(--text-secondary)"
                fontSize="14"
                fontWeight="500"
                textAnchor="end"
                dominantBaseline="middle"
              >
                {labelValue.toFixed(4)}
              </text>
            )
          })}

          {/* Y-axis line */}
          <line
            x1={padding.left}
            y1={padding.top - 5}
            x2={padding.left}
            y2={padding.top + chartHeight + 5}
            stroke="var(--border-color)"
            strokeWidth="2"
          />

          {/* X-axis line */}
          <line
            x1={padding.left - 5}
            y1={padding.top + chartHeight}
            x2={width - padding.right + 5}
            y2={padding.top + chartHeight}
            stroke="var(--border-color)"
            strokeWidth="2"
          />

          {/* Candlesticks */}
          {data.map((candle, index) => {
            const x = padding.left + (index / (data.length - 1)) * chartWidth
            const isBullish = candle.close >= candle.open
            const bodyTop = priceToY(Math.max(candle.open, candle.close))
            const bodyBottom = priceToY(Math.min(candle.open, candle.close))
            const bodyHeight = Math.max(bodyBottom - bodyTop, 1)
            const wickTop = Math.max(priceToY(candle.high), padding.top)
            const wickBottom = Math.min(priceToY(candle.low), padding.top + chartHeight)

            return (
              <g key={index}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={wickTop}
                  x2={x}
                  y2={wickBottom}
                  stroke={isBullish ? '#10b981' : '#ef4444'}
                  strokeWidth="2"
                />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={isBullish ? '#10b981' : '#ef4444'}
                  stroke={isBullish ? '#10b981' : '#ef4444'}
                  strokeWidth="1"
                  className="candle-body"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
            )
          })}

          {/* X-axis labels */}
          {(() => {
            const timeSteps = Math.min(6, data.length)
            const labels = []
            for (let i = 0; i < timeSteps; i++) {
              const index = Math.floor((i / (timeSteps - 1)) * (data.length - 1))
              const x = padding.left + (index / (data.length - 1)) * chartWidth
              const time = new Date(data[index].time)
              const timeLabel = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              labels.push(
                <text
                  key={`x-label-${i}`}
                  x={x}
                  y={height - padding.bottom + 25}
                  fill="var(--text-secondary)"
                  fontSize="14"
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {timeLabel}
                </text>
              )
            }
            return labels
          })()}
        </svg>

        {/* Tooltip */}
        {hoveredCandle && hoveredIndex !== null && (
          <div 
            className="candle-tooltip"
            style={{
              left: `${hoveredX}px`,
              top: `${hoveredY}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="tooltip-row">
              <span>Open:</span>
              <span>{hoveredCandle.open.toFixed(4)}</span>
            </div>
            <div className="tooltip-row">
              <span>High:</span>
              <span>{hoveredCandle.high.toFixed(4)}</span>
            </div>
            <div className="tooltip-row">
              <span>Low:</span>
              <span>{hoveredCandle.low.toFixed(4)}</span>
            </div>
            <div className="tooltip-row">
              <span>Close:</span>
              <span>{hoveredCandle.close.toFixed(4)}</span>
            </div>
            <div className="tooltip-row">
              <span>Volume:</span>
              <span>{hoveredCandle.volume.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
