# Testing the Pear Protocol Basket Trade Integration

## Prerequisites

1. Make sure your `.env.local` file has the correct configuration:
   ```
   PEAR_CLIENT_ID=HLHackathon1
   PEAR_CLIENT_SECRET=your_client_secret_here
   NEXT_PUBLIC_PEAR_API_URL=https://hl-v2.pearprotocol.io
   ```

2. If authentication is required, you may need to set up an access token. Check Pear Protocol docs for hackathon authentication flow.

## Test the Execute Trade Endpoint

### Test with AI Revolution Character

```bash
curl -X POST http://localhost:3000/api/execute-trade \
  -H "Content-Type: application/json" \
  -d '{"characterId": "ai-revolution"}'
```

### Expected Response (Success)

```json
{
  "success": true,
  "orderId": "0x...",
  "status": "submitted",
  "message": "Trade executed for AI Revolution",
  "character": {
    "id": "ai-revolution",
    "name": "AI Revolution"
  },
  "basket": {
    "long": ["AI", "ML", "DATA"],
    "short": ["ETH"]
  }
}
```

### Expected Response (Error)

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Implementation Details

- **Character ID**: Updated to `ai-revolution` (was `character-1`)
- **Long Assets**: AI, ML, DATA (from character basket)
- **Short Assets**: ETH (default)
- **Notional**: Fixed at $10 USD
- **Weights**: Automatically distributed equally across assets in each side

## Debugging

Check the server console logs for detailed information about:
- Request payload sent to Pear Protocol
- Response from Pear Protocol API
- Any errors during execution

