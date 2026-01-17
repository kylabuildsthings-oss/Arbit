'use client'

import { useState } from 'react'
import { characters } from '@/lib/characters'
import type { Character } from '@/lib/characters'
import AgentApproval from '@/components/AgentApproval'

export default function Home() {
  const [builderApproved, setBuilderApproved] = useState(false)
  const [approvedWalletAddress, setApprovedWalletAddress] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [tradeResult, setTradeResult] = useState<{
    success: boolean
    orderId?: string
    status?: string
    message?: string
    error?: string
  } | null>(null)

  const executeTrade = async (character: Character) => {
    setLoading(true)
    setTradeResult(null)

    try {
      const response = await fetch('/api/execute-trade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterId: character.id }),
      })

      const data = await response.json()

      if (data.success) {
        setTradeResult({
          success: true,
          orderId: data.orderId,
          status: data.status,
          message: data.message,
        })
      } else {
        setTradeResult({
          success: false,
          error: data.error || 'Trade execution failed',
        })
      }
    } catch (error) {
      console.error('Error executing trade:', error)
      setTradeResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Pear Characters - Trade Narratives, Not Just Tokens
          </h1>
          <p className="text-xl text-gray-300 mt-4">
            Integrate with Pear Protocol API for narrative-based trading
          </p>
        </header>

        {/* Builder Approval Step */}
        {!builderApproved && (
          <AgentApproval
            onApproved={(walletAddress) => {
              setBuilderApproved(true)
              setApprovedWalletAddress(walletAddress)
            }}
          />
        )}

        {/* Trade Result Banner */}
        {tradeResult && (
          <div
            className={`mb-8 p-4 rounded-lg ${
              tradeResult.success
                ? 'bg-green-900/50 border border-green-500'
                : 'bg-red-900/50 border border-red-500'
            }`}
          >
            {tradeResult.success ? (
              <div className="text-green-100">
                <p className="font-semibold">✅ Trade Executed Successfully!</p>
                <p className="text-sm mt-1">{tradeResult.message}</p>
                {tradeResult.orderId && (
                  <p className="text-sm mt-1">
                    Order ID: <code className="text-green-300">{tradeResult.orderId}</code>
                  </p>
                )}
                {tradeResult.status && (
                  <p className="text-sm mt-1">Status: {tradeResult.status}</p>
                )}
              </div>
            ) : (
              <div className="text-red-100">
                <p className="font-semibold">❌ Trade Failed</p>
                <p className="text-sm mt-1">{tradeResult.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Characters Grid - Only show after approval */}
        {builderApproved ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-2xl font-bold text-white mb-2">{character.name}</h2>
              <p className="text-gray-300 mb-4">{character.description}</p>

              {/* Basket Display */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-400 mb-2">Long Basket:</p>
                <div className="flex flex-wrap gap-2">
                  {character.basket.map((pair, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-900/50 text-blue-200 rounded text-xs"
                    >
                      {pair.symbol.split('/')[0]}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-semibold text-gray-400 mt-2 mb-1">Short:</p>
                <span className="px-2 py-1 bg-red-900/50 text-red-200 rounded text-xs">
                  ETH
                </span>
              </div>

              {/* Trade Button */}
              <button
                onClick={() => executeTrade(character)}
                disabled={loading}
                className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
                  loading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? 'Executing Trade...' : 'Trade This Character'}
              </button>
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Please approve the builder address above to enable live trades.
            </p>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-white">Executing trade through Pear Protocol...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
