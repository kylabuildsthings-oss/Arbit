import { NextResponse } from 'next/server'

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export async function GET(
  request: Request,
  { params }: { params: { walletAddress: string } }
) {
  try {
    const walletAddress = params.walletAddress
    const url = new URL(request.url)
    const pair = url.searchParams.get('pair') || 'HYPE-ETH'
    const timeframe = url.searchParams.get('timeframe') || '1h'

    // Generate mock candlestick data (24 hours of hourly data)
    const candlesticks: CandlestickData[] = []
    const basePrice = 0.05 // Base price in ETH
    let currentPrice = basePrice

    for (let i = 23; i >= 0; i--) {
      const time = new Date()
      time.setHours(time.getHours() - i)
      
      const open = currentPrice
      const volatility = (Math.random() - 0.5) * 0.02 // ±1% volatility
      const trend = Math.random() * 0.01 // Slight upward trend
      const close = open * (1 + volatility + trend)
      const high = Math.max(open, close) * (1 + Math.random() * 0.01)
      const low = Math.min(open, close) * (1 - Math.random() * 0.01)
      const volume = Math.random() * 1000000 + 500000

      candlesticks.push({
        time: time.toISOString(),
        open,
        high,
        low,
        close,
        volume,
      })

      currentPrice = close
    }

    return NextResponse.json({
      pair,
      timeframe,
      candlesticks,
      currentPrice: candlesticks[candlesticks.length - 1].close,
      priceChange24h: ((candlesticks[candlesticks.length - 1].close - candlesticks[0].open) / candlesticks[0].open) * 100,
      volume24h: candlesticks.reduce((sum, c) => sum + c.volume, 0),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch candlestick data' },
      { status: 500 }
    )
  }
}
