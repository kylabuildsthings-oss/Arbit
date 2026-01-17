"""
Example usage of Pear Protocol API Client
Demonstrates basic authentication and API usage.
"""

import os
from pear_client import PearProtocolClient


def example_authentication():
    """Example: Authenticate with Pear Protocol API."""
    print("Example: Authentication Flow\n")
    
    # Get wallet private key from environment
    wallet_private_key = os.getenv("WALLET_PRIVATE_KEY")
    if not wallet_private_key:
        print("Error: Please set WALLET_PRIVATE_KEY environment variable")
        return
    
    # Initialize client
    client = PearProtocolClient(wallet_private_key=wallet_private_key)
    print(f"Initialized client with wallet: {client.wallet_address}\n")
    
    # Login with APITRADER client ID
    print("Logging in with client ID: APITRADER")
    try:
        auth_response = client.login("APITRADER")
        print("✓ Authentication successful\n")
        
        # Example: Get agent wallet
        print("Fetching agent wallet information...")
        agent_wallet = client.get_agent_wallet()
        print(f"Agent Wallet Status: {agent_wallet.get('status', 'N/A')}")
        print(f"Agent Wallet Address: {agent_wallet.get('address', 'N/A')}\n")
        
        # Example: Get builder code info
        builder_info = client.get_builder_code()
        print(f"Builder Address: {builder_info['builder_address']}\n")
        
        # Logout
        print("Logging out...")
        client.logout()
        print("✓ Logged out successfully")
        
    except Exception as e:
        print(f"Error: {e}")


def example_multiple_client_ids():
    """Example: Test multiple client IDs."""
    print("\nExample: Testing Multiple Client IDs\n")
    
    wallet_private_key = os.getenv("WALLET_PRIVATE_KEY")
    if not wallet_private_key:
        print("Error: Please set WALLET_PRIVATE_KEY environment variable")
        return
    
    client_ids = ["APITRADER"]  # Add more client IDs here if you have them
    
    for client_id in client_ids:
        print(f"Testing client ID: {client_id}")
        client = PearProtocolClient(wallet_private_key=wallet_private_key)
        
        try:
            client.login(client_id)
            print(f"✓ {client_id}: Authentication successful")
            client.logout()
        except Exception as e:
            print(f"✗ {client_id}: Authentication failed - {e}")


if __name__ == "__main__":
    example_authentication()
    # Uncomment to test multiple client IDs:
    # example_multiple_client_ids()

