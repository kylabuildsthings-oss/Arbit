#!/bin/bash
# Script to fix frontend "Internal Server Error"

echo "Fixing frontend issues..."
echo ""

echo "1. Clearing Next.js build cache..."
rm -rf .next

echo "2. Checking node_modules..."
if [ ! -d "node_modules" ]; then
  echo "   node_modules missing! Installing dependencies..."
  npm install
else
  echo "   node_modules exists"
fi

echo "3. Checking environment variables..."
if [ ! -f ".env.local" ]; then
  echo "   ⚠️  .env.local file is missing!"
  echo "   Creating template..."
  cat > .env.local.example << EOF
PEAR_CLIENT_ID=APITRADER
PEAR_WALLET_PRIVATE_KEY=0xYourPrivateKeyHere
NEXT_PUBLIC_PEAR_API_URL=https://hl-v2.pearprotocol.io
EOF
  echo "   Please create .env.local with your actual values"
else
  echo "   .env.local exists"
fi

echo ""
echo "4. Rebuilding..."
npm run build 2>&1 | head -20

echo ""
echo "Done! Now try: npm run dev"

