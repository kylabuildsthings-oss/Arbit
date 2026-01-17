# Authentication Issue: 401 Unauthorized

## Current Status
✅ Base URL is correct: `https://hl-v2.pearprotocol.io`  
❌ Bearer token is invalid or expired: Getting 401 Unauthorized

## The Problem

Your `PEAR_CLIENT_SECRET` value (`0xa681062f5bC3C00B2CfD58e33957bDF56Cc6BeA8`) is being used as a Bearer token, but it's being rejected with:
```
"message":"Invalid or expired token"
```

## Possible Solutions

### Option 1: Authenticate Using EIP-712 Flow (Standard Method)

According to Pear Protocol docs, you need to:

1. **GET EIP-712 message**: `GET /auth/eip712-message?address=<wallet>&clientId=HLHackathon1`
2. **Sign the message** with your wallet (EIP-712)
3. **POST to authenticate**: `POST /auth/login` with the signature
4. **Get access token** from the response
5. **Use access token** as Bearer token

### Option 2: Hackathon-Specific Authentication

For hackathons, there might be:
- A different authentication method
- API key in a header instead of Bearer token
- Pre-issued tokens/credentials

### Option 3: Check Your Credentials

The value `0xa681062f5bC3C00B2CfD58e33957bDF56Cc6BeA8` might be:
- A wallet address (not a token)
- A private key (needs signing)
- An API key (needs different header format)

## Next Steps

1. **Check hackathon documentation** for authentication instructions
2. **Try EIP-712 authentication flow** if you have a wallet
3. **Contact hackathon organizers** to confirm the authentication method
4. **Verify your credentials** - make sure you're using the right value for Bearer token

## Quick Test

The good news: We're now hitting the correct API (`https://hl-v2.pearprotocol.io`)! Once you have a valid Bearer token, everything should work.

