# How to View Server-Side Logs

## Where to Find Logs

The Next.js server logs appear in the **terminal window where you started the dev server**.

### If you started the server with:
```bash
npm run dev
```

The logs will appear in **that same terminal window**.

## What to Look For

When you click "Trade This Character" on the frontend, you should see logs like:

### 1. Authentication Logs (if not already authenticated):
```
No access token found. Authenticating...
[1/3] Getting EIP-712 message for client ID: APITRADER
[2/3] Signing EIP-712 message...
[3/3] Authenticating...
✅ Authentication successful!
✅ Authentication successful, token set
```

### 2. Agent Wallet Check:
```
Agent wallet status: ACTIVE
```
or
```
⚠️ No agent wallet found. You may need to create one before trading.
```

### 3. Trade Execution:
```
Executing basket trade on endpoint: /positions
Trade payload: {
  "executionType": "MARKET",
  "leverage": 1,
  "usdValue": 10,
  "slippage": 0.05,
  "longAssets": [...],
  "shortAssets": [...]
}
```

### 4. Success or Error:
```
Trade response: { ... }
```
or
```
Trade execution error: {
  status: 500,
  statusText: 'Internal Server Error',
  data: { ... }
}
```

## How to View Logs

### Option 1: Check the Terminal Window
1. Find the terminal window where you ran `npm run dev`
2. Look for the logs there - they appear in real-time

### Option 2: If You Lost the Terminal
1. The server is still running in the background
2. You can check the logs by:
   - Looking at the terminal where you started it
   - Or restarting the server to see fresh logs

### Option 3: Save Logs to a File
If you want to save logs to a file, restart the server with:
```bash
npm run dev 2>&1 | tee server.log
```
This will save all output to `server.log` while still showing it in the terminal.

## Common Log Locations

- **Next.js dev server**: Terminal where `npm run dev` was run
- **Browser console**: Open DevTools (F12) → Console tab (for frontend logs)
- **Network tab**: Open DevTools (F12) → Network tab (to see API requests/responses)

## What to Share for Debugging

If you're getting errors, share:
1. The **full error message** from the server logs
2. The **Trade payload** JSON (from the logs)
3. The **Trade execution error** object (if present)
4. The **Agent wallet status** (if shown)

This will help diagnose the 500 error!

