'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const BUILDER_ADDRESS = '0xA47D4d99191db54A4829cdf3de2417E527c3b042'

interface AgentApprovalProps {
  onApproved: (walletAddress: string) => void
}

export default function AgentApproval({ onApproved }: AgentApprovalProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isApproving, setIsApproving] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  // Check if wallet is already connected on mount
  useEffect(() => {
    // Wait a bit for wallet to inject (Rabby/MetaMask sometimes takes a moment)
    const checkWallet = () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        checkWalletConnection()
      }
    }
    
    // Check immediately
    checkWallet()
    
    // Also check after a short delay (wallets sometimes inject after page load)
    const timer = setTimeout(checkWallet, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window === 'undefined') {
      return
    }

    const ethereum = (window as any).ethereum
    if (!ethereum) {
      return
    }

    try {
      const provider = new ethers.BrowserProvider(ethereum)
      const accounts = await provider.listAccounts()
      if (accounts.length > 0) {
        setIsConnected(true)
        setWalletAddress(accounts[0].address)
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err)
    }
  }

  const connectWallet = async () => {
    if (typeof window === 'undefined') {
      setError('Wallet connection is only available in the browser.')
      return
    }

    // Check for any Ethereum provider (MetaMask, Rabby, Coinbase Wallet, etc.)
    const ethereum = (window as any).ethereum
    
    if (!ethereum) {
      setError('Web3 wallet not found. Please install MetaMask, Rabby, or another compatible wallet and refresh the page.')
      return
    }

    try {
      setError(null)
      const ethereum = (window as any).ethereum
      const provider = new ethers.BrowserProvider(ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])

      if (accounts.length > 0) {
        setIsConnected(true)
        setWalletAddress(accounts[0])
        setError(null) // Clear any previous errors on success
      }
    } catch (err: any) {
      // Handle user rejection gracefully - this is not really an error
      if (err.code === 4001 || 
          err.code === 'ACTION_REJECTED' ||
          err.message?.includes('rejected') ||
          err.message?.includes('denied') ||
          err.message?.includes('User rejected')) {
        // User clicked "Reject" or "Cancel" - this is normal, don't show as error
        setError(null)
        console.log('User rejected wallet connection')
        return
      }
      
      // For actual errors, show them
      setError(err.message || 'Failed to connect wallet')
    }
  }

  const approveBuilder = async () => {
    if (!walletAddress) {
      setError('Wallet not connected')
      return
    }

    const ethereum = (window as any).ethereum
    if (!ethereum) {
      setError('Wallet provider not found. Please refresh the page.')
      return
    }

    setIsApproving(true)
    setApprovalStatus('pending')
    setError(null)

    try {
      const provider = new ethers.BrowserProvider(ethereum)
      const signer = await provider.getSigner()

      // Check the network first
      const network = await provider.getNetwork()
      console.log('Connected network:', network.chainId)

      // Hyperliquid uses a special approveAgent transaction on their exchange contract
      // The Hyperliquid exchange contract address on Arbitrum One (mainnet) is:
      // 0x0000000000000000000000000000000000000000 (placeholder - needs actual address)
      // For testnet, this may differ
      
      // Hyperliquid approveAgent function signature:
      // function approveAgent(address agent, bool isAgent) external
      // We need to call this on the Hyperliquid exchange contract
      
      // Simplified ABI for approveAgent
      const hyperliquidExchangeABI = [
        'function approveAgent(address agent, bool isAgent) external'
      ]
      
      // Hyperliquid exchange contract address (mainnet)
      // TODO: Replace with actual Hyperliquid exchange contract address
      // For now, we'll use a placeholder that the user needs to update
      const HYPERLIQUID_EXCHANGE = '0x0000000000000000000000000000000000000000' // PLACEHOLDER - needs real address
      
      // For the hackathon, we'll use a simplified approach:
      // Since Pear Protocol abstracts this, we can mark it as approved via UI
      // In production, you'd need the actual Hyperliquid contract address and ABI
      
      // Create contract instance
      const exchangeContract = new ethers.Contract(
        HYPERLIQUID_EXCHANGE,
        hyperliquidExchangeABI,
        signer
      )
      
      // Call approveAgent(true) to approve the builder
      // Note: You may need to adjust the parameters based on Hyperliquid's exact ABI
      try {
        const tx = await exchangeContract.approveAgent(BUILDER_ADDRESS, true, {
          gasLimit: 100000, // Adjust gas limit as needed
        })
        
        setTxHash(tx.hash)
        
        // Wait for transaction confirmation
        const receipt = await tx.wait()
        
        if (receipt?.status === 1) {
          setApprovalStatus('success')
          onApproved(walletAddress)
        } else {
          setApprovalStatus('error')
          setError('Transaction failed')
        }
      } catch (contractErr: any) {
        // If contract call fails, it might be because we don't have the correct address
        throw contractErr
      }
    } catch (err: any) {
      console.error('Approval error:', err)
      setApprovalStatus('error')
      setError(err.message || 'Failed to approve builder address')
    } finally {
      setIsApproving(false)
    }
  }


  const copyAddress = () => {
    navigator.clipboard.writeText(BUILDER_ADDRESS)
    // You could add a toast notification here
  }

  if (approvalStatus === 'success') {
    return (
      <div className="bg-green-900/50 border border-green-500 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="text-green-400 text-2xl">✅</div>
          <div>
            <h3 className="text-lg font-semibold text-green-100">Builder Approved!</h3>
            <p className="text-sm text-green-200 mt-1">
              Your wallet has approved the builder address. You can now execute trades.
            </p>
            {txHash && (
              <p className="text-xs text-green-300 mt-2">
                Transaction: <code className="bg-green-900/50 px-1 rounded">{txHash.slice(0, 10)}...{txHash.slice(-8)}</code>
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-2">Step 1: Approve Builder</h2>
        <p className="text-gray-300">
          To execute live trades, you need to approve the Pear Protocol builder address to charge fees.
        </p>
      </div>

      <div className="mb-4 p-4 bg-slate-900/50 rounded border border-slate-600">
        <label className="text-sm font-semibold text-gray-400 mb-2 block">Builder Address:</label>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-blue-300 bg-slate-800 px-3 py-2 rounded text-sm break-all">
            {BUILDER_ADDRESS}
          </code>
          <button
            onClick={copyAddress}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {!isConnected ? (
        <div>
          <button
            onClick={connectWallet}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors mb-3"
          >
            Connect Wallet (Rabby / MetaMask)
          </button>
          {error && error.includes('not found') && (
            <div className="mt-3 p-3 bg-blue-900/30 border border-blue-700/50 rounded text-sm">
              <p className="text-blue-200 mb-2">
                <strong>Using Rabby?</strong>
              </p>
              <ul className="text-blue-300 list-disc list-inside space-y-1 text-xs">
                <li>Make sure Rabby wallet extension is installed and enabled in your browser</li>
                <li>Refresh this page after installing Rabby</li>
                <li>Unlock your Rabby wallet (enter your password if needed)</li>
                <li>Try clicking "Connect Wallet" again</li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4 p-3 bg-blue-900/50 border border-blue-500 rounded">
            <p className="text-blue-200 text-sm">
              ✅ Connected: <code className="text-blue-300">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</code>
            </p>
          </div>
          <button
            onClick={approveBuilder}
            disabled={isApproving || approvalStatus === 'pending'}
            className={`w-full py-3 px-4 font-semibold rounded transition-colors ${
              isApproving || approvalStatus === 'pending'
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isApproving || approvalStatus === 'pending' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {txHash ? 'Waiting for confirmation...' : 'Approving...'}
              </span>
            ) : (
              'Approve Builder'
            )}
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded">
        <p className="text-yellow-200 text-xs">
          ⚠️ <strong>Note:</strong> Ensure your wallet is connected to the correct network (Hyperliquid testnet/mainnet) and has sufficient tokens for gas fees.
        </p>
      </div>
    </div>
  )
}

