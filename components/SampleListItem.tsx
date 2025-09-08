'use client';

import { Sample } from '@/lib/types';
import { formatDate, formatDuration, getStatusColor } from '@/lib/utils';
import { Music, Clock, User } from 'lucide-react';

interface SampleListItemProps {
  sample: Sample;
  variant?: 'active' | 'pending' | 'cleared';
  onClick?: () => void;
}

export function SampleListItem({ sample, variant, onClick }: SampleListItemProps) {
  const statusColor = getStatusColor(sample.clearanceStatus);
  const detectedSample = sample.detectedSamples[0]; // Show first detected sample
  
  return (
    <div 
      className="glass-card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Music className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{sample.originalTrack}</h3>
            <p className="text-sm text-text-secondary">
              {formatDate(sample.createdAt)}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
          {sample.clearanceStatus.charAt(0).toUpperCase() + sample.clearanceStatus.slice(1)}
        </span>
      </div>
      
      {detectedSample && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-text-secondary" />
              <span className="font-medium text-sm">{detectedSample.artist}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-secondary">
                {formatDuration(detectedSample.endTime - detectedSample.startTime)}
              </span>
            </div>
          </div>
          <p className="text-sm text-text-primary font-medium">{detectedSample.trackName}</p>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${detectedSample.confidence * 100}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {Math.round(detectedSample.confidence * 100)}% confidence match
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">
          Rights: {sample.rightsInfo.publisherName}
        </span>
        {sample.licenseTerms && (
          <span className="text-primary font-medium">
            ${sample.licenseTerms.upfrontFee}
          </span>
        )}
      </div>
    </div>
  );
}
