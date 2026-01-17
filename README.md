# ARBIT Trading Cards

A modern web application for collecting and trading crypto-themed trading cards, integrated with Pear Protocol for real trading functionality.

## 🎮 Features

- **Card Gallery**: Browse and discover trading cards with unique stats and rarities
- **Collection Management**: View and manage your card collection
- **Portfolio Tracking**: Monitor your trading performance and portfolio value
- **Wallet Integration**: Connect your Web3 wallet (MetaMask, Rabby, etc.)
- **Trading**: Execute real trades via Pear Protocol integration
- **Educational**: Learn crypto trading concepts through card mechanics

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Web3 wallet (MetaMask, Rabby, or compatible)
- Pear Protocol API credentials (for trading functionality)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Arbit-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
PEAR_CLIENT_ID=your_client_id
PEAR_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_PEAR_API_URL=https://api.pearprotocol.com
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Arbit-Backend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── portfolio/         # Portfolio page
│   ├── trading/           # Trading page
│   └── ...
├── lib/                    # Utility libraries
├── types/                 # TypeScript type definitions
├── public/                 # Static assets
└── scripts/               # Utility scripts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Wallet**: Ethers.js
- **Trading**: Pear Protocol API
- **Deployment**: Vercel/Netlify ready

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Pear Protocol Configuration
PEAR_CLIENT_ID=your_client_id
PEAR_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_PEAR_API_URL=https://api.pearprotocol.com

# Optional: Custom API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## 🎯 Key Features

### Card System
- **Rarities**: Common, Uncommon, Rare, Epic, Legendary
- **Factions**: Nexus, Void, Flux
- **Stats**: Buy Up, Sell Down, Risk Power, Market Smarts
- **Trading Pairs**: Each card represents a crypto trading pair

### Wallet Integration
- Connect with MetaMask, Rabby, or any Web3 wallet
- Secure authentication via EIP-712 signing
- Wallet address stored locally for session persistence

### Trading
- Execute trades through Pear Protocol
- Real-time trade execution
- Trade history tracking
- Portfolio performance metrics

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Wallet Connection Issues
- Ensure your wallet extension is installed and unlocked
- Check that you're on the correct network
- Try refreshing the page after connecting

### Trading Errors
- Verify your Pear Protocol credentials are correct
- Check that your wallet has sufficient funds
- Ensure the builder address is approved

### Build Issues
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📚 Documentation

- [Authentication Guide](AUTHENTICATION_GUIDE.md)
- [Integration Summary](INTEGRATION_SUMMARY.md)
- [Troubleshooting Guide](TROUBLESHOOTING.md)

## 🔗 Links

- [Pear Protocol Documentation](https://docs.pearprotocol.com)
- [Next.js Documentation](https://nextjs.org/docs)

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Pear Protocol for trading infrastructure
- Next.js team for the amazing framework
- The Web3 community for inspiration
