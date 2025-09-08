'use client';

import { useState, useRef } from 'react';
import { Upload, Music, X, Loader2, CheckCircle, FileAudio, AlertCircle } from 'lucide-react';
import { SUPPORTED_AUDIO_FORMATS, MAX_FILE_SIZE } from '@/lib/constants';

interface SampleUploadProps {
  onUploadComplete: (file: File) => void;
  onUploadError: (error: string) => void;
}

export function SampleUpload({ onUploadComplete, onUploadError }: SampleUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
      setUploadError(error);
      onUploadError(error);
      return;
    }
    
    setUploadError(null);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Simulate file processing and AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onUploadComplete(selectedFile);
    } catch (error) {
      const errorMessage = 'Failed to process audio file';
      setUploadError(errorMessage);
      onUploadError(errorMessage);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'ogg':
        return <FileAudio className="w-8 h-8 text-primary" />;
      default:
        return <Music className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Upload Audio Sample</h2>
        {uploadError && (
          <div className="flex items-center space-x-2 text-error-600 bg-error-50 px-3 py-1 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Upload Error</span>
          </div>
        )}
      </div>
      
      {uploadError && (
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-600">{uploadError}</p>
        </div>
      )}
      
      {!selectedFile ? (
        <div
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 relative overflow-hidden
            ${isDragging 
              ? 'border-primary bg-primary/10 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }
          `}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <div className={`transition-all duration-300 ${isDragging ? 'scale-110' : ''}`}>
            <Upload className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
              isDragging ? 'text-primary' : 'text-text-tertiary'
            }`} />
            <p className="text-xl font-semibold text-text-primary mb-2">
              {isDragging ? 'Drop your file here' : 'Drop your audio file here'}
            </p>
            <p className="text-text-secondary mb-6">
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
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm text-text-secondary">
                Supported formats: <span className="font-medium">MP3, WAV, MP4, AAC, OGG</span>
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                Maximum file size: 50MB
              </p>
            </div>
          </div>
          
          {/* Animated background */}
          <div className={`absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-0 transition-opacity duration-300 ${
            isDragging ? 'opacity-100' : ''
          }`} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Preview */}
          <div className="flex items-center justify-between p-6 bg-surface-elevated rounded-xl border border-border">
            <div className="flex items-center space-x-4">
              {getFileIcon(selectedFile.name)}
              <div>
                <p className="font-semibold text-text-primary">{selectedFile.name}</p>
                <p className="text-sm text-text-secondary">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
                </p>
              </div>
            </div>
            {!isProcessing && (
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setUploadError(null);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-text-secondary hover:text-text-primary" />
              </button>
            )}
          </div>
          
          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Processing...</span>
                <span className="text-text-primary font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isProcessing}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  {uploadProgress < 90 ? 'Uploading...' : 'Analyzing sample...'}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Analyze Sample</span>
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
