'use client';

import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { FileText, Calendar, CreditCard, Coins } from 'lucide-react';

interface InvoiceCardProps {
  invoice: Invoice;
  variant?: 'paid' | 'unpaid' | 'overdue';
  onPayClick?: () => void;
}

export function InvoiceCard({ invoice, variant, onPayClick }: InvoiceCardProps) {
  const statusColor = getStatusColor(invoice.status);
  const isPayable = invoice.status === 'unpaid' || invoice.status === 'overdue';
  
  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">
              Invoice #{invoice.invoiceId.split('-')[1]?.toUpperCase()}
            </h3>
            <p className="text-sm text-text-secondary">
              {formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Amount</span>
          <span className="font-semibold text-lg">
            {formatCurrency(invoice.amount)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Due Date</span>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-text-secondary" />
            <span className="text-sm">{formatDate(invoice.dueDate)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Payment Method</span>
          <div className="flex items-center space-x-2">
            {invoice.paymentMethod === 'onchain' ? (
              <Coins className="w-4 h-4 text-primary" />
            ) : (
              <CreditCard className="w-4 h-4 text-text-secondary" />
            )}
            <span className="text-sm">
              {invoice.paymentMethod === 'onchain' ? 'USDC' : 'Credit Card'}
            </span>
          </div>
        </div>
        
        {invoice.paidAt && (
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Paid On</span>
            <span className="text-sm text-green-600">
              {formatDate(invoice.paidAt)}
            </span>
          </div>
        )}
        
        {invoice.transactionHash && (
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">Transaction</span>
            <a 
              href={`https://basescan.org/tx/${invoice.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View on BaseScan
            </a>
          </div>
        )}
      </div>
      
      {isPayable && onPayClick && (
        <button
          onClick={onPayClick}
          className="w-full btn-primary"
        >
          Pay Invoice
        </button>
      )}
    </div>
  );
}
