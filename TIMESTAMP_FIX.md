# Fixing "Invalid timestamp" Error

## Problem
Getting error: `"Invalid timestamp"` when authenticating with Pear Protocol.

## Cause
The EIP-712 message includes a timestamp, and Pear Protocol validates that the timestamp is recent. If too much time passes between:
1. Getting the EIP-712 message
2. Signing it
3. Sending it to authenticate

The timestamp may expire and authentication fails.

## Solution
The code now:
- Gets the EIP-712 message fresh
- Signs it immediately
- Sends authentication immediately

All steps happen in quick succession without delays.

## Try Again
Run the authentication command again - it should work now:

```bash
curl -X POST http://localhost:3000/api/authenticate/auto \
  -H "Content-Type: application/json" \
  -d '{"address":"0x439fBa46A26c457582952D34Fb2B7e0f07348adD","privateKey":"0x75754e3be1ad4c4b27bdd7fae441f954941efaee151f9fc8557d55e808acb1e5"}'
```

The code ensures all steps happen quickly in sequence to avoid timestamp expiration.

