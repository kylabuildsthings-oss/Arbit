# Automatic Authentication Setup

## ✅ What's Been Set Up

1. ✅ Installed `ethers.js` for EIP-712 signing
2. ✅ Created automatic authentication endpoint at `/api/authenticate/auto`
3. ✅ Added signing functions in `lib/auth.ts`

## How to Use

### Step 1: Get Your Private Key

You need the **private key** that corresponds to your wallet address:
- Address: `0x439fBa46A26c457582952D34Fb2B7e0f07348adD`
- Private Key: (you need to provide this - it starts with `0x` and is 66 characters)

### Step 2: Run Automatic Authentication

```bash
curl -X POST http://localhost:3000/api/authenticate/auto \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x439fBa46A26c457582952D34Fb2B7e0f07348adD",
    "privateKey": "0x<your_private_key_here>"
  }'
```

This will:
1. ✅ Get the EIP-712 message from Pear Protocol
2. ✅ Sign it automatically with your private key
3. ✅ Authenticate and get access/refresh tokens
4. ✅ Return the tokens for you to save

### Step 3: Save the Access Token

The response will include `accessToken`. Add it to your `.env.local`:

```
PEAR_CLIENT_SECRET=<accessToken_from_response>
```

**Important**: Remove any quotes around the token value!

### Step 4: Restart Your Server

```bash
# Stop server (Ctrl+C)
rm -rf .next
npm run dev
```

## Security Warning

⚠️ **NEVER commit your private key to git!**
- Private keys are in `.gitignore`
- Only use this in development
- Never expose private keys in client-side code

## Example Response

```json
{
  "success": true,
  "message": "Authentication successful!",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "nextSteps": [...]
}
```

## Test After Authentication

Once you have the access token in `.env.local`, test it:

```bash
curl http://localhost:3000/api/test-auth
```

You should see `"success": true` instead of 401 errors.

