import { NextRequest, NextResponse } from 'next/server'

/**
 * Health Check Route Handler
 * 
 * Checks if the FastAPI backend is available and responsive.
 * Used to verify backend connectivity before sending requests.
 */

const FASTAPI_URL = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${FASTAPI_URL}/health`, {
      method: 'GET',
    })

    if (response.ok) {
      return NextResponse.json({
        status: 'healthy',
        backend: 'connected',
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          status: 'unhealthy',
          backend: 'error',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        backend: 'disconnected',
        details: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
