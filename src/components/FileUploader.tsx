import React, { useState, useRef } from 'react'
import { Upload, X, FileText } from 'lucide-react'

interface FileUploaderProps {
  onFileUpload: (content: string, fileName: string) => void
}

const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0])
    }
  }

  const processFile = (file: File) => {
    setError(null)
    
    // Check file type
    const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF, TXT, or DOCX file')
      return
    }
    
    // For simplicity, we'll just read text files
    // In a real app, you'd need specific parsers for PDF and DOCX
    const reader = new FileReader()
    
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        onFileUpload(e.target.result, file.name)
      }
    }
    
    reader.onerror = () => {
      setError('Error reading file')
    }
    
    reader.readAsText(file)
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept=".txt,.pdf,.docx"
        />
        
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF, TXT, or DOCX (max 5MB)</p>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600 flex items-center">
          <X size={14} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}

export default FileUploader
