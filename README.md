# Pear Characters - Trade Narratives, Not Just Tokens

A Next.js 14 hackathon project integrating with Pear Protocol API for narrative-based trading.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── execute-trade/
│   │   │   └── route.ts          # Trade execution API endpoint
│   │   └── health/
│   │       └── route.ts          # Health check endpoint
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Homepage
├── lib/
│   ├── characters.ts             # Character definitions and trading baskets
│   └── pearClient.ts             # Pear Protocol API client
├── .env.local.example            # Environment variables template
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your actual Pear Protocol credentials.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

5. **Test the health endpoint:**
   Visit [http://localhost:3000/api/health](http://localhost:3000/api/health)

## Environment Variables

Create a `.env.local` file with:

```
PEAR_CLIENT_ID=HLHackathon1
PEAR_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_PEAR_API_URL=https://api.pearprotocol.io
```

## Next Steps

The project is scaffolded and ready for implementing:
- Pear Protocol API authentication
- Trade execution logic
- Character-based trading strategies
- UI components for character selection and trade management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **UI Components**: Radix UI

