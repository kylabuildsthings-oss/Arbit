# Pear Protocol API Client

A Python client for integrating with [Pear Protocol's](https://docs.pearprotocol.io) pair trading API on Hyperliquid Exchange.

## Features

- ✅ EIP-712 wallet signature-based authentication
- ✅ JWT token management (access & refresh tokens)
- ✅ Agent wallet setup and management
- ✅ Support for multiple client IDs
- ✅ Token refresh and logout functionality
- ✅ Full API client structure ready for extension

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

### Wallet Private Key

Set your wallet private key as an environment variable:

```bash
export WALLET_PRIVATE_KEY=your_private_key_here
```

**Important Security Notes:**
- Never commit your private key to version control
- Use a dedicated wallet for pair trading (not your main trading wallet)
- Consider using Hyperliquid's sub-account feature if you have 100k+ USD trading volume

### Client IDs

- **APITRADER**: For individual traders (default)
- **Custom Client IDs**: Contact Pear Protocol to obtain your own client ID if building a product

## Usage

### Basic Example

```python
from pear_client import PearProtocolClient

# Initialize client with wallet private key
client = PearProtocolClient(wallet_private_key="0x...")

# Login with client ID
client.login("APITRADER")

# Make authenticated API calls
agent_wallet = client.get_agent_wallet()
print(f"Agent wallet: {agent_wallet}")

# Logout when done
client.logout()
```

### Testing Client IDs

Run the test script to test authentication with different client IDs:

```bash
export WALLET_PRIVATE_KEY=your_private_key
python test_client_ids.py
```

## API Overview

### Authentication Flow

1. **Get EIP-712 Message**: Request a message to sign from Pear Protocol
2. **Sign Message**: Sign the message using your wallet's private key
3. **Authenticate**: Send the signature to receive JWT tokens
4. **Use Tokens**: Include access token in `Authorization: Bearer <token>` header

### Token Management

- **Access Token**: Valid for 15 minutes, used for authenticated requests
- **Refresh Token**: Valid for 30 days, used to obtain new access tokens
- **Auto-refresh**: Call `refresh_access_token()` when access token expires

### Agent Wallet

Before trading, you need to set up an agent wallet:

1. Check existing agent wallet: `get_agent_wallet()`
2. Create new agent wallet: `create_agent_wallet()` (if needed)
3. Approve agent wallet: User signs a message to authorize Pear Protocol
4. Use agent wallet: Pear Protocol can now trade on your behalf

### Builder Code

All trades are routed to the builder address: `0xA47D4d99191db54A4829cdf3de2417E527c3b042`

Users must approve this address to charge fees for each trade.

## API Endpoints Implemented

- `GET /auth/eip712-message` - Get EIP-712 message to sign
- `POST /auth/authenticate` - Authenticate with signature
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and invalidate tokens
- `GET /agent-wallet` - Get agent wallet information
- `POST /agent-wallet` - Create new agent wallet

## Environment

- **Mainnet**: `hl-v2.pearprotocol.io`

## Documentation

Full API documentation: https://docs.pearprotocol.io/api-integration/overview

## License

This is a client library for Pear Protocol API. See Pear Protocol's Terms of Service for usage terms.

