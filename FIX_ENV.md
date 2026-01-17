# Fix Environment Variable

## Problem
Your `.env.local` has the wrong API base URL:
```
NEXT_PUBLIC_PEAR_API_URL=https://api.pearprotocol.io  ❌ WRONG
```

## Solution
Update `.env.local` to use the correct base URL:
```
NEXT_PUBLIC_PEAR_API_URL=https://hl-v2.pearprotocol.io  ✅ CORRECT
```

Or remove the variable entirely to use the default (which is now correct).

## Update .env.local

Edit your `.env.local` file and change:
```bash
# Change this:
NEXT_PUBLIC_PEAR_API_URL=https://api.pearprotocol.io

# To this:
NEXT_PUBLIC_PEAR_API_URL=https://hl-v2.pearprotocol.io
```

Or remove the line entirely to use the default.

## Verify

After updating, restart your Next.js dev server and test again:
```bash
curl http://localhost:3000/api/test-auth
```

You should now see the correct API URL (`https://hl-v2.pearprotocol.io`) in the response.

