'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  variant?: 'default' | 'glass';
  className?: string;
}

export function AppShell({ children, variant = 'default', className }: AppShellProps) {
  return (
    <div className={cn(
      'min-h-screen w-full',
      variant === 'glass' && 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
      className
    )}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}
