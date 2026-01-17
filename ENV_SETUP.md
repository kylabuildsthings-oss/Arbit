# Environment Variables Setup

## Required Environment Variables

Create or update `.env.local` with the following variables:

```bash
# Pear Protocol API Configuration
PEAR_CLIENT_ID=APITRADER
NEXT_PUBLIC_PEAR_API_URL=https://hl-v2.pearprotocol.io

# Wallet Private Key (REQUIRED for authentication)
# This is your wallet's private key used for EIP-712 signing
# Keep this secure and never commit to git
PEAR_WALLET_PRIVATE_KEY=0xYourPrivateKeyHere
```

## Getting Your Private Key

**⚠️ SECURITY WARNING**: Never share your private key or commit it to git!

Your private key should:
- Start with `0x` (or it will be added automatically)
- Be 64 hex characters long (not including 0x prefix)
- Be the private key for a wallet that you control

## Verification

After setting up `.env.local`:
1. Restart your Next.js dev server (`npm run dev`)
2. Check server logs - you should see: `Pear Client initialized with wallet: 0x...`
3. When executing a trade, authentication will happen automatically

## Python vs TypeScript

This setup matches the working Python implementation:
- Python uses: `WALLET_PRIVATE_KEY` environment variable
- TypeScript uses: `PEAR_WALLET_PRIVATE_KEY` environment variable

Both implementations use the same private key from the same wallet.

