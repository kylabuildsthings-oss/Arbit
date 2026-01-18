'use client'

import { useState, useEffect } from 'react'
import AgentApproval from '@/components/AgentApproval'
import './styles/WalletConnect.css'

interface WalletConnectProps {
  onConnected?: (walletAddress: string) => void
}

export default function WalletConnect({ onConnected }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [showConnect, setShowConnect] = useState(false)

  useEffect(() => {
    // Check for existing wallet connection
    if (typeof window !== 'undefined') {
      const storedWallet = localStorage.getItem('walletAddress')
      if (storedWallet) {
        setWalletAddress(storedWallet)
        setIsConnected(true)
      }
    }
  }, [])

  const handleApproved = (address: string) => {
    setWalletAddress(address)
    setIsConnected(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('walletAddress', address)
    }
    setShowConnect(false)
    if (onConnected) {
      onConnected(address)
    }
  }

  const handleDisconnect = () => {
    setWalletAddress(null)
    setIsConnected(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletAddress')
    }
    if (onConnected) {
      onConnected('')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && walletAddress) {
    return (
      <div className="wallet-connect-container">
        <div className="wallet-status connected">
          <div className="wallet-status-header">
            <span className="status-indicator connected"></span>
            <span className="status-text">Wallet Connected</span>
          </div>
          <div className="wallet-address-display">
            <span className="wallet-address">{formatAddress(walletAddress)}</span>
            <button className="disconnect-button" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showConnect) {
    return (
      <div className="wallet-connect-container">
        <div className="wallet-connect-modal">
          <div className="modal-header">
            <h3>Connect Wallet</h3>
            <button className="close-button" onClick={() => setShowConnect(false)}>
              ×
            </button>
          </div>
          <div className="modal-content">
            <AgentApproval onApproved={handleApproved} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wallet-connect-container">
      <div className="wallet-status disconnected">
        <div className="wallet-status-header">
          <span className="status-indicator disconnected"></span>
          <span className="status-text">No Wallet Connected</span>
        </div>
        <button className="connect-button" onClick={() => setShowConnect(true)}>
          Connect Wallet
        </button>
      </div>
    </div>
  )
}
