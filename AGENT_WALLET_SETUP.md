# Agent Wallet Setup Guide

The 500 error you're seeing is likely because your agent wallet is not set up or approved. Follow these steps:

## Step 1: Check Agent Wallet Status

```bash
curl http://localhost:3000/api/agent-wallet
```

If it returns `{"exists": false}`, proceed to Step 2.

## Step 2: Create Agent Wallet

```bash
curl -X POST http://localhost:3000/api/agent-wallet
```

This will create the agent wallet and return an approval message that needs to be signed.

## Step 3: Approve Agent Wallet

After creating the agent wallet, you'll receive an approval message. You need to:

1. Sign the approval message with your wallet (address: `0x439fBa46A26c457582952D34Fb2B7e0f07348adD`)
2. Submit the signature to Pear Protocol

## Step 4: Approve Builder Code

You also need to approve the builder code address:
- **Builder Address**: `0xA47D4d99191db54A4829cdf3de2417E527c3b042`

This allows Pear Protocol to charge fees for trades.

## Documentation

See the official Pear Protocol docs:
- [Agent Wallet Setup](https://docs.pearprotocol.io/api-integration/access-management/agent-wallet-setup)
- [Builder Code](https://docs.pearprotocol.io/api-integration/access-management/builder-code)

## Quick Test

After setting up the agent wallet, try the trade again. The 500 error should be resolved once the agent wallet is properly approved.

