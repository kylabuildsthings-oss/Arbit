/**
 * Character definitions for narrative-based trading
 * Each character represents a trading narrative with associated basket of assets
 */

export interface Character {
  id: string
  name: string
  description: string
  basket: TradingPair[]
}

export interface TradingPair {
  symbol: string
  exchange: string
  weight?: number
}

export const characters: Character[] = [
  {
    id: 'ai-revolution',
    name: 'AI Revolution',
    description: 'Trading narrative focused on artificial intelligence and machine learning technologies',
    // Using valid Hyperliquid symbols for testing: BTC, SOL, AVAX
    // Note: AI, ML, DATA may not be valid trading pairs - these are placeholders
    basket: [
      { symbol: 'BTC/USD', exchange: 'hyperliquid', weight: 0.4 },
      { symbol: 'SOL/USD', exchange: 'hyperliquid', weight: 0.35 },
      { symbol: 'AVAX/USD', exchange: 'hyperliquid', weight: 0.25 },
    ],
  },
  {
    id: 'character-2',
    name: 'Green Energy',
    description: 'Environmental and sustainable energy focused trading strategy',
    basket: [
      { symbol: 'SOLAR/USD', exchange: 'hyperliquid', weight: 0.5 },
      { symbol: 'WIND/USD', exchange: 'hyperliquid', weight: 0.3 },
      { symbol: 'BATTERY/USD', exchange: 'hyperliquid', weight: 0.2 },
    ],
  },
  {
    id: 'character-3',
    name: 'DeFi Evolution',
    description: 'Decentralized finance protocols and yield farming strategies',
    basket: [
      { symbol: 'DEFI/USD', exchange: 'hyperliquid', weight: 0.45 },
      { symbol: 'YIELD/USD', exchange: 'hyperliquid', weight: 0.35 },
      { symbol: 'GOV/USD', exchange: 'hyperliquid', weight: 0.2 },
    ],
  },
]

