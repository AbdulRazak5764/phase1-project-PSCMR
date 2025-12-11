'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ModelSelectionSectionProps {
  selectedModels: string[]
  onSelectionChange: (models: string[]) => void
  onProceed: () => void
}

const MODEL_PHASES = {
  phase1: {
    title: 'Phase 1: Core Pipeline',
    subtitle: 'Essential models for beginners',
    models: [
      { id: 'linear_regression', name: 'Linear Regression', type: 'Regression', description: 'Basic linear model for continuous predictions' },
      { id: 'logistic_regression', name: 'Logistic Regression', type: 'Classification', description: 'Linear model for binary and multi-class classification' },
      { id: 'decision_tree', name: 'Decision Tree', type: 'Both', description: 'Tree-based model that splits on feature values' },
      { id: 'random_forest', name: 'Random Forest', type: 'Both', description: 'Ensemble of decision trees for better accuracy' },
      { id: 'naive_bayes', name: 'Naive Bayes', type: 'Classification', description: 'Probabilistic classifier based on Bayes theorem' },
      { id: 'knn', name: 'K-Nearest Neighbors', type: 'Both', description: 'Instance-based learning algorithm' },
    ]
  },
  phase2: {
    title: 'Phase 2: Expanded Suite',
    subtitle: 'Professional-grade models',
    models: [
      { id: 'svm', name: 'Support Vector Machine', type: 'Both', description: 'Powerful classifier using support vectors' },
      { id: 'gradient_boosting', name: 'Gradient Boosting', type: 'Both', description: 'Sequential ensemble method' },
      { id: 'xgboost', name: 'XGBoost', type: 'Both', description: 'Optimized gradient boosting implementation' },
      { id: 'lightgbm', name: 'LightGBM', type: 'Both', description: 'Fast gradient boosting framework' },
      { id: 'ridge_regression', name: 'Ridge Regression', type: 'Regression', description: 'Linear regression with L2 regularization' },
      { id: 'lasso_regression', name: 'Lasso Regression', type: 'Regression', description: 'Linear regression with L1 regularization' },
    ]
  },
  phase3: {
    title: 'Phase 3: Advanced Features',
    subtitle: 'Deep learning and neural networks',
    models: [
      { id: 'neural_network', name: 'Neural Network', type: 'Both', description: 'Multi-layer perceptron network' },
      { id: 'cnn', name: 'Convolutional Neural Network', type: 'Image', description: 'Deep learning for image classification' },
      { id: 'rnn', name: 'Recurrent Neural Network', type: 'Sequence', description: 'For sequential and time-series data' },
      { id: 'lstm', name: 'LSTM Network', type: 'Sequence', description: 'Advanced RNN with memory cells' },
      { id: 'transformer', name: 'Transformer', type: 'NLP', description: 'State-of-the-art for NLP tasks' },
      { id: 'automl', name: 'Auto-ML', type: 'Both', description: 'Automated model selection and hyperparameter tuning' },
    ]
  }
}

export default function ModelSelectionSection({
  selectedModels,
  onSelectionChange,
  onProceed,
  setCurrentStep,
}: ModelSelectionSectionProps & { setCurrentStep: (step: string) => void }) {
  const [expandedPhase, setExpandedPhase] = useState<string>('phase1')

  const toggleModel = (modelId: string) => {
    const updated = selectedModels.includes(modelId)
      ? selectedModels.filter(m => m !== modelId)
      : [...selectedModels, modelId]
    onSelectionChange(updated)
  }

  const togglePhase = (phase: string) => {
    const phaseModels = MODEL_PHASES[phase as keyof typeof MODEL_PHASES].models.map(m => m.id)
    const allSelected = phaseModels.every(m => selectedModels.includes(m))
    
    if (allSelected) {
      onSelectionChange(selectedModels.filter(m => !phaseModels.includes(m)))
    } else {
      const newSelection = new Set(selectedModels)
      phaseModels.forEach(m => newSelection.add(m))
      onSelectionChange(Array.from(newSelection))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Select Models to Train</h2>
        <p className="text-muted-foreground">Choose one or multiple models. Start with Phase 1 basics or expand to advanced options</p>
      </div>

      {Object.entries(MODEL_PHASES).map(([phaseKey, phase]) => {
        const isExpanded = expandedPhase === phaseKey
        const phaseModels = phase.models.map(m => m.id)
        const allSelected = phaseModels.every(m => selectedModels.includes(m))
        const someSelected = phaseModels.some(m => selectedModels.includes(m))

        return (
          <div key={phaseKey} className="space-y-3">
            {/* Phase Header */}
            <button
              onClick={() => setExpandedPhase(isExpanded ? '' : phaseKey)}
              className="w-full"
            >
              <Card className="border-border/50 hover:border-border transition cursor-pointer">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => togglePhase(phaseKey)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-5 w-5 cursor-pointer"
                    />
                    <div className="text-left">
                      <h3 className="font-semibold">{phase.title}</h3>
                      <p className="text-sm text-muted-foreground">{phase.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={someSelected ? "default" : "outline"}>
                      {selectedModels.filter(m => phaseModels.includes(m)).length}/{phase.models.length}
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </Card>
            </button>

            {/* Models Grid */}
            {isExpanded && (
              <div className="grid gap-3 md:grid-cols-2 pl-8">
                {phase.models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => toggleModel(model.id)}
                    className="w-full text-left"
                  >
                    <Card className={`border transition cursor-pointer p-4 ${
                      selectedModels.includes(model.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 hover:border-border'
                    }`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedModels.includes(model.id)}
                          onChange={() => {}}
                          className="h-4 w-4 mt-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{model.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {model.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {model.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Selected Summary */}
      {selectedModels.length > 0 && (
        <Card className="border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium">
            Selected {selectedModels.length} model{selectedModels.length !== 1 ? 's' : ''} for training
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedModels.map((modelId) => {
              const model = Object.values(MODEL_PHASES)
                .flatMap(p => p.models)
                .find(m => m.id === modelId)
              return model ? (
                <Badge key={modelId} variant="default">{model.name}</Badge>
              ) : null
            })}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={onProceed}
          disabled={selectedModels.length === 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Continue to Training ({selectedModels.length} models selected)
        </Button>
      </div>
    </div>
  )
}
