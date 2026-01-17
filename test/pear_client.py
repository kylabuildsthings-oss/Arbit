"""
Pear Protocol API Client
A Python client for integrating with Pear Protocol's pair trading API on Hyperliquid.
"""

import json
import time
import requests
from typing import Optional, Dict, Any
from eth_account import Account
from eth_account.messages import encode_typed_data
from web3 import Web3


class PearProtocolClient:
    """Client for interacting with Pear Protocol API."""
    
    BASE_URL = "https://hl-v2.pearprotocol.io"
    BUILDER_ADDRESS = "0xA47D4d99191db54A4829cdf3de2417E527c3b042"
    
    def __init__(self, wallet_private_key: Optional[str] = None, wallet_address: Optional[str] = None):
        """
        Initialize the Pear Protocol client.
        
        Args:
            wallet_private_key: Private key of the wallet (hex string with or without 0x prefix)
            wallet_address: Wallet address (will be derived from private key if not provided)
        """
        self.access_token: Optional[str] = None
        self.refresh_token: Optional[str] = None
        self.wallet_address = wallet_address
        self.private_key = wallet_private_key
        
        if wallet_private_key:
            # Ensure private key has 0x prefix
            if not wallet_private_key.startswith('0x'):
                wallet_private_key = '0x' + wallet_private_key
            
            self.account = Account.from_key(wallet_private_key)
            if not self.wallet_address:
                self.wallet_address = self.account.address
        else:
            self.account = None
    
    def _get_headers(self, include_auth: bool = True) -> Dict[str, str]:
        """Get request headers with optional authorization."""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if include_auth and self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        return headers
    
    def get_eip712_message(self, client_id: str) -> Dict[str, Any]:
        """
        Get EIP-712 message to sign for authentication.
        
        Args:
            client_id: Client ID (e.g., 'APITRADER' for individual traders)
        
        Returns:
            Response containing the EIP-712 message to sign
        """
        if not self.wallet_address:
            raise ValueError("Wallet address is required to get EIP-712 message")
        
        url = f"{self.BASE_URL}/auth/eip712-message"
        params = {
            "address": self.wallet_address,
            "clientId": client_id
        }
        
        response = requests.get(url, params=params, headers=self._get_headers(include_auth=False))
        response.raise_for_status()
        return response.json()
    
    def sign_eip712_message(self, eip712_message: Dict[str, Any]) -> str:
        """
        Sign EIP-712 message using wallet private key.
        
        Args:
            eip712_message: The EIP-712 message structure from get_eip712_message
        
        Returns:
            Signature string (hex with 0x prefix)
        """
        if not self.account:
            raise ValueError("Wallet private key is required for signing")
        
        # Try encoding with full_message first (most common approach)
        try:
            encoded_message = encode_typed_data(full_message=eip712_message)
        except (TypeError, KeyError) as e:
            # Fallback: if full_message doesn't work, try explicit parameters
            # Some APIs return the message in a different structure
            if "domain" in eip712_message and "types" in eip712_message and "message" in eip712_message:
                encoded_message = encode_typed_data(
                    domain_data=eip712_message["domain"],
                    message_types=eip712_message["types"],
                    message_data=eip712_message["message"]
                )
            else:
                raise ValueError(f"Cannot encode EIP-712 message: {e}. Message structure: {list(eip712_message.keys())}")
        
        # Sign the encoded message
        signed_message = self.account.sign_message(encoded_message)
        return signed_message.signature.hex()
    
    def authenticate(self, client_id: str, signature: str, eip712_message: Optional[Dict[str, Any]] = None, timestamp: Optional[str] = None) -> Dict[str, Any]:
        """
        Authenticate with Pear Protocol using signed EIP-712 message.
        
        Args:
            client_id: Client ID used for authentication
            signature: The signed EIP-712 message signature
            eip712_message: Optional EIP-712 message (some APIs require this in details)
            timestamp: Optional timestamp from EIP-712 message
        
        Returns:
            Response containing access_token and refresh_token
        """
        if not self.wallet_address:
            raise ValueError("Wallet address is required for authentication")
        
        url = f"{self.BASE_URL}/auth/login"
        
        # Ensure signature has 0x prefix (standard format for EIP-712)
        signature_formatted = signature if signature.startswith('0x') else '0x' + signature
        
        # Use the same address format as used when requesting the EIP-712 message
        payload = {
            "method": "eip712",
            "address": self.wallet_address,
            "clientId": client_id,
            "details": {
                "signature": signature_formatted
            }
        }
        
        # Add timestamp if provided
        if timestamp:
            payload["details"]["timestamp"] = timestamp
        
        # Note: Not including full message in details as most APIs just need signature
        # If this fails, we may need to try including the message
        
        response = requests.post(url, json=payload, headers=self._get_headers(include_auth=False))
        response.raise_for_status()
        data = response.json()
        
        # Store tokens (handle both camelCase and snake_case)
        self.access_token = data.get("access_token") or data.get("accessToken")
        self.refresh_token = data.get("refresh_token") or data.get("refreshToken")
        
        return data
    
    def login(self, client_id: str) -> Dict[str, Any]:
        """
        Complete login flow: get message, sign, and authenticate.
        
        Args:
            client_id: Client ID to use for authentication
        
        Returns:
            Authentication response with tokens
        """
        if not self.account:
            raise ValueError("Wallet private key is required for login")
        
        # Step 1: Get EIP-712 message
        print(f"[1/3] Getting EIP-712 message for client ID: {client_id}")
        eip712_message = self.get_eip712_message(client_id)
        
        # Extract timestamp if present in message
        timestamp = eip712_message.get("message", {}).get("timestamp")
        
        # Step 2: Sign the message
        print(f"[2/3] Signing EIP-712 message...")
        signature = self.sign_eip712_message(eip712_message)
        
        # Step 3: Authenticate
        print(f"[3/3] Authenticating...")
        auth_response = self.authenticate(client_id, signature, eip712_message, timestamp)
        
        print(f"✓ Authentication successful!")
        print(f"  Access token expires in: 15 minutes")
        print(f"  Refresh token expires in: 30 days")
        
        return auth_response
    
    def refresh_access_token(self) -> Dict[str, Any]:
        """
        Refresh the access token using the refresh token.
        
        Returns:
            New authentication response with tokens
        """
        if not self.refresh_token:
            raise ValueError("No refresh token available. Please authenticate first.")
        
        url = f"{self.BASE_URL}/auth/refresh"
        payload = {"refreshToken": self.refresh_token}
        
        response = requests.post(url, json=payload, headers=self._get_headers(include_auth=False))
        response.raise_for_status()
        data = response.json()
        
        # Update tokens (handle both camelCase and snake_case)
        self.access_token = data.get("access_token") or data.get("accessToken")
        self.refresh_token = data.get("refresh_token") or data.get("refreshToken") or self.refresh_token
        
        return data
    
    def logout(self) -> Dict[str, Any]:
        """
        Logout and invalidate refresh token.
        
        Returns:
            Logout response
        """
        if not self.refresh_token:
            print("No refresh token to invalidate")
            return {}
        
        url = f"{self.BASE_URL}/auth/logout"
        payload = {"refreshToken": self.refresh_token}
        
        response = requests.post(url, json=payload, headers=self._get_headers(include_auth=False))
        response.raise_for_status()
        
        # Clear tokens
        self.access_token = None
        self.refresh_token = None
        
        return response.json()
    
    def get_agent_wallet(self) -> Dict[str, Any]:
        """
        Get agent wallet information.
        
        Returns:
            Agent wallet details including address and status
        """
        url = f"{self.BASE_URL}/agentWallet"
        
        response = requests.get(url, headers=self._get_headers())
        response.raise_for_status()
        return response.json()
    
    def create_agent_wallet(self) -> Dict[str, Any]:
        """
        Create a new agent wallet.
        
        Returns:
            New agent wallet details
        """
        url = f"{self.BASE_URL}/agentWallet"
        
        response = requests.post(url, headers=self._get_headers())
        response.raise_for_status()
        return response.json()
    
    def get_builder_code(self) -> Dict[str, str]:
        """
        Get builder code information.
        
        Returns:
            Builder code address
        """
        return {
            "builder_address": self.BUILDER_ADDRESS,
            "note": "All trades are routed to this builder address. Users must approve this address to charge fees."
        }
    
    def test_connection(self) -> bool:
        """
        Test basic API connection (no authentication required).
        
        Returns:
            True if connection successful
        """
        try:
            # Try to get EIP-712 message as a connection test
            # Using a dummy request to check if API is reachable
            response = requests.get(self.BASE_URL, timeout=5)
            return True
        except Exception as e:
            print(f"Connection test failed: {e}")
            return False

