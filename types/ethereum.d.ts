// Type definitions for window.ethereum (MetaMask, Rabby, Coinbase Wallet, etc.)

interface EthereumProvider {
  isMetaMask?: boolean
  isRabby?: boolean // Rabby wallet identifier
  request(args: { method: string; params?: any[] }): Promise<any>
  send(method: string, params?: any[]): Promise<any>
  on(event: string, handler: (args: any) => void): void
  removeListener(event: string, handler: (args: any) => void): void
}

interface Window {
  ethereum?: EthereumProvider
}

