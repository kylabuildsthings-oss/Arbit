"""
Test script for Pear Protocol API client IDs
Tests authentication with different client IDs.
"""

import os
import json
import requests
from pear_client import PearProtocolClient


def test_client_id(client_id: str, wallet_private_key: str = None):
    """
    Test authentication with a specific client ID.
    
    Args:
        client_id: Client ID to test
        wallet_private_key: Optional wallet private key (will use env var if not provided)
    """
    print(f"\n{'='*60}")
    print(f"Testing Client ID: {client_id}")
    print(f"{'='*60}")
    
    # Get wallet private key from environment or parameter
    if not wallet_private_key:
        wallet_private_key = os.getenv("WALLET_PRIVATE_KEY")
    
    if not wallet_private_key:
        print("❌ Error: Wallet private key is required!")
        print("   Set WALLET_PRIVATE_KEY environment variable or pass as parameter")
        return False
    
    try:
        # Initialize client
        client = PearProtocolClient(wallet_private_key=wallet_private_key)
        print(f"✓ Client initialized")
        print(f"  Wallet address: {client.wallet_address}")
        
        # Test connection
        print(f"\n[Connection Test]")
        if client.test_connection():
            print("✓ API connection successful")
        else:
            print("⚠ API connection test inconclusive (may require authentication)")
        
        # Attempt authentication
        print(f"\n[Authentication Flow]")
        try:
            auth_response = client.login(client_id)
            
            print(f"\n✓ Authentication successful!")
            print(f"  Access token: {client.access_token[:50]}..." if client.access_token else "  Access token: None")
            print(f"  Refresh token: {client.refresh_token[:50]}..." if client.refresh_token else "  Refresh token: None")
            
            # Test authenticated endpoints
            print(f"\n[Testing Authenticated Endpoints]")
            
            # Get agent wallet
            try:
                agent_wallet = client.get_agent_wallet()
                print(f"✓ Agent wallet retrieved:")
                print(f"  Address: {agent_wallet.get('address', 'N/A')}")
                print(f"  Status: {agent_wallet.get('status', 'N/A')}")
            except Exception as e:
                print(f"⚠ Agent wallet check failed: {e}")
            
            # Get builder code info
            builder_info = client.get_builder_code()
            print(f"\n✓ Builder code info:")
            print(f"  Address: {builder_info['builder_address']}")
            print(f"  Note: {builder_info['note']}")
            
            # Test token refresh
            print(f"\n[Testing Token Refresh]")
            try:
                refresh_response = client.refresh_access_token()
                print(f"✓ Token refresh successful")
                print(f"  New access token: {client.access_token[:50]}..." if client.access_token else "  New access token: None")
            except Exception as e:
                print(f"⚠ Token refresh failed: {e}")
            
            # Logout
            print(f"\n[Logout]")
            try:
                logout_response = client.logout()
                print(f"✓ Logout successful")
            except Exception as e:
                print(f"⚠ Logout failed: {e}")
            
            return True
            
        except requests.exceptions.HTTPError as e:
            error_msg = str(e)
            if e.response is not None:
                try:
                    error_data = e.response.json()
                    error_msg = error_data.get('message', error_msg)
                    # Print full error details for debugging
                    if error_data:
                        print(f"   Full error response: {json.dumps(error_data, indent=2)}")
                except:
                    error_msg = e.response.text or error_msg
                    print(f"   Raw response: {error_msg}")
            
            print(f"❌ Authentication failed: {error_msg}")
            if e.response:
                print(f"   HTTP Status: {e.response.status_code}")
            return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Main test function."""
    print("="*60)
    print("Pear Protocol API Client ID Testing")
    print("="*60)
    
    # Test client IDs
    client_ids_to_test = [
        "APITRADER",  # For individual traders
        # Add other client IDs here if you have them
    ]
    
    # Get wallet private key from environment
    wallet_private_key = os.getenv("WALLET_PRIVATE_KEY")
    
    if not wallet_private_key:
        print("\n⚠ Warning: WALLET_PRIVATE_KEY environment variable not set")
        print("   You can set it with: export WALLET_PRIVATE_KEY=your_private_key")
        print("\n   For testing, you can also use a test wallet private key")
        print("   Note: Make sure the wallet has funds and is set up for Hyperliquid\n")
    
    results = {}
    for client_id in client_ids_to_test:
        success = test_client_id(client_id, wallet_private_key)
        results[client_id] = success
    
    # Summary
    print(f"\n{'='*60}")
    print("Test Summary")
    print(f"{'='*60}")
    for client_id, success in results.items():
        status = "✓ PASS" if success else "❌ FAIL"
        print(f"  {client_id}: {status}")


if __name__ == "__main__":
    import requests  # Import here to avoid issues if not installed
    main()

