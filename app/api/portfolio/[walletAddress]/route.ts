import { NextResponse } from 'next/server'

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

export async function GET(
  request: Request,
  { params }: { params: { walletAddress: string } }
) {
  try {
    const walletAddress = params.walletAddress

    // Return empty portfolio data - framework maintained
    const holdingsData: CryptoHoldingsData = {
      walletAddress,
      totalPortfolioValue: 0,
      totalPnl: 0,
      totalPnlPercentage: 0,
      positions: [],
      chartData: {
        dates: [],
        values: [],
        symbols: [],
      },
    }

    return NextResponse.json(holdingsData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch crypto holdings' },
      { status: 500 }
    )
  }
}
