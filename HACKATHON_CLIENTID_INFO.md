# Hackathon ClientID Information

## Current Setup
- **ClientID**: `HLHackathon1`
- **API URL**: `https://hl-v2.pearprotocol.io`
- **Environment**: Hackathon-specific (likely test/sandbox)

## ClientID Options
According to hackathon description:
- `HLHackathon1` through `HLHackathon10` are available

## Test vs Real Trades

### Likely Scenario (Test Environment)
The `hl-v2.pearprotocol.io` URL and hackathon ClientIDs suggest this is a **test/sandbox environment**:
- ✅ Safe for testing without real funds
- ✅ Trades may be simulated
- ✅ No real financial risk
- ❌ May not reflect actual market conditions

### Possible Scenario (Real Trading)
If Pear Protocol set up hackathon IDs with real trading access:
- ⚠️ Trades would execute with real funds
- ⚠️ Real financial risk
- ⚠️ Requires proper wallet funding and approvals

## How to Verify

### 1. Check Hackathon Documentation
- Look for mentions of "test environment", "sandbox", or "simulated trading"
- Check if real funds are required

### 2. Check the API URL
- Test/Sandbox: Usually has `test`, `sandbox`, `staging`, or version prefixes like `v2` or `hl-v2`
- Production: Usually `api.pearprotocol.io` or main domain

### 3. Check Wallet Requirements
- If trades are real: You'll need actual funds in your Hyperliquid wallet
- If trades are simulated: May not require real wallet funding

### 4. Test with Small Amounts
If unsure, start with the smallest possible trade size:
- Default is `$10 notional` in our code
- Verify if this appears in your actual Hyperliquid account

### 5. Contact Pear Protocol Support
Ask directly:
- Are `HLHackathon1-10` IDs for test or production?
- Does `hl-v2.pearprotocol.io` execute real trades?
- What are the limits/restrictions for hackathon IDs?

## Current Code Behavior

Our implementation will:
1. Authenticate using EIP-712 signature
2. Execute trades through `/positions` endpoint
3. Use `HLHackathon1` as ClientID
4. Connect to `hl-v2.pearprotocol.io`

**Important**: Before executing trades:
- ✅ Verify Agent Wallet is created and approved
- ✅ Verify Builder Code (`0xA47D4d99191db54A4829cdf3de2417E527c3b042`) is approved
- ✅ Confirm whether environment is test or production
- ✅ Start with smallest trade size to verify behavior

## Switching ClientIDs

To test different ClientIDs, update `.env.local`:
```bash
PEAR_CLIENT_ID=HLHackathon2  # Try HLHackathon1 through HLHackathon10
```

Then restart your Next.js server.

