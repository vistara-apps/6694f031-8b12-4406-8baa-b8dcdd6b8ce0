'use client';

import { ReactNode, useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  format?: 'number' | 'currency' | 'percentage';
  className?: string;
  animated?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  format = 'number',
  className = '',
  animated = true 
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animated && typeof value === 'number') {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [animated, value]);

  useEffect(() => {
    if (animated && isVisible && typeof value === 'number') {
      const duration = 1000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value, animated]);

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div className={`glass-card p-6 text-center group hover:scale-105 transition-all duration-300 ${className}`}>
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
          <div className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="mb-2">
        <div className="text-3xl font-bold text-text-primary mb-1 tabular-nums">
          {formatValue(displayValue)}
        </div>
        
        {/* Trend indicator */}
        {trend && (
          <div className={`flex items-center justify-center space-x-1 text-sm ${
            trend.isPositive ? 'text-success-600' : 'text-error-600'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-medium">
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-text-tertiary">
              {trend.label}
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors duration-300">
        {title}
      </div>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
