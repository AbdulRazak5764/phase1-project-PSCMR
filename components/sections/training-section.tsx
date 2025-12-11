'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Zap, CheckCircle } from 'lucide-react'

interface TrainingSectionProps {
  models: string[]
  isTraining: boolean
  onTrainingComplete: (results: any) => void
  onStartTraining: () => void
}

const MODEL_NAMES: Record<string, string> = {
  linear_regression: 'Linear Regression',
  logistic_regression: 'Logistic Regression',
  decision_tree: 'Decision Tree',
  random_forest: 'Random Forest',
  naive_bayes: 'Naive Bayes',
  knn: 'K-Nearest Neighbors',
  svm: 'Support Vector Machine',
  gradient_boosting: 'Gradient Boosting',
  xgboost: 'XGBoost',
  lightgbm: 'LightGBM',
  ridge_regression: 'Ridge Regression',
  lasso_regression: 'Lasso Regression',
  neural_network: 'Neural Network',
  cnn: 'CNN',
  rnn: 'RNN',
  lstm: 'LSTM',
  transformer: 'Transformer',
  automl: 'Auto-ML',
}

export default function TrainingSection({
  models,
  isTraining,
  onTrainingComplete,
  onStartTraining,
}: TrainingSectionProps) {
  const [trainingProgress, setTrainingProgress] = useState<Record<string, number>>({})
  const [trainingStatus, setTrainingStatus] = useState<Record<string, string>>({})
  const [trainingResults, setTrainingResults] = useState<any>(null)

  useEffect(() => {
    if (!isTraining) return

    // Initialize progress
    const progress: Record<string, number> = {}
    const status: Record<string, string> = {}
    models.forEach(m => {
      progress[m] = 0
      status[m] = 'queued'
    })
    setTrainingProgress(progress)
    setTrainingStatus(status)

    // Simulate training for each model
    let modelIndex = 0
    const interval = setInterval(() => {
      if (modelIndex >= models.length) {
        clearInterval(interval)
        
        // Generate consistent mock results using seeded random
        const seed = models.join('').length + (new Date().getTime() % 1000)
        const seededRandom = (seed: number) => {
          const x = Math.sin(seed) * 10000
          return x - Math.floor(x)
        }

        const results = {
          timestamp: new Date().toISOString(),
          models: models.map((modelId, index) => {
            const baseSeed = seed + index * 100
            return {
              id: modelId,
              name: MODEL_NAMES[modelId],
              accuracy: Math.round((seededRandom(baseSeed) * 0.4 + 0.6) * 10000) / 10000,
              precision: Math.round((seededRandom(baseSeed + 1) * 0.4 + 0.6) * 10000) / 10000,
              recall: Math.round((seededRandom(baseSeed + 2) * 0.4 + 0.6) * 10000) / 10000,
              f1Score: Math.round((seededRandom(baseSeed + 3) * 0.4 + 0.6) * 10000) / 10000,
              trainingTime: Math.floor(seededRandom(baseSeed + 4) * 5000) + 1000,
              parameters: {
                learningRate: (seededRandom(baseSeed + 5) * 0.01).toFixed(4),
                epochs: Math.floor(seededRandom(baseSeed + 6) * 100) + 50,
                batchSize: [32, 64, 128][Math.floor(seededRandom(baseSeed + 7) * 3)],
              }
            }
          })
        }
        
        setTrainingResults(results)
        onTrainingComplete(results)
        return
      }

      const currentModel = models[modelIndex]
      
      // Simulate progress for current model
      const progressInterval = setInterval(() => {
        setTrainingProgress(prev => {
          const newProgress = { ...prev }
          if (newProgress[currentModel] < 100) {
            newProgress[currentModel] += Math.random() * 30
            if (newProgress[currentModel] > 100) newProgress[currentModel] = 100
          } else {
            clearInterval(progressInterval)
            setTrainingStatus(prev => ({
              ...prev,
              [currentModel]: 'completed'
            }))
            modelIndex++
          }
          return newProgress
        })
      }, 300)

      setTrainingStatus(prev => ({
        ...prev,
        [currentModel]: 'training'
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [isTraining, models, onTrainingComplete])

  if (!isTraining && !trainingResults) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Ready to Train</h2>
          <p className="text-muted-foreground">
            {models.length} model{models.length !== 1 ? 's' : ''} selected for training
          </p>
        </div>

        <Card className="p-6 border-border/50">
          <div className="space-y-4">
            <h3 className="font-semibold">Models to Train:</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {models.map(modelId => (
                <div key={modelId} className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-primary/60"></span>
                  {MODEL_NAMES[modelId]}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            Training will use your preprocessed data with the configured scaling and encoding methods
          </AlertDescription>
        </Alert>

        <Button
          onClick={() => {
            onStartTraining()
            // Auto-advance to results after training completes
            // This will be handled in onTrainingComplete
          }}
          className="h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto"
        >
          <Zap className="h-4 w-4" />
          Start Training
        </Button>
      </div>
    )
  }

  if (isTraining) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Training in Progress</h2>
          <p className="text-muted-foreground">Models are being trained on your data...</p>
        </div>

        <div className="space-y-4">
          {models.map(modelId => (
            <Card key={modelId} className="p-4 border-border/50">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {trainingStatus[modelId] === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {trainingStatus[modelId] === 'training' && (
                      <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    )}
                    {trainingStatus[modelId] === 'queued' && (
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                    )}
                    <span className="font-medium">{MODEL_NAMES[modelId]}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(trainingProgress[modelId] || 0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                    style={{ width: `${trainingProgress[modelId] || 0}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 border-primary/20 bg-primary/5">
          <p className="text-sm">
            Estimated time: {Math.ceil(models.length * 1.5)} minutes
          </p>
        </Card>
      </div>
    )
  }

  return null
}
