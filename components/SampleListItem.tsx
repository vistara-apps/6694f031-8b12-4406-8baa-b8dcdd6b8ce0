'use client';

import { Sample } from '@/lib/types';
import { formatDate, formatDuration, getStatusColor } from '@/lib/utils';
import { Music, Clock, User, Zap, TrendingUp } from 'lucide-react';

interface SampleListItemProps {
  sample: Sample;
  variant?: 'active' | 'pending' | 'cleared';
  onClick?: () => void;
}

export function SampleListItem({ sample, variant, onClick }: SampleListItemProps) {
  const statusColor = getStatusColor(sample.clearanceStatus);
  const detectedSample = sample.detectedSamples[0]; // Show first detected sample
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-success-600 bg-success-50';
    if (confidence >= 0.7) return 'text-warning-600 bg-warning-50';
    return 'text-error-600 bg-error-50';
  };
  
  return (
    <div 
      className="glass-card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-fade-in group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
            <Music className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-text-primary">{sample.originalTrack}</h3>
            <p className="text-sm text-text-secondary flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(sample.createdAt)}</span>
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {sample.clearanceStatus.charAt(0).toUpperCase() + sample.clearanceStatus.slice(1)}
        </span>
      </div>
      
      {detectedSample && (
        <div className="bg-surface-elevated rounded-xl p-5 mb-4 border border-border hover:border-border-strong transition-colors duration-200">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-accent" />
            <span className="font-semibold text-sm text-text-primary">Detected Sample</span>
          </div>
          
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-text-secondary" />
                <span className="font-medium text-sm text-text-primary">{detectedSample.artist}</span>
              </div>
              <p className="text-text-primary font-semibold">{detectedSample.trackName}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="w-4 h-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">
                  {formatDuration(detectedSample.endTime - detectedSample.startTime)} duration
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(detectedSample.confidence)}`}>
                {Math.round(detectedSample.confidence * 100)}% match
              </div>
              <div className="flex items-center space-x-1 text-xs text-text-secondary mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>High confidence</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced progress bar */}
          <div className="space-y-1">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${detectedSample.confidence * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-text-tertiary">
              <span>Match confidence</span>
              <span>{Math.round(detectedSample.confidence * 100)}%</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
        <span className="text-text-secondary">
          Rights: <span className="font-medium text-text-primary">{sample.rightsInfo.publisherName}</span>
        </span>
        {sample.licenseTerms && (
          <div className="text-right">
            <div className="text-xs text-text-secondary">License fee</div>
            <span className="text-lg font-bold text-primary">
              ${sample.licenseTerms.upfrontFee}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
