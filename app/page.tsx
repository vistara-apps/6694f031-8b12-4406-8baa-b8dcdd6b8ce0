'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { WalletConnection } from '@/components/WalletConnection';
import { SampleListItem } from '@/components/SampleListItem';
import { InvoiceCard } from '@/components/InvoiceCard';
import { SampleUpload } from '@/components/SampleUpload';
import { ClearanceForm } from '@/components/ClearanceForm';
import { PaymentButton } from '@/components/PaymentButton';
import { X402PaymentButton } from '@/components/X402PaymentButton';
import { DEMO_SAMPLES, DEMO_INVOICES } from '@/lib/constants';
import { Sample, Invoice, LicenseTerms } from '@/lib/types';
import { Music, FileText, Plus, DollarSign, TrendingUp } from 'lucide-react';

type View = 'dashboard' | 'upload' | 'samples' | 'invoices' | 'clearance' | 'payment';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [samples, setSamples] = useState<Sample[]>(DEMO_SAMPLES);
  const [invoices, setInvoices] = useState<Invoice[]>(DEMO_INVOICES);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleUploadComplete = (file: File) => {
    // Simulate creating a new sample from uploaded file
    const newSample: Sample = {
      sampleId: `sample-${Date.now()}`,
      originalTrack: file.name,
      detectedSamples: [
        {
          id: `detected-${Date.now()}`,
          trackName: 'Sample Track',
          artist: 'Unknown Artist',
          startTime: 0,
          endTime: 30,
          confidence: 0.85,
        }
      ],
      rightsInfo: {
        rightsHolderId: 'rights-new',
        publisherName: 'Pending Identification',
        contactInfo: { email: 'pending@example.com' },
        ownershipPercentage: 100,
      },
      clearanceStatus: 'pending',
      userId: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setSamples(prev => [newSample, ...prev]);
    setCurrentView('samples');
  };

  const handleClearanceSubmit = (terms: LicenseTerms) => {
    if (selectedSample) {
      setSamples(prev => prev.map(sample => 
        sample.sampleId === selectedSample.sampleId
          ? { ...sample, licenseTerms: terms, clearanceStatus: 'active' as const }
          : sample
      ));
      
      // Create invoice
      const newInvoice: Invoice = {
        invoiceId: `inv-${Date.now()}`,
        sampleId: selectedSample.sampleId,
        userId: 'user-1',
        rightsHolderId: selectedSample.rightsInfo.rightsHolderId,
        amount: terms.upfrontFee,
        status: 'unpaid',
        paymentMethod: 'onchain',
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      setInvoices(prev => [newInvoice, ...prev]);
      setCurrentView('invoices');
    }
  };

  const handlePaymentSuccess = (transactionHash?: string) => {
    if (selectedInvoice) {
      setInvoices(prev => prev.map(invoice =>
        invoice.invoiceId === selectedInvoice.invoiceId
          ? {
              ...invoice,
              status: 'paid' as const,
              paidAt: new Date().toISOString(),
              transactionHash,
            }
          : invoice
      ));
      setCurrentView('invoices');
    }
  };

  const stats = {
    totalSamples: samples.length,
    clearedSamples: samples.filter(s => s.clearanceStatus === 'cleared').length,
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(i => i.status === 'paid').length,
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
  };

  const renderView = () => {
    switch (currentView) {
      case 'upload':
        return (
          <SampleUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={(error) => console.error(error)}
          />
        );
      
      case 'samples':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Samples</h2>
              <button
                onClick={() => setCurrentView('upload')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Upload Sample</span>
              </button>
            </div>
            <div className="grid gap-6">
              {samples.map(sample => (
                <SampleListItem
                  key={sample.sampleId}
                  sample={sample}
                  onClick={() => {
                    setSelectedSample(sample);
                    setCurrentView('clearance');
                  }}
                />
              ))}
            </div>
          </div>
        );
      
      case 'invoices':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Invoices</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {invoices.map(invoice => (
                <InvoiceCard
                  key={invoice.invoiceId}
                  invoice={invoice}
                  onPayClick={() => {
                    setSelectedInvoice(invoice);
                    setCurrentView('payment');
                  }}
                />
              ))}
            </div>
          </div>
        );
      
      case 'clearance':
        return selectedSample ? (
          <ClearanceForm
            onSubmit={handleClearanceSubmit}
            onCancel={() => setCurrentView('samples')}
          />
        ) : null;
      
      case 'payment':
        return selectedInvoice ? (
          <div className="max-w-md mx-auto space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-4">Pay Invoice</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-semibold">${selectedInvoice.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invoice:</span>
                  <span>#{selectedInvoice.invoiceId.split('-')[1]?.toUpperCase()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* X402 Payment (Primary) */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Pay with USDC (Recommended)</h3>
                <p className="text-sm text-gray-600">
                  Secure on-chain payment using x402 protocol on Base network
                </p>
                <X402PaymentButton
                  amount={selectedInvoice.amount}
                  invoiceId={selectedInvoice.invoiceId}
                  recipient="0x742d35Cc6634C0532925a3b8D0C9e3e0C0c0c0c0" // Demo recipient address
                  description={`Payment for sample clearance invoice ${selectedInvoice.invoiceId}`}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={(error) => console.error(error)}
                />
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or pay with</span>
                </div>
              </div>

              {/* Legacy Payment Options */}
              <div className="space-y-4">
                <PaymentButton
                  variant="onchain"
                  amount={selectedInvoice.amount}
                  invoiceId={selectedInvoice.invoiceId}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={(error) => console.error(error)}
                />
                <PaymentButton
                  variant="fiat"
                  amount={selectedInvoice.amount}
                  invoiceId={selectedInvoice.invoiceId}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={(error) => console.error(error)}
                />
              </div>
            </div>
            
            <button
              onClick={() => setCurrentView('invoices')}
              className="w-full btn-secondary"
            >
              Cancel
            </button>
          </div>
        ) : null;
      
      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SampleSafe
              </h1>
              <p className="text-xl text-text-secondary">
                Clear music samples legally, get paid hassle-free
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 text-center">
                <Music className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.totalSamples}</div>
                <div className="text-sm text-text-secondary">Total Samples</div>
              </div>
              <div className="glass-card p-4 text-center">
                <FileText className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.clearedSamples}</div>
                <div className="text-sm text-text-secondary">Cleared</div>
              </div>
              <div className="glass-card p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.paidInvoices}</div>
                <div className="text-sm text-text-secondary">Paid Invoices</div>
              </div>
              <div className="glass-card p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">${stats.totalRevenue}</div>
                <div className="text-sm text-text-secondary">Revenue</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setCurrentView('upload')}
                className="glass-card p-6 text-left hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload New Sample</h3>
                <p className="text-text-secondary">
                  Upload your audio file and let AI identify potential samples
                </p>
              </button>
              
              <button
                onClick={() => setCurrentView('samples')}
                className="glass-card p-6 text-left hover:shadow-lg transition-all duration-200"
              >
                <Music className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold mb-2">Manage Samples</h3>
                <p className="text-text-secondary">
                  View and manage your sample clearance requests
                </p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Recent Activity</h2>
              <div className="grid gap-4">
                {samples.slice(0, 2).map(sample => (
                  <SampleListItem
                    key={sample.sampleId}
                    sample={sample}
                    onClick={() => {
                      setSelectedSample(sample);
                      setCurrentView('clearance');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <AppShell variant="glass">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-8">
        <nav className="flex space-x-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`font-medium transition-colors duration-200 ${
              currentView === 'dashboard' ? 'text-primary' : 'text-text-secondary hover:text-primary'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('samples')}
            className={`font-medium transition-colors duration-200 ${
              currentView === 'samples' ? 'text-primary' : 'text-text-secondary hover:text-primary'
            }`}
          >
            Samples
          </button>
          <button
            onClick={() => setCurrentView('invoices')}
            className={`font-medium transition-colors duration-200 ${
              currentView === 'invoices' ? 'text-primary' : 'text-text-secondary hover:text-primary'
            }`}
          >
            Invoices
          </button>
        </nav>
        
        <WalletConnection />
      </div>

      {/* Main Content */}
      {renderView()}
    </AppShell>
  );
}
