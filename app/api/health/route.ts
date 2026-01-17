import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Pear Characters API'
    },
    { status: 200 }
  )
}

