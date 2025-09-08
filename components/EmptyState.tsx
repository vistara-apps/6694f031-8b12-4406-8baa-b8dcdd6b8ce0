'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-muted to-surface border border-border">
          <div className="w-12 h-12 text-text-tertiary">
            {icon}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          {title}
        </h3>
        <p className="text-text-secondary mb-8 leading-relaxed">
          {description}
        </p>

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className={action.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-pulse-gentle" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent/30 rounded-full animate-pulse-gentle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-primary/15 rounded-full animate-pulse-gentle" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}
