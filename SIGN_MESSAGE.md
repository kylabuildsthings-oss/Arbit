# How to Sign the EIP-712 Message

You've successfully retrieved the EIP-712 message! Now you need to sign it.

## Option 1: Sign with MetaMask (Easiest)

If you have MetaMask installed:

1. Open your browser console (F12)
2. Run this JavaScript:

```javascript
// The EIP-712 message from your curl response
const message = {
  "primaryType": "Authentication",
  "domain": {
    "name": "Pear Protocol",
    "version": "1",
    "chainId": 42161,
    "verifyingContract": "0x0000000000000000000000000000000000000001"
  },
  "types": {
    "Authentication": [
      {"name": "address", "type": "address"},
      {"name": "clientId", "type": "string"},
      {"name": "timestamp", "type": "uint256"},
      {"name": "action", "type": "string"}
    ]
  },
  "message": {
    "address": "0x439fba46a26c457582952d34fb2b7e0f07348add",
    "clientId": "HLHackathon1",
    "timestamp": 1768633614,
    "action": "authenticate"
  }
};

// Sign with MetaMask
const address = "0x439fBa46A26c457582952D34Fb2B7e0f07348adD";

ethereum.request({
  method: "eth_signTypedData_v4",
  params: [address, JSON.stringify(message)],
}).then((signature) => {
  console.log("Signature:", signature);
  // Use this signature in the next step
});
```

## Option 2: Use Your Private Key (If Available)

If you have your private key, I can add code to automatically sign using `ethers.js` or `eth_account`. 

Let me know if you want me to:
1. Add `ethers` package to sign automatically
2. Create an endpoint that accepts private key and signs the message

## Option 3: Manual Signing with Other Tools

- Use Python with `eth_account` library
- Use any EIP-712 compatible signing tool
- Use wallet CLI tools

## After Getting the Signature

Once you have the signature (starts with `0x`), POST it:

```bash
curl -X POST http://localhost:3000/api/authenticate/login \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x439fBa46A26c457582952D34Fb2B7e0f07348adD",
    "signature": "0x<your_signature_here>"
  }'
```

This will return `accessToken` and `refreshToken` that you can use as `PEAR_CLIENT_SECRET`.

