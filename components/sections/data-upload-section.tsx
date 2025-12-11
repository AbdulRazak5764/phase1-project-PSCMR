'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, File, AlertCircle, CheckCircle, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DataUploadSectionProps {
  onFileSelect: (file: File, preview: any) => void
}

export default function DataUploadSection({ onFileSelect }: DataUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseFile = useCallback(async (selectedFile: File) => {
    setLoading(true)
    setError('')
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000))

      const text = await selectedFile.text()

      if (selectedFile.name.endsWith('.csv')) {
        const lines = text.split('\n').filter(line => line.trim())
        const headers = lines[0].split(',').map(h => h.trim())
        const rows = lines.slice(1, 6).map(line => {
          const values = line.split(',').map(v => v.trim())
          return headers.reduce((obj: any, header, i) => {
            obj[header] = isNaN(Number(values[i])) ? values[i] : Number(values[i])
            return obj
          }, {})
        })

        const preview = {
          type: 'CSV',
          headers,
          rows,
          rowCount: lines.length - 1,
          columnCount: headers.length,
        }

        setPreview(preview)
        setFile(selectedFile)
        onFileSelect(selectedFile, preview)

        // Auto-advance to preprocessing after upload
        setTimeout(() => {
          // This will be handled by the parent component
          console.log("File uploaded, ready for preprocessing")
        }, 1500)
      } else if (selectedFile.name.endsWith('.json')) {
        const data = JSON.parse(text)
        const isArray = Array.isArray(data)
        const rows = isArray ? data.slice(0, 5) : [data]
        const headers = Object.keys(rows[0] || {})

        const preview = {
          type: 'JSON',
          headers,
          rows,
          rowCount: isArray ? data.length : 1,
          columnCount: headers.length,
        }

        setPreview(preview)
        setFile(selectedFile)
        onFileSelect(selectedFile, preview)
      }
    } catch (err) {
      setError('Failed to parse file. Please ensure it\'s valid CSV or JSON.')
      setFile(null)
      setPreview(null)
    } finally {
      setLoading(false)
    }
  }, [onFileSelect])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.json'))) {
      parseFile(droppedFile)
    } else {
      setError('Please upload a CSV or JSON file')
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      parseFile(selectedFile)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Upload Your Data</h2>
        <p className="text-muted-foreground mt-1">Support for CSV, Excel, JSON, and image datasets</p>
      </div>

      <Card
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragging 
            ? 'border-primary bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 scale-[1.02]' 
            : 'border-primary/30 hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/5 hover:via-accent/5 hover:to-secondary/5'
        }`}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className={`rounded-xl p-6 transition ${
              isDragging 
                ? 'bg-gradient-to-br from-primary to-accent scale-110' 
                : 'bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30'
            }`}>
              <Upload className={`h-10 w-10 transition ${isDragging ? 'text-white animate-bounce' : 'text-primary'}`} />
            </div>
          </div>
          <div>
            <p className="font-bold text-lg">Drag and drop your file here</p>
            <p className="text-sm text-muted-foreground mt-1">or</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json,.xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
            disabled={loading}
          />
          <Button
            onClick={handleBrowseClick}
            disabled={loading}
            className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⚡</span>
                Loading...
              </>
            ) : (
              'Browse Files'
            )}
          </Button>
          <p className="text-xs text-muted-foreground">CSV, JSON, XLSX up to 100MB</p>
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File Preview */}
      {file && preview && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-40"></div>
                <CheckCircle className="h-6 w-6 text-green-500 relative" />
              </div>
              <div>
                <p className="font-bold text-green-900 dark:text-green-100">{file.name}</p>
                <p className="text-sm text-green-700 dark:text-green-200">
                  {preview.rowCount.toLocaleString()} rows × {preview.columnCount} columns
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null)
                setPreview(null)
                setError('')
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition text-red-600 dark:text-red-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Data Preview Table */}
          <Card className="overflow-hidden border-primary/10 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20">
                    {preview.headers.map((header: string) => (
                      <th key={header} className="px-4 py-3 text-left font-bold text-primary">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-primary/5 transition">
                      {preview.headers.map((header: string) => (
                        <td key={`${i}-${header}`} className="px-4 py-3">
                          {String(row[header]).substring(0, 50)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5 px-4 py-3 text-xs text-muted-foreground font-medium">
              Showing first 5 rows of {preview.rowCount.toLocaleString()}
            </div>
          </Card>

          {/* Statistics */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Total Rows', value: preview.rowCount.toLocaleString(), icon: '📊' },
              { label: 'Total Columns', value: preview.columnCount, icon: '📋' },
              { label: 'File Type', value: preview.type, icon: '📁' }
            ].map((stat, i) => (
              <Card key={i} className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold mt-2 gradient-text">{stat.value}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
