/**
 * Direct API Test Script
 * Tests if hackathon ClientIDs can execute trades without EIP-712 authentication
 * 
 * Run with: npx tsx scripts/test-trade-verification.ts
 */

import { config } from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local')
config({ path: envPath })

const API_BASE_URL = 'https://hl-v2.pearprotocol.io'
const CLIENT_ID = process.env.PEAR_CLIENT_ID || 'HLHackathon1'

async function testDirectTradeAPI() {
  console.log('='.repeat(80))
  console.log('PEAR PROTOCOL HACKATHON CLIENTID TRADE VERIFICATION TEST')
  console.log('='.repeat(80))
  console.log(`\nAPI Base URL: ${API_BASE_URL}`)
  console.log(`Client ID: ${CLIENT_ID}`)
  console.log(`\n⚠️  Note: This test uses NO authentication (no Bearer token, no EIP-712)`)
  console.log(`   Only the X-Client-Id header is being sent.\n`)

  // Hardcoded basket trade payload
  const tradePayload = {
    executionType: 'MARKET',
    leverage: 1,
    usdValue: '10', // $10 notional
    longAssets: [
      {
        coin: 'SOL',
        weight: 1.0
      }
    ],
    shortAssets: [
      {
        coin: 'ETH',
        weight: 1.0
      }
    ]
  }

  console.log('Trade Payload:')
  console.log(JSON.stringify(tradePayload, null, 2))
  console.log('\n' + '-'.repeat(80))
  console.log('Making POST request to /positions...\n')

  try {
    const response = await fetch(`${API_BASE_URL}/positions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': CLIENT_ID,
        // Intentionally NOT including Authorization header
      },
      body: JSON.stringify(tradePayload),
    })

    // Extract response data
    const status = response.status
    const statusText = response.statusText
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    let responseBody: any
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      responseBody = await response.json()
    } else {
      const text = await response.text()
      try {
        responseBody = JSON.parse(text)
      } catch {
        responseBody = text
      }
    }

    // Log full response
    console.log('='.repeat(80))
    console.log('API RESPONSE')
    console.log('='.repeat(80))
    console.log(`\nStatus: ${status} ${statusText}`)
    console.log('\nResponse Headers:')
    console.log(JSON.stringify(headers, null, 2))
    console.log('\nResponse Body:')
    console.log(JSON.stringify(responseBody, null, 2))
    console.log('\n' + '='.repeat(80))

    // Analyze response
    if (status === 200 || status === 201) {
      console.log('\n✅ SUCCESS: Trade appears to have been accepted!')
      if (responseBody.orderId || responseBody.id || responseBody.order_id) {
        const orderId = responseBody.orderId || responseBody.id || responseBody.order_id
        console.log(`   Order ID: ${orderId}`)
        console.log(`\n   ⚠️  ACTION REQUIRED:`)
        console.log(`   Check your Hyperliquid account (mainnet or testnet) for:`)
        console.log(`   - Long position: SOL`)
        console.log(`   - Short position: ETH`)
        console.log(`   - If positions appear: This is a REAL trading environment`)
        console.log(`   - If no positions: This may be a simulated/test environment`)
      }
    } else if (status >= 400 && status < 500) {
      console.log(`\n❌ CLIENT ERROR (${status}): Request was rejected`)
      if (status === 401 || status === 403) {
        console.log(`   → This suggests authentication IS required`)
        console.log(`   → Hackathon ClientID alone is not sufficient`)
        console.log(`   → EIP-712 authentication flow is likely necessary`)
      } else if (status === 400) {
        console.log(`   → Request format may be incorrect`)
        console.log(`   → Or missing required fields`)
      }
      console.log(`\n   Error details:`, responseBody)
    } else if (status >= 500) {
      console.log(`\n❌ SERVER ERROR (${status}): Pear Protocol server issue`)
      console.log(`   → May be temporary, or endpoint may not be available`)
    }

    return { status, statusText, headers, body: responseBody }
  } catch (error) {
    console.error('\n❌ NETWORK ERROR:')
    console.error(error)
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`)
      console.error(`   Stack: ${error.stack}`)
    }
    throw error
  }
}

// Run the test
testDirectTradeAPI()
  .then(() => {
    console.log('\n' + '='.repeat(80))
    console.log('Test completed.')
    console.log('='.repeat(80))
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed with error:', error)
    process.exit(1)
  })

