/**
 * API Client for ML Neural Network Checker
 * 
 * Provides typed methods for communicating with the backend API.
 * Replace FASTAPI_URL with your actual backend deployment URL in environment variables.
 */

const API_BASE = '/api'

interface TrainingRequest {
  file: File
  preprocessing: {
    handleMissing: string
    scaling: string
    encoding: string
    trainTestSplit: number
  }
  models: string[]
  targetColumn: string
  excludedColumns: string[]
}

interface PreprocessingRequest {
  file: File
  preprocessing: {
    handleMissing: string
    scaling: string
    encoding: string
    trainTestSplit: number
  }
}

export const apiClient = {
  /**
   * Train multiple models on uploaded data
   */
  async train(request: TrainingRequest) {
    const formData = new FormData()
    formData.append('file', request.file)
    formData.append('preprocessing', JSON.stringify(request.preprocessing))
    formData.append('models', JSON.stringify(request.models))
    formData.append('targetColumn', request.targetColumn)
    formData.append('excludedColumns', JSON.stringify(request.excludedColumns))

    const response = await fetch(`${API_BASE}/train`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Training failed: ${response.statusText}`)
    }

    return response.json()
  },

  /**
   * Preprocess data without training
   */
  async preprocess(request: PreprocessingRequest) {
    const formData = new FormData()
    formData.append('file', request.file)
    formData.append('preprocessing', JSON.stringify(request.preprocessing))

    const response = await fetch(`${API_BASE}/preprocess`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Preprocessing failed: ${response.statusText}`)
    }

    return response.json()
  },

  /**
   * Get available models
   */
  async getModels() {
    const response = await fetch(`${API_BASE}/models`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`)
    }

    return response.json()
  },

  /**
   * Check backend health
   */
  async checkHealth() {
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
    })

    return response.json()
  },
}
