# Debugging Pear Protocol API Endpoints

## Current Status
All endpoints are returning 404 errors, suggesting either:
1. Wrong API base URL
2. Wrong endpoint path
3. Need authentication first

## Environment Variable Notes

**Important**: Remove quotes from `PEAR_CLIENT_SECRET` in `.env.local`

❌ **Wrong**:
```
PEAR_CLIENT_SECRET="abc123"
```

✅ **Correct**:
```
PEAR_CLIENT_SECRET=abc123
```

Quotes can cause the value to include the quote characters, breaking authentication.

## Testing Endpoints

The code will now try these endpoints in order:
1. `/api/v1/basket-trade`
2. `/api/v1/positions`
3. `/v1/basket-trade`
4. `/v1/positions`
5. `/api/basket-trade`
6. `/api/positions`
7. `/basket-trade`
8. `/positions`
9. `/trade`
10. `/execute`

## Next Steps

1. **Check hackathon documentation** for the exact API endpoint
2. **Verify the base URL** - might be `https://api.pearprotocol.io` instead of `https://hl-v2.pearprotocol.io`
3. **Check if authentication is required first** - you may need to authenticate before executing trades
4. **Review server logs** - check the Next.js console for which endpoints are being tried

## Current Configuration

- Base URL: From `NEXT_PUBLIC_PEAR_API_URL` or default `https://api.pearprotocol.io`
- Client ID: `HLHackathon1`
- Endpoint paths: Multiple attempts with different versions/paths

