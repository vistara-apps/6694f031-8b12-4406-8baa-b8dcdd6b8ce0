'use client';

import { useState } from 'react';
import { USAGE_TYPES, TERRITORIES, DEFAULT_LICENSE_TERMS } from '@/lib/constants';
import { calculateLicenseFee } from '@/lib/utils';
import { LicenseTerms } from '@/lib/types';

interface ClearanceFormProps {
  variant?: 'create' | 'edit';
  initialTerms?: LicenseTerms;
  onSubmit: (terms: LicenseTerms) => void;
  onCancel?: () => void;
}

export function ClearanceForm({ 
  variant = 'create', 
  initialTerms = DEFAULT_LICENSE_TERMS,
  onSubmit,
  onCancel 
}: ClearanceFormProps) {
  const [terms, setTerms] = useState<LicenseTerms>(initialTerms);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateFee = async () => {
    setIsCalculating(true);
    // Simulate AI calculation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const calculatedFee = calculateLicenseFee(
      30, // Assume 30 second sample for demo
      terms.usage,
      terms.territory
    );
    
    setTerms(prev => ({ ...prev, upfrontFee: calculatedFee }));
    setIsCalculating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(terms);
  };

  return (
    <div className="glass-card p-6 animate-scale-in">
      <h2 className="text-2xl font-bold mb-6">
        {variant === 'create' ? 'Create Clearance Request' : 'Edit License Terms'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Territory
          </label>
          <select
            value={terms.territory}
            onChange={(e) => setTerms(prev => ({ ...prev, territory: e.target.value }))}
            className="input-field"
            required
          >
            {TERRITORIES.map(territory => (
              <option key={territory} value={territory}>
                {territory}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Usage Type
          </label>
          <select
            value={terms.usage}
            onChange={(e) => setTerms(prev => ({ ...prev, usage: e.target.value }))}
            className="input-field"
            required
          >
            {USAGE_TYPES.map(usage => (
              <option key={usage} value={usage}>
                {usage}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            License Duration
          </label>
          <select
            value={terms.duration}
            onChange={(e) => setTerms(prev => ({ ...prev, duration: e.target.value }))}
            className="input-field"
            required
          >
            <option value="1 year">1 Year</option>
            <option value="3 years">3 Years</option>
            <option value="5 years">5 Years</option>
            <option value="10 years">10 Years</option>
            <option value="perpetual">Perpetual</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Royalty Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            step="0.1"
            value={terms.royaltyRate}
            onChange={(e) => setTerms(prev => ({ ...prev, royaltyRate: parseFloat(e.target.value) }))}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-text-primary">
              Upfront Fee ($)
            </label>
            <button
              type="button"
              onClick={handleCalculateFee}
              disabled={isCalculating}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              {isCalculating ? 'Calculating...' : 'AI Calculate'}
            </button>
          </div>
          <input
            type="number"
            min="0"
            step="1"
            value={terms.upfrontFee}
            onChange={(e) => setTerms(prev => ({ ...prev, upfrontFee: parseInt(e.target.value) }))}
            className="input-field"
            required
          />
        </div>
        
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="flex-1 btn-primary"
          >
            {variant === 'create' ? 'Send Request' : 'Update Terms'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
