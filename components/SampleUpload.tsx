'use client';

import { useState, useRef } from 'react';
import { Upload, Music, X, Loader2 } from 'lucide-react';
import { SUPPORTED_AUDIO_FORMATS, MAX_FILE_SIZE } from '@/lib/constants';

interface SampleUploadProps {
  onUploadComplete: (file: File) => void;
  onUploadError: (error: string) => void;
}

export function SampleUpload({ onUploadComplete, onUploadError }: SampleUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!SUPPORTED_AUDIO_FORMATS.includes(file.type as any)) {
      return 'Unsupported file format. Please upload MP3, WAV, MP4, AAC, or OGG files.';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size too large. Maximum size is 50MB.';
    }
    
    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      onUploadError(error);
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate file processing and AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      onUploadComplete(selectedFile);
    } catch (error) {
      onUploadError('Failed to process audio file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Upload Audio Sample</h2>
      
      {!selectedFile ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary/50'
            }
          `}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-text-primary mb-2">
            Drop your audio file here
          </p>
          <p className="text-text-secondary mb-4">
            or click to browse files
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary"
          >
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={SUPPORTED_AUDIO_FORMATS.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
          <p className="text-xs text-text-secondary mt-4">
            Supported formats: MP3, WAV, MP4, AAC, OGG (max 50MB)
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Music className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-text-primary">{selectedFile.name}</p>
                <p className="text-sm text-text-secondary">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <button
            onClick={handleUpload}
            disabled={isProcessing}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing sample...</span>
              </div>
            ) : (
              'Analyze Sample'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
