'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Share2, TrendingUp, Trophy, FileText, Rocket } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

interface ModelResult {
  id: string
  name: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  parameters?: Record<string, any>
  trainingTime: number
}

interface TrainingResults {
  models: ModelResult[]
  timestamp: string
}

interface ResultsSectionProps {
  results: TrainingResults | null
}

const COLORS = ['#6366f1', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6']

export default function ResultsSection({ results }: ResultsSectionProps) {
  const [selectedModel, setSelectedModel] = useState(results?.models[0]?.id)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState('')
  const currentModel = results?.models.find((m: ModelResult) => m.id === selectedModel)

  if (!results) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Results</h2>
          <p className="text-muted-foreground">Training results will appear here</p>
        </div>
      </div>
    )
  }

  // Sort models by accuracy for ranking
  const rankedModels = [...results.models].sort((a: ModelResult, b: ModelResult) => b.accuracy - a.accuracy)
  const bestModel = rankedModels[0]

  const handleExportResults = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `ml-training-results-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleShareResults = async () => {
    const shareData = {
      title: 'ML Training Results',
      text: `Check out my ML training results! Best model: ${bestModel.name} with ${(bestModel.accuracy * 100).toFixed(1)}% accuracy.`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        alert('Results link copied to clipboard!')
      }
    } catch (err) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        alert('Results link copied to clipboard!')
      } catch (fallbackErr) {
        alert('Unable to share results. Please copy the URL manually.')
      }
    }
  }

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate and download PDF-like report
    const reportContent = `
ML Training Report
==================

Generated on: ${new Date().toLocaleString()}
Models Trained: ${results.models.length}

Best Performing Model:
- Name: ${bestModel.name}
- Accuracy: ${(bestModel.accuracy * 100).toFixed(2)}%
- Precision: ${(bestModel.precision * 100).toFixed(2)}%
- Recall: ${(bestModel.recall * 100).toFixed(2)}%
- F1 Score: ${(bestModel.f1Score * 100).toFixed(2)}%

All Models Performance:
${results.models.map((m: ModelResult, i: number) =>
  `${i + 1}. ${m.name}: ${(m.accuracy * 100).toFixed(2)}% accuracy`
).join('\n')}

