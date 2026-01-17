# Authentication Guide - Using Your Wallet Address

## Your Situation

You have:
- **Wallet Address**: `0xa681062f5bC3C00B2CfD58e33957bDF56Cc6BeA8` (your Pear Protocol account)
- **Need**: Bearer token for API authentication

## Solution: EIP-712 Authentication Flow

Your wallet address is not a Bearer token. You need to authenticate using the EIP-712 flow to get tokens.

## Step-by-Step Authentication

### Step 1: Get the EIP-712 Message

```bash
curl "http://localhost:3000/api/authenticate?address=0xa681062f5bC3C00B2CfD58e33957bDF56Cc6BeA8"
```

This returns an EIP-712 message that needs to be signed.

### Step 2: Sign the Message

You need to sign the EIP-712 message using:
- Your **private key** (corresponding to address `0xa681062f5bC3C00B2CfD58e33957bDF56Cc6BeA8`)
- Use a tool like `eth_account` (Python), `ethers.js` (JavaScript), or your wallet

The message structure will look like:
```json
{
  "primaryType": "Authentication",
  "domain": {...},
  "message": {...}
}
```

### Step 3: Send Signature to Authenticate

```bash
curl -X POST http://localhost:3000/api/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0xa681062f5bC3C00B2CfD58e33957bDF56Cc6BeA8",
    "signature": "0x<your_signature_here>"
  }'
```

This returns:
```json
{
  "success": true,
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Step 4: Update .env.local

Add the `accessToken` to your `.env.local`:
```
PEAR_CLIENT_SECRET=<accessToken_from_step_3>
```

**Important**: Don't use quotes around the token value.

### Step 5: Restart Next.js Server

After updating `.env.local`, restart your dev server:
```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

## Alternative: Use Your Private Key Directly

If you have your private key, we can add code to automatically sign the message and authenticate. This would require adding your private key to `.env.local` (keep it secure!).

## Token Expiry

- **Access Token**: Valid for ~15 minutes
- **Refresh Token**: Valid for ~30 days

When the access token expires, use the refresh token to get a new one via `/auth/refresh`.

## Current .env.local Setup

Your `.env.local` should have:
```
PEAR_CLIENT_ID=HLHackathon1
PEAR_CLIENT_SECRET=<access_token_from_auth_flow>
NEXT_PUBLIC_PEAR_API_URL=https://hl-v2.pearprotocol.io
```

The `PEAR_CLIENT_SECRET` should be the **access token** from authentication, not your wallet address.

