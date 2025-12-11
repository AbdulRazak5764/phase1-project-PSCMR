# ML Neural Network Checker - API Integration Guide

## Overview

The ML Neural Network Checker frontend is designed to work with a FastAPI backend. The API route handlers in this project act as proxies between the frontend and your backend server.

## Environment Setup

### Required Environment Variables

Add these to your `.env.local` or Vercel environment variables:

\`\`\`env
FASTAPI_BACKEND_URL=http://localhost:8000
# For production, use your deployed backend URL:
# FASTAPI_BACKEND_URL=https://ml-backend.example.com
\`\`\`

## API Endpoints

### 1. Training Endpoint
**Route:** `POST /api/train`

Trains multiple models on uploaded data.

**Frontend to Next.js:**
\`\`\`javascript
formData.append('file', file)
formData.append('preprocessing', JSON.stringify(preprocessing))
formData.append('models', JSON.stringify(models))
formData.append('targetColumn', targetColumn)
formData.append('excludedColumns', JSON.stringify(excludedColumns))

fetch('/api/train', { method: 'POST', body: formData })
\`\`\`

**Next.js to FastAPI:**
\`\`\`
POST /api/train
Content-Type: multipart/form-data

file: CSV/JSON file
preprocessing: { handleMissing, scaling, encoding, trainTestSplit }
models: ["linear_regression", "random_forest", ...]
target_column: "column_name"
excluded_columns: ["col1", "col2", ...]
\`\`\`

**Expected Response:**
\`\`\`json
{
  "timestamp": "2025-01-19T10:30:00Z",
  "models": [
    {
      "id": "linear_regression",
      "name": "Linear Regression",
      "accuracy": 0.85,
      "precision": 0.88,
      "recall": 0.82,
      "f1Score": 0.85,
      "trainingTime": 2500,
      "parameters": {
        "learningRate": "0.01",
        "epochs": 100,
        "batchSize": 32
      }
    }
  ]
}
\`\`\`

### 2. Preprocessing Endpoint
**Route:** `POST /api/preprocess`

Preprocesses data and returns statistics.

**Expected Response:**
\`\`\`json
{
  "rowCount": 1000,
  "columnCount": 10,
  "missingValues": { "col1": 5, "col2": 0 },
  "dataTypes": { "col1": "int", "col2": "str" },
  "statistics": {
    "mean": {...},
    "median": {...},
    "std": {...}
  }
}
\`\`\`

### 3. Models Endpoint
**Route:** `GET /api/models`

Returns available models and their capabilities.

**Expected Response:**
\`\`\`json
{
  "phase1": [
    {
      "id": "linear_regression",
      "name": "Linear Regression",
      "type": "Regression",
      "description": "Basic linear model..."
    }
  ],
  "phase2": [...],
  "phase3": [...]
}
\`\`\`

### 4. Health Check Endpoint
**Route:** `GET /api/health`

Verifies backend connectivity.

**Expected Response:**
\`\`\`json
{
  "status": "healthy",
  "backend": "connected",
  "timestamp": "2025-01-19T10:30:00Z"
}
\`\`\`

## Backend Integration Steps

1. **Deploy FastAPI Backend**
   - Set up a FastAPI server with the endpoints defined above
   - Ensure it handles CSV/JSON file uploads
   - Implement model training logic

2. **Update Environment Variables**
   - Set `FASTAPI_BACKEND_URL` to your backend URL

3. **Test Connectivity**
   - The frontend will attempt to call `/api/health` to verify connection
   - Check browser console for any CORS issues

## Using the API Client

\`\`\`typescript
import { apiClient } from '@/lib/api-client'

// Train models
const results = await apiClient.train({
  file: csvFile,
  preprocessing: { ... },
  models: ['linear_regression', 'random_forest'],
  targetColumn: 'target',
  excludedColumns: ['id']
})

// Check health
const health = await apiClient.checkHealth()
\`\`\`

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad request (missing file, invalid parameters)
- `500` - Server error
- `503` - Backend unavailable

## Development vs Production

**Development:**
\`\`\`env
FASTAPI_BACKEND_URL=http://localhost:8000
\`\`\`

**Production (Vercel):**
\`\`\`env
FASTAPI_BACKEND_URL=https://your-backend-domain.com
\`\`\`

## CORS Configuration

Your FastAPI backend should allow requests from your frontend domain:

\`\`\`python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
\`\`\`

## Troubleshooting

**Backend not responding:**
- Check if `FASTAPI_BACKEND_URL` is correctly set
- Verify backend is running and accessible
- Check browser console for CORS errors

**File upload fails:**
- Ensure file size is within backend limits
- Check file format (CSV/JSON/Excel)
- Verify preprocessing parameters are valid

**Training takes too long:**
- Check backend logs for errors
- Consider implementing request timeouts
- Test with smaller datasets first
