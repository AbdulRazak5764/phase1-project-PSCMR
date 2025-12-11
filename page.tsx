'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Brain, Upload, BarChart3, Zap, Settings, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const [activePhase, setActivePhase] = useState(1)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">Neural Checker</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</Link>
            <Link href="#phases" className="text-sm text-muted-foreground hover:text-foreground transition">Phases</Link>
            <Link href="#models" className="text-sm text-muted-foreground hover:text-foreground transition">Models</Link>
          </nav>
          <Link href="/playground">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-background to-muted/20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Production-Ready ML Platform
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-balance">
              Train, Evaluate & Compare ML Models at Scale
            </h1>
            
            <p className="text-xl text-muted-foreground text-balance">
              Upload your data, select from 37+ classical ML models or 7+ deep learning networks, train with auto-ML optimization, and get comprehensive performance analytics—all in one platform.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/playground">
                <Button className="h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Training <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" className="h-12">View Documentation</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-b border-border/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Powerful Features</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Upload,
                title: 'Multi-Format Upload',
                description: 'Support for CSV, Excel, JSON, and image datasets with automatic preprocessing'
              },
              {
                icon: Brain,
                title: '44+ Models',
                description: '37 classical ML + 7 deep learning models. From linear regression to transformers'
              },
              {
                icon: Zap,
                title: 'Auto-ML Optimization',
                description: 'Hyperparameter tuning, feature selection, and automated model optimization'
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'ROC curves, confusion matrices, precision-recall, feature importance and more'
              },
              {
                icon: Settings,
                title: 'Fine-Grained Control',
                description: 'Configure every aspect: preprocessing, training, validation, and testing'
              },
              {
                icon: ArrowRight,
                title: 'Export & Deploy',
                description: 'Export trained models, predictions, and detailed reports in multiple formats'
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-lg border border-border/50 bg-card p-6 hover:border-border transition">
                <feature.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases Section */}
      <section id="phases" className="border-b border-border/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Three Powerful Phases</h2>
          
          <div className="space-y-6">
            {[
              {
                phase: 1,
                title: 'Phase 1: Core Pipeline',
                subtitle: 'Essential ML for everyone',
                features: [
                  'Data upload and preprocessing',
                  'Basic statistical models (Linear, Logistic Regression)',
                  'Tree-based models (Decision Trees, Random Forest)',
                  'Model comparison and evaluation',
                  'Basic performance metrics'
                ]
              },
              {
                phase: 2,
                title: 'Phase 2: Expanded Suite',
                subtitle: 'Professional ML toolkit',
                features: [
                  'All Phase 1 models plus:',
                  'SVM, KNN, Naive Bayes',
                  'Gradient Boosting (XGBoost, LightGBM)',
                  'Ensemble methods',
                  'Advanced preprocessing pipelines',
                  'Cross-validation strategies'
                ]
              },
              {
                phase: 3,
                title: 'Phase 3: Advanced Features',
                subtitle: 'Enterprise-grade capabilities',
                features: [
                  'All Phase 2 models plus:',
                  'Deep Learning networks (CNN, RNN, LSTM)',
                  'Transfer learning support',
                  'Auto-ML and hyperparameter optimization',
                  'Feature engineering tools',
                  'Model deployment and API generation'
                ]
              }
            ].map((item) => (
              <div
                key={item.phase}
                onClick={() => setActivePhase(item.phase)}
                className={`cursor-pointer rounded-lg border-2 p-6 transition ${
                  activePhase === item.phase
                    ? 'border-primary bg-primary/5'
                    : 'border-border/50 hover:border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-1 inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                      Phase {item.phase}
                    </div>
                    <h3 className="mb-1 text-xl font-bold">{item.title}</h3>
                    <p className="mb-4 text-muted-foreground">{item.subtitle}</p>
                    
                    <ul className="space-y-2">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="text-4xl font-bold text-primary/20">{item.phase}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Train Your Models?</h2>
          <p className="mb-8 text-muted-foreground">
            Start with Phase 1 basics or jump into advanced features. Upload your data and begin training immediately.
          </p>
          <Link href="/playground">
            <Button className="h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Launch Playground <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-semibold">Neural Checker</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Production ML platform for data scientists and engineers
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">Docs</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">GitHub</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
