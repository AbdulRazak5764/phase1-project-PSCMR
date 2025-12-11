import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route Handler for Model Information
 * 
 * Returns available models, their descriptions, and capabilities.
 * Can be used to populate UI dynamically from backend.
 */

const FASTAPI_URL = process.env.FASTAPI_BACKEND_URL || 'http://localhost:8000'

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from FastAPI backend, fallback to mock data
    try {
      const response = await fetch(`${FASTAPI_URL}/api/models`, {
        method: 'GET',
      })

      if (response.ok) {
        const models = await response.json()
        return NextResponse.json(models)
      }
    } catch (err) {
      console.warn('Could not fetch models from backend, using mock data')
    }

    // Mock data fallback
    const mockModels = {
      phase1: [
        { id: 'linear_regression', name: 'Linear Regression', type: 'Regression' },
        { id: 'logistic_regression', name: 'Logistic Regression', type: 'Classification' },
        { id: 'decision_tree', name: 'Decision Tree', type: 'Both' },
        { id: 'random_forest', name: 'Random Forest', type: 'Both' },
        { id: 'naive_bayes', name: 'Naive Bayes', type: 'Classification' },
        { id: 'knn', name: 'K-Nearest Neighbors', type: 'Both' },
      ],
      phase2: [
        { id: 'svm', name: 'Support Vector Machine', type: 'Both' },
        { id: 'gradient_boosting', name: 'Gradient Boosting', type: 'Both' },
        { id: 'xgboost', name: 'XGBoost', type: 'Both' },
        { id: 'lightgbm', name: 'LightGBM', type: 'Both' },
      ],
      phase3: [
        { id: 'neural_network', name: 'Neural Network', type: 'Both' },
        { id: 'cnn', name: 'CNN', type: 'Image' },
        { id: 'rnn', name: 'RNN', type: 'Sequence' },
        { id: 'lstm', name: 'LSTM', type: 'Sequence' },
      ],
    }

    return NextResponse.json(mockModels)
  } catch (error) {
    console.error('Models error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models', details: String(error) },
      { status: 500 }
    )
  }
}
