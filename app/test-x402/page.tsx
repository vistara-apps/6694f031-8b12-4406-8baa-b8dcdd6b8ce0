'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { WalletConnection } from '@/components/WalletConnection';
import { X402PaymentButton } from '@/components/X402PaymentButton';
import { runX402TestSuite, generateTestReport, type TestSuite } from '@/lib/x402-test';
import { Play, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

export default function TestX402Page() {
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testReport, setTestReport] = useState<string>('');

  const handleRunTests = async () => {
    setIsRunningTests(true);
    try {
      const suite = await runX402TestSuite();
      setTestSuite(suite);
      const report = generateTestReport(suite);
      setTestReport(report);
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleDownloadReport = () => {
    if (!testReport) return;
    
    const blob = new Blob([testReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `x402-test-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePaymentSuccess = (transactionHash: string) => {
    console.log('✅ Payment successful:', transactionHash);
    alert(`Payment successful! Transaction: ${transactionHash}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('❌ Payment failed:', error);
    alert(`Payment failed: ${error}`);
  };

  return (
    <AppShell variant="glass">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">X402 Payment Flow Test</h1>
          <p className="text-text-secondary">
            Test and verify the x402 payment implementation with USDC on Base
          </p>
        </div>
        <WalletConnection />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Test Suite */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4">Automated Test Suite</h2>
            <p className="text-text-secondary mb-6">
              Run comprehensive tests to verify x402 payment flow functionality
            </p>
            
            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="btn-primary w-full flex items-center justify-center space-x-2 mb-6"
            >
              {isRunningTests ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Running Tests...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Run Test Suite</span>
                </>
              )}
            </button>

            {/* Test Results */}
            {testSuite && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {testSuite.passed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    )}
                    <div>
                      <div className="font-semibold">
                        {testSuite.passed ? 'All Tests Passed' : 'Some Tests Failed'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testSuite.passedTests} / {testSuite.totalTests} tests passed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {((testSuite.passedTests / testSuite.totalTests) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>

                {/* Individual Test Results */}
                <div className="space-y-2">
                  {testSuite.results.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        result.passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {result.passed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <AlertCircle className="w-4 h-4" />
                        )}
                        <span className="font-medium">{result.testName}</span>
                      </div>
                      <span className="text-sm">
                        {result.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Download Report */}
                {testReport && (
                  <button
                    onClick={handleDownloadReport}
                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Test Report</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live Payment Test */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-4">Live Payment Test</h2>
            <p className="text-text-secondary mb-6">
              Test actual x402 payment processing with your connected wallet
            </p>

            {/* Test Payment Scenarios */}
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">Small Payment Test</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Test with $1 USDC payment
                </p>
                <X402PaymentButton
                  amount={1}
                  invoiceId={`test-small-${Date.now()}`}
                  recipient="0x742d35Cc6634C0532925a3b8D0C9e3e0C0c0c0c0"
                  description="Small payment test - $1 USDC"
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">Medium Payment Test</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Test with $10 USDC payment
                </p>
                <X402PaymentButton
                  amount={10}
                  invoiceId={`test-medium-${Date.now()}`}
                  recipient="0x742d35Cc6634C0532925a3b8D0C9e3e0C0c0c0c0"
                  description="Medium payment test - $10 USDC"
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold mb-2">Large Payment Test</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Test with $100 USDC payment
                </p>
                <X402PaymentButton
                  amount={100}
                  invoiceId={`test-large-${Date.now()}`}
                  recipient="0x742d35Cc6634C0532925a3b8D0C9e3e0C0c0c0c0"
                  description="Large payment test - $100 USDC"
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>
            </div>
          </div>

          {/* Test Information */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Test Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-medium">Base (Chain ID: 8453)</span>
              </div>
              <div className="flex justify-between">
                <span>Token:</span>
                <span className="font-medium">USDC</span>
              </div>
              <div className="flex justify-between">
                <span>Contract:</span>
                <span className="font-mono text-xs">0x833589...2913</span>
              </div>
              <div className="flex justify-between">
                <span>Test Recipient:</span>
                <span className="font-mono text-xs">0x742d35...c0c0</span>
              </div>
              <div className="flex justify-between">
                <span>Required Confirmations:</span>
                <span className="font-medium">1</span>
              </div>
            </div>
          </div>

          {/* Test Checklist */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Test Checklist</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Wallet connection works</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>USDC balance displays correctly</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Payment validation works</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Transaction processing works</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Confirmation polling works</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Error handling works</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Transaction links work</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
