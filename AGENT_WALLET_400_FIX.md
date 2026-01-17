# Fixing Agent Wallet 400 Error

## The Problem

When you try to create an agent wallet with `POST /api/agent-wallet`, you get a 400 error. This means:
- ✅ The agent wallet **already exists**
- ❌ But it's **not approved** (that's why `GET /api/agent-wallet` returns empty `{}`)

## The Solution

The agent wallet needs to be **approved** before it can be used. This requires:

1. **Get the approval message** from Pear Protocol
2. **Sign the message** with your wallet (`0x439fBa46A26c457582952D34Fb2B7e0f07348adD`)
3. **Submit the signature** to Pear Protocol
4. **Approve the builder code** (`0xA47D4d99191db54A4829cdf3de2417E527c3b042`) on Hyperliquid

## Steps to Fix

### Option 1: Use Pear Protocol Dashboard/UI
1. Go to the Pear Protocol interface
2. Navigate to Agent Wallet settings
3. Approve the existing agent wallet
4. Approve the builder code

### Option 2: Manual API Approval (if endpoint exists)
The approval flow typically involves:
1. Getting an EIP-712 approval message
2. Signing it with your wallet
3. Submitting the signature

Check the Pear Protocol docs for the exact approval endpoint:
- https://docs.pearprotocol.io/api-integration/access-management/agent-wallet-setup

### Option 3: Check Server Logs
The 400 error details should be in your Next.js server terminal. Look for:
- The exact error message from Pear Protocol
- Any hints about what's missing or incorrect

## Why This Causes 500 Errors

When the agent wallet is not approved:
- `GET /agentWallet` returns empty `{}`
- `POST /positions` (trade execution) returns `500 Internal Server Error`
- This is because Pear Protocol can't execute trades without an approved agent wallet

## Next Steps

1. **Check the server logs** for the detailed 400 error message
2. **Approve the agent wallet** using one of the methods above
3. **Approve the builder code** on Hyperliquid
4. **Try the trade again** - the 500 error should be resolved

## Quick Test

After approval, check the agent wallet status:
```bash
curl http://localhost:3000/api/agent-wallet
```

It should return something like:
```json
{
  "exists": true,
  "wallet": {
    "address": "...",
    "status": "ACTIVE",
    ...
  }
}
```

Then try your trade again - it should work!