Training Summary:
- Total models: ${results.models.length}
- Training completed: ${new Date(results.timestamp).toLocaleString()}
- Best accuracy: ${(bestModel.accuracy * 100).toFixed(2)}%
    `

    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(reportContent)
    const exportFileDefaultName = `ml-training-report-${new Date().toISOString().split('T')[0]}.txt`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    setReportGenerated(true)
    setIsGeneratingReport(false)
  }

  const handleDeployModel = async () => {
    setIsDeploying(true)
    setDeploymentStatus('Deploying...')
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setDeploymentStatus('Successfully deployed!')

    // Show deployment details
    alert(`Model "${bestModel.name}" has been deployed successfully!\n\nDeployment Details:\n- Model ID: ${bestModel.id}\n- Accuracy: ${(bestModel.accuracy * 100).toFixed(2)}%\n- Endpoint: /api/predict/${bestModel.id}\n- Status: Active`)

    setIsDeploying(false)
  }

  // Prepare comparison data
  const comparisonData = results.models.map((m: any) => ({
    name: m.name.substring(0, 10),
    accuracy: parseFloat((m.accuracy * 100).toFixed(1)),
    precision: parseFloat((m.precision * 100).toFixed(1)),
    recall: parseFloat((m.recall * 100).toFixed(1)),
    f1: parseFloat((m.f1Score * 100).toFixed(1)),
  }))

  // Prepare radar data for selected model
  const radarData = currentModel ? [
    { metric: 'Accuracy', value: parseFloat((currentModel.accuracy * 100).toFixed(1)) },
    { metric: 'Precision', value: parseFloat((currentModel.precision * 100).toFixed(1)) },
    { metric: 'Recall', value: parseFloat((currentModel.recall * 100).toFixed(1)) },
    { metric: 'F1 Score', value: parseFloat((currentModel.f1Score * 100).toFixed(1)) },
  ] : []

  // Prepare distribution data
  const distributionData = [
    { name: 'High Performance (>80%)', value: comparisonData.filter(d => d.accuracy > 80).length },
    { name: 'Medium Performance (60-80%)', value: comparisonData.filter(d => d.accuracy >= 60 && d.accuracy <= 80).length },
    { name: 'Low Performance (<60%)', value: comparisonData.filter(d => d.accuracy < 60).length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Training Results</h2>
          <p className="text-muted-foreground">
            {results.models.length} models trained on {new Date(results.timestamp).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportResults}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleShareResults}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Best Model Award */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Best Performing Model</p>
              <h3 className="text-2xl font-bold text-primary">{bestModel.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Accuracy: {(bestModel.accuracy * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <Badge className="bg-primary text-primary-foreground">
            Top Score
          </Badge>
        </div>
      </Card>

      {/* Model Selection */}
      <Card className="p-6">
        <h3 className="mb-4 font-semibold">Select Model for Details</h3>
        <div className="grid gap-2 md:grid-cols-3">
          {results.models.map((model: ModelResult, index: number) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`p-3 rounded-lg border transition text-left ${
                selectedModel === model.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border/50 hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{model.name}</span>
                <span className="text-xs font-bold text-primary">
                  #{index + 1}
                </span>
              </div>
              <div className="text-2xl font-bold">
                {(model.accuracy * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </button>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="distributions">Distribution</TabsTrigger>
        </TabsList>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Model Accuracy Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="accuracy" fill="#6366f1" name="Accuracy" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-semibold">All Metrics Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="accuracy" fill="#6366f1" />
                <Bar dataKey="precision" fill="#06b6d4" />
                <Bar dataKey="recall" fill="#ec4899" />
                <Bar dataKey="f1" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {currentModel && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">{currentModel.name} - Detailed Metrics</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Accuracy', value: currentModel.accuracy, color: 'bg-blue-500' },
                  { label: 'Precision', value: currentModel.precision, color: 'bg-pink-500' },
                  { label: 'Recall', value: currentModel.recall, color: 'bg-cyan-500' },
                  { label: 'F1 Score', value: currentModel.f1Score, color: 'bg-amber-500' },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{metric.label}</span>
                      <span className="font-bold text-lg">
                        {(metric.value * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${metric.color} transition-all`}
                        style={{ width: `${metric.value * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {currentModel && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Model Parameters</h3>
              <div className="space-y-3">
                {Object.entries(currentModel.parameters || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm font-mono font-bold">{String(value)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Training Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Training Time</span>
                <span className="text-sm font-mono font-bold">
                  {(currentModel.trainingTime / 1000).toFixed(2)}s
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Model Type</span>
                <span className="text-sm font-mono font-bold">{currentModel.name}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Status</span>
                <Badge className="bg-green-500 text-white">Completed</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          {currentModel && (
            <Card className="p-6">
              <h3 className="mb-4 font-semibold">Performance Radar - {currentModel.name}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Performance" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Metric Trends Across Models</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="precision" stroke="#06b6d4" strokeWidth={2} />
                <Line type="monotone" dataKey="recall" stroke="#ec4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distributions" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Model Performance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Model Rankings</h3>
            <div className="space-y-2">
              {rankedModels.map((model: ModelResult, index: number) => (
                <div
                  key={model.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition ${
                    index === 0
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-muted/50 border border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-muted-foreground">#{index + 1}</span>
                    <span className="font-semibold">{model.name}</span>
                  </div>
                  <span className="font-bold text-primary">
                    {(model.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 pt-4 md:flex-row">
        <Button className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleExportResults}>
          <Download className="h-4 w-4" />
          Download Results
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
        >
          {isGeneratingReport ? (
            <>
              <span className="animate-spin mr-2">⚡</span>
              Generating...
            </>
          ) : reportGenerated ? (
            <>
              <FileText className="h-4 w-4" />
              Report Generated
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleDeployModel}
          disabled={isDeploying}
        >
          {isDeploying ? (
            <>
              <span className="animate-spin mr-2">🚀</span>
              {deploymentStatus}
            </>
          ) : deploymentStatus === 'Successfully deployed!' ? (
            <>
              <Rocket className="h-4 w-4" />
              Deployed
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" />
              Deploy Best Model
            </>
          )}
        </Button>
      </div>

      {/* Status Alerts */}
      {reportGenerated && (
        <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
          <FileText className="h-4 w-4" />
          <AlertDescription>
            Report generated successfully! You can now download the comprehensive analysis report.
          </AlertDescription>
        </Alert>
      )}

      {deploymentStatus === 'Successfully deployed!' && (
        <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <Rocket className="h-4 w-4" />
          <AlertDescription>
            Best model deployed successfully! The model is now available for predictions.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
