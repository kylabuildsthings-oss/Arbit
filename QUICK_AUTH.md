# Quick Authentication Guide

## Your Wallet Address
`0x439fBa46A26c457582952D34Fb2B7e0f07348adD`

## Quick Start - Automatic Authentication

### Step 1: Get EIP-712 Message

```bash
curl "http://localhost:3000/api/authenticate?address=0x439fBa46A26c457582952D34Fb2B7e0f07348adD"
```

### Step 2: Authenticate Automatically (if you have private key)

```bash
curl -X POST http://localhost:3000/api/authenticate/auto \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x439fBa46A26c457582952D34Fb2B7e0f07348adD",
    "privateKey": "0x<your_private_key>"
  }'
```

### Step 3: Save Access Token

Copy the `accessToken` from the response and add to `.env.local`:

```
PEAR_CLIENT_SECRET=<accessToken>
```

### Step 4: Restart Server

```bash
rm -rf .next && npm run dev
```

### Step 5: Test Authentication

```bash
curl http://localhost:3000/api/test-auth
```

You should see `"success": true` instead of 401.

