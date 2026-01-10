import { useState } from 'react';
import { CheckCircle, Shield, DollarSign, FileText, Sparkles, Calendar, Flag, X } from 'lucide-react';
import logo from 'figma:asset/772aa6854dfe11f4288b7a955fea018059bbad2d.png';

interface SurrogateConfirmationProps {
  onConfirm: () => void;
  onBack: () => void;
}

export function SurrogateConfirmation({ onConfirm, onBack }: SurrogateConfirmationProps) {
  const [agreedToContract, setAgreedToContract] = useState(false);
  const [understoodPayment, setUnderstoodPayment] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [issueDescription, setIssueDescription] = useState('');
  const [issueCategory, setIssueCategory] = useState('');

  const handleConfirm = () => {
    if (agreedToContract && understoodPayment) {
      // Mock: This triggers payment from IPs
      alert('Contract confirmed! Your Intended Parents will now be charged for the escrow service. You will receive access to your dashboard momentarily.');
      onConfirm();
    }
  };

  const handleFlagIssue = () => {
    if (issueCategory && issueDescription.trim()) {
      // Mock: Send to backend
      alert(`Issue flagged successfully!\n\nCategory: ${issueCategory}\nDescription: ${issueDescription}\n\nOur team will review this within 24 hours.`);
      setShowFlagModal(false);
      setIssueDescription('');
      setIssueCategory('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={logo} alt="The Biggest Ask" className="h-10 w-10" />
              <div className="flex flex-col items-start">
                <span className="text-gray-900">The Biggest Ask</span>
                <span className="text-xs text-white bg-accent px-2 py-0.5 rounded">Surrogate Portal</span>
              </div>
            </button>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-600 text-sm hidden md:block">IPs Confirmed</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300 mx-2"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-white">2</span>
                </div>
                <span className="text-gray-900 hidden md:block">Your Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] mx-auto px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-gray-900 mb-3">Review & Confirm Your Contract</h1>
            <p className="text-gray-600 text-lg">
              Your Intended Parents have confirmed the contract. Please review and confirm to activate your escrow account.
            </p>
            {/* Flag Issue Button */}
            <div className="mt-4">
              <button
                onClick={() => setShowFlagModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-orange-300 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-sm"
              >
                <Flag className="w-4 h-4" />
                Flag an Issue
              </button>
            </div>
          </div>

          {/* Contract Summary Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-secondary" />
              <h2 className="text-gray-900">Contract Summary</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Contract Details */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Intended Parents</p>
                  <p className="text-gray-900">Sarah & Michael Thompson</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Gestational Carrier</p>
                  <p className="text-gray-900">Maria Rodriguez</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Contract Date</p>
                  <p className="text-gray-900">November 15, 2025</p>
                </div>
              </div>

              {/* Financial Overview */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Base Compensation</p>
                  <p className="text-gray-900 text-2xl">$45,000</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Additional Allowances</p>
                  <p className="text-gray-900">$8,500</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Escrow Amount</p>
                  <p className="text-gray-900">$53,500</p>
                </div>
              </div>
            </div>

            {/* Key Milestones Preview */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-gray-900">Key Payment Milestones</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Contract Signing</span>
                  <span className="text-gray-900">$5,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Heartbeat Confirmation</span>
                  <span className="text-gray-900">Triggers monthly payments</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Monthly Base Compensation</span>
                  <span className="text-gray-900">$5,000/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">Delivery</span>
                  <span className="text-gray-900">Final payment + bonuses</span>
                </div>
              </div>
            </div>

            {/* View Full Contract Button */}
            <button className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-6">
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                <span>View Full Contract</span>
              </div>
            </button>
          </div>

          {/* What Happens Next */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h2 className="text-gray-900">What Happens When You Confirm</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-gray-900 mb-1">Escrow Service Activation</p>
                  <p className="text-gray-600 text-sm">Your Intended Parents will be charged a one-time fee of $750 for the escrow service (they pay this, not you).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-gray-900 mb-1">Dashboard Access</p>
                  <p className="text-gray-600 text-sm">You&apos;ll gain immediate access to your personalized dashboard to track payments, submit reimbursements, and communicate.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-gray-900 mb-1">Escrow Account Setup</p>
                  <p className="text-gray-600 text-sm">An FDIC-insured escrow account will be created to hold all funds securely throughout your journey.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="text-gray-900 mb-1">AI Monitoring Begins</p>
                  <p className="text-gray-600 text-sm">Our AI will automatically track milestones and initiate payments according to your contract terms.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Protection & Security Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="text-gray-900">Your Protection</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 mb-1">FDIC-Insured</p>
                  <p className="text-gray-600 text-xs">All funds protected up to $250,000</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 mb-1">Automated Payments</p>
                  <p className="text-gray-600 text-xs">No delays or missed payments</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 mb-1">Contract Enforcement</p>
                  <p className="text-gray-600 text-xs">AI ensures terms are followed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Checkboxes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
            <h3 className="text-gray-900 mb-6">Confirm Your Understanding</h3>
            
            <div className="space-y-4">
              {/* Contract Agreement */}
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border-2 border-gray-200 hover:border-primary transition-colors">
                <input
                  type="checkbox"
                  checked={agreedToContract}
                  onChange={(e) => setAgreedToContract(e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary focus:ring-2 focus:ring-primary border-gray-300 rounded"
                />
                <div>
                  <p className="text-gray-900 mb-1">I have reviewed and agree to the contract terms</p>
                  <p className="text-gray-600 text-sm">
                    I understand the payment schedule, milestones, and my responsibilities as outlined in the contract.
                  </p>
                </div>
              </label>

              {/* Payment Understanding */}
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border-2 border-gray-200 hover:border-primary transition-colors">
                <input
                  type="checkbox"
                  checked={understoodPayment}
                  onChange={(e) => setUnderstoodPayment(e.target.checked)}
                  className="mt-1 w-5 h-5 text-primary focus:ring-2 focus:ring-primary border-gray-300 rounded"
                />
                <div>
                  <p className="text-gray-900 mb-1">I understand that confirming will trigger the service fee</p>
                  <p className="text-gray-600 text-sm">
                    My Intended Parents will be charged $750 for the escrow service upon my confirmation. This is a one-time fee paid by them, not me.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={!agreedToContract || !understoodPayment}
              className="px-8 py-3 bg-gradient-to-r from-accent to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm & Continue
            </button>
          </div>

          {/* Support Contact */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Questions about your contract?{' '}
              <a href="#support" className="text-primary hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 mt-12">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a href="#privacy" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Privacy
              </a>
              <span className="text-gray-300">|</span>
              <a href="#terms" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Terms
              </a>
              <span className="text-gray-300">|</span>
              <a href="#support" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Support
              </a>
            </div>
            <p className="text-gray-500 text-sm">© 2025 The Biggest Ask</p>
          </div>
        </div>
      </footer>

      {/* Flag Issue Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 text-lg">Flag an Issue</h2>
              <button onClick={() => setShowFlagModal(false)} className="text-gray-500 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a category</option>
                  <option value="contract">Contract Discrepancy</option>
                  <option value="payment">Payment Issue</option>
                  <option value="communication">Communication Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-primary focus:border-primary"
                  rows={4}
                ></textarea>
              </div>
            </div>
            <div className="flex items-center justify-end mt-4">
              <button
                onClick={handleFlagIssue}
                className="px-8 py-3 bg-gradient-to-r from-accent to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
              >
                <Flag className="w-5 h-5" />
                Flag Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}