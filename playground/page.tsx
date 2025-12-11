'use client'

import { useState } from 'react'
import { Brain } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DataUploadSection from '@/components/sections/data-upload-section'
import PreprocessingSection from '@/components/sections/preprocessing-section'
import ModelSelectionSection from '@/components/sections/model-selection-section'
import TrainingSection from '@/components/sections/training-section'
import ResultsSection from '@/components/sections/results-section'

export default function PlaygroundPage() {
  const [currentStep, setCurrentStep] = useState('upload')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [dataPreview, setDataPreview] = useState<any>(null)
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [trainingInProgress, setTrainingInProgress] = useState(false)
  const [results, setResults] = useState<any>(null)

  const steps = [
    { id: 'upload', label: 'Upload Data', icon: '📊', color: 'from-blue-500 to-cyan-500' },
    { id: 'preprocess', label: 'Preprocess', icon: '⚙️', color: 'from-cyan-500 to-teal-500' },
    { id: 'models', label: 'Select Models', icon: '🧠', color: 'from-teal-500 to-emerald-500' },
    { id: 'train', label: 'Train', icon: '⚡', color: 'from-emerald-500 to-green-500' },
    { id: 'results', label: 'Results', icon: '📈', color: 'from-green-500 to-lime-500' },
  ]

  const canProceed = {
    upload: uploadedFile !== null,
    preprocess: uploadedFile !== null,
    models: uploadedFile !== null && selectedModels.length > 0,
    train: selectedModels.length > 0,
    results: results !== null,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur-md sticky top-0 z-40 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition group">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent group-hover:shadow-lg transition">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg gradient-text">Neural Checker</div>
                <div className="text-xs text-muted-foreground">ML Training Suite</div>
              </div>
            </Link>
          </div>
          <div className="text-sm font-semibold text-primary">Playground</div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-primary/10 bg-gradient-to-r from-background to-primary/3 px-4 py-8 sm:px-6 lg:px-8 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-3 md:gap-0">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index
              
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${step.color} text-white font-bold shadow-lg`
                        : isCompleted
                        ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <span className="text-xl">{step.icon}</span>
                    <span className="text-xs whitespace-nowrap font-medium">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`mx-2 h-1 w-6 md:w-12 rounded-full transition-all duration-300 ${
                      isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-border/30'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <TabsContent value="upload" className="space-y-6 animate-in fade-in duration-300">
            <DataUploadSection
              onFileSelect={(file, preview) => {
                console.log("[v0] File uploaded:", file.name, "Preview:", preview)
                setUploadedFile(file)
                setDataPreview(preview)
                // Auto-advance to preprocessing after upload
                setTimeout(() => setCurrentStep('preprocess'), 1500)
              }}
            />
          </TabsContent>

          <TabsContent value="preprocess" className="space-y-6 animate-in fade-in duration-300">
            <PreprocessingSection
              dataPreview={dataPreview}
              onProceed={() => {
                console.log("[v0] Moving to model selection")
                setCurrentStep('models')
              }}
              setCurrentStep={setCurrentStep}
            />
          </TabsContent>

          <TabsContent value="models" className="space-y-6 animate-in fade-in duration-300">
            <ModelSelectionSection
              selectedModels={selectedModels}
              onSelectionChange={(models) => {
                console.log("[v0] Models selected:", models)
                setSelectedModels(models)
              }}
              onProceed={() => {
                console.log("[v0] Moving to training")
                setCurrentStep('train')
              }}
              setCurrentStep={setCurrentStep}
            />
          </TabsContent>

          <TabsContent value="train" className="space-y-6 animate-in fade-in duration-300">
            <TrainingSection
              models={selectedModels}
              isTraining={trainingInProgress}
              onTrainingComplete={(results) => {
                console.log("[v0] Training complete:", results)
                setResults(results)
                setTrainingInProgress(false)
                setCurrentStep('results')
              }}
              onStartTraining={() => {
                console.log("[v0] Starting training with models:", selectedModels)
                setTrainingInProgress(true)
              }}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-6 animate-in fade-in duration-300">
            <ResultsSection results={results} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
