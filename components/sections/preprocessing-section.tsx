'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface PreprocessingSectionProps {
  dataPreview: any
  onProceed: () => void
  setCurrentStep: (step: string) => void
}

export default function PreprocessingSection({ dataPreview, onProceed, setCurrentStep }: PreprocessingSectionProps) {
  const [selectedTarget, setSelectedTarget] = useState<string>('')
  const [excludedColumns, setExcludedColumns] = useState<Set<string>>(new Set())
  const [preprocessing, setPreprocessing] = useState({
    handleMissing: 'mean',
    scaling: 'standardize',
    encoding: 'onehot',
    trainTestSplit: 80,
  })

  const handleExcludeColumn = (column: string) => {
    const updated = new Set(excludedColumns)
    if (updated.has(column)) {
      updated.delete(column)
    } else {
      updated.add(column)
    }
    setExcludedColumns(updated)
  }

  const canProceed = selectedTarget && !excludedColumns.has(selectedTarget)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Preprocessing & Configuration</h2>
        <p className="text-muted-foreground">Configure how your data will be processed</p>
      </div>

      {!dataPreview && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please upload data first</AlertDescription>
        </Alert>
      )}

      {dataPreview && (
        <div className="space-y-6">
          {/* Target Variable Selection */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Target Variable</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Select the column you want to predict
            </p>
            <div className="grid gap-2">
              {dataPreview.headers.map((header: string) => (
                <label key={header} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 cursor-pointer hover:bg-muted/20 transition-all duration-300">
                  <input
                    type="radio"
                    name="target"
                    value={header}
                    checked={selectedTarget === header}
                    onChange={(e) => setSelectedTarget(e.target.value)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">{header}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Column Selection */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Feature Columns</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Uncheck columns to exclude them from training
            </p>
            <div className="grid gap-2">
              {dataPreview.headers.map((header: string) => (
                <label key={header} className="flex items-center gap-3 rounded-lg border border-border/50 p-3 cursor-pointer hover:bg-muted/20 transition-all duration-300">
                  <input
                    type="checkbox"
                    checked={!excludedColumns.has(header)}
                    onChange={() => handleExcludeColumn(header)}
                    disabled={selectedTarget === header}
                    className="h-4 w-4"
                  />
                  <span className={`text-sm font-medium ${selectedTarget === header ? 'text-muted-foreground' : ''}`}>
                    {header}
                  </span>
                  {selectedTarget === header && (
                    <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Target
                    </span>
                  )}
                </label>
              ))}
            </div>
          </Card>

          {/* Preprocessing Options */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Preprocessing Options</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Handle Missing Values</label>
                <select
                  value={preprocessing.handleMissing}
                  onChange={(e) =>
                    setPreprocessing({ ...preprocessing, handleMissing: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm"
                >
                  <option value="mean">Fill with Mean</option>
                  <option value="median">Fill with Median</option>
                  <option value="drop">Drop Rows</option>
                  <option value="forward">Forward Fill</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Feature Scaling</label>
                <select
                  value={preprocessing.scaling}
                  onChange={(e) =>
                    setPreprocessing({ ...preprocessing, scaling: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm"
                >
                  <option value="standardize">Standardization (Z-score)</option>
                  <option value="normalize">Normalization (0-1)</option>
                  <option value="robust">Robust Scaling</option>
                  <option value="none">No Scaling</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Encoding Categorical</label>
                <select
                  value={preprocessing.encoding}
                  onChange={(e) =>
                    setPreprocessing({ ...preprocessing, encoding: e.target.value })
                  }
                  className="mt-2 w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm"
                >
                  <option value="onehot">One-Hot Encoding</option>
                  <option value="label">Label Encoding</option>
                  <option value="target">Target Encoding</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Train/Test Split</label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={preprocessing.trainTestSplit}
                    onChange={(e) =>
                      setPreprocessing({
                        ...preprocessing,
                        trainTestSplit: Number(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <span className="font-semibold text-primary w-16">
                    {preprocessing.trainTestSplit}% / {100 - preprocessing.trainTestSplit}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card className="border-primary/20 bg-primary/5 p-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Configuration Ready</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Using {dataPreview.columnCount - excludedColumns.size} features, target: <span className="text-primary font-medium">{selectedTarget || 'not selected'}</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                onProceed()
                // Auto-advance to model selection after a short delay
                setTimeout(() => setCurrentStep('models'), 1000)
              }}
              disabled={!canProceed}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue to Model Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
