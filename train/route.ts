import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route Handler for Model Training
 * 
 * This is a template that demonstrates how to integrate with your FastAPI backend.
 * Replace the FASTAPI_URL with your actual backend deployment URL.
 * 
 * Expected POST payload:
 * {
 *   file: File (FormData),
 *   preprocessing: { handleMissing, scaling, encoding, trainTestSplit },
 *   models: string[],
 *   targetColumn: string,
 *   excludedColumns: string[]
 * }
 */

const FASTAPI_URL = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const preprocessing = JSON.parse(formData.get('preprocessing') as string)
    const models = JSON.parse(formData.get('models') as string)
    const targetColumn = formData.get('targetColumn') as string
    const excludedColumns = JSON.parse(formData.get('excludedColumns') as string)

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Forward to FastAPI backend
    const backendFormData = new FormData()
    backendFormData.append('file', file)
    backendFormData.append('preprocessing', JSON.stringify(preprocessing))
    backendFormData.append('models', JSON.stringify(models))
    backendFormData.append('target_column', targetColumn)
    backendFormData.append('excluded_columns', JSON.stringify(excludedColumns))

    const response = await fetch(`${FASTAPI_URL}/api/train`, {
      method: 'POST',
      body: backendFormData,
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const results = await response.json()
    return NextResponse.json(results)
  } catch (error) {
    console.error('Training error:', error)
    return NextResponse.json(
      { error: 'Training failed', details: String(error) },
      { status: 500 }
    )
  }
}
