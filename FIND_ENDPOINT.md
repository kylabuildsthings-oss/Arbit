# Finding the Correct Basket Trade Endpoint

## Current Status
All endpoints are returning 404. The agent wallet endpoint exists at `https://hl-v2.pearprotocol.io/agentWallet`, but the basket trade endpoint path is unknown.

## Test Authentication First

Run this to verify your token works:

```bash
curl http://localhost:3000/api/test-auth
```

This will:
1. Test if your Bearer token is valid
2. Try accessing the `/agentWallet` endpoint (known to exist)
3. Show what endpoints to try next

## Next Steps

1. **Check Pear Protocol API Specification for "Positions"**
   - Visit: https://docs.pearprotocol.io/api-integration/api-specification/positions
   - This should show the exact endpoint path for executing basket trades

2. **Verify Authentication Works**
   - If `/test-auth` returns 401/403, your token is invalid
   - If it returns 200, authentication works and we need to find the right endpoint

3. **Common Endpoint Patterns to Try**
   Based on REST API conventions, it might be:
   - `/positions` (create position)
   - `/orders` (create order)
   - `/baskets` or `/basket-trades`
   - `/api/v1/positions`

4. **Check Hackathon Documentation**
   - Hackathons sometimes have special endpoints
   - May require different authentication
   - May use a different base URL

## Current Configuration

- Base URL: `https://hl-v2.pearprotocol.io` (from official docs)
- Bearer Token: From `PEAR_CLIENT_SECRET` (should start with `0x`)
- Client ID: `HLHackathon1`

## Debugging

The code now:
- Automatically uses Bearer token from `PEAR_CLIENT_SECRET`
- Tries 10 different endpoint paths
- Logs each attempt to console

Check your Next.js server console for detailed logs of each endpoint attempt.

