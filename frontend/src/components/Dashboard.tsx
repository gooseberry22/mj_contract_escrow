import { useState } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  FileText, 
  User, 
  ChevronDown,
  Clock,
  AlertCircle,
  TrendingUp,
  Search,
  Sparkles,
  CheckCheck,
  X,
  MessageCircle,
  Receipt,
  Zap,
  Info,
  Lock,
  Shield,
  Upload
} from 'lucide-react';
import { Logo } from './Logo';
import { getPendingMilestonePayments, getCompletedMilestonePayments, reimbursementRequests } from '../data/sharedPaymentData';
import { getMilestoneById } from '../data/milestoneData';

interface DashboardProps {
  onBack: () => void;
  onNavigate: (page: 'dashboard' | 'payments' | 'milestones' | 'support') => void;
}

export function Dashboard({ onBack, onNavigate }: DashboardProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showW9Modal, setShowW9Modal] = useState(false);
  const [showW9Tooltip, setShowW9Tooltip] = useState(false);
  const [ssnValue, setSsnValue] = useState('');
  const [dobValue, setDobValue] = useState('');
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  // Pull data from shared payment data (driven by surrogate actions)
  const pendingMilestonePayments = getPendingMilestonePayments().slice(0, 3);
  const recentActivity = getCompletedMilestonePayments().slice(-2).reverse();
  
  // Map upcoming milestones with full milestone data
  const upcomingMilestones = pendingMilestonePayments.map(p => ({
    milestoneId: p.milestoneId,
    milestone: p.milestoneId ? getMilestoneById(p.milestoneId) : null,
    date: p.date,
    amount: p.amount,
    status: p.status,
    completed: false,
    actionNeeded: p.status === 'Pending Conditions'
  }));

  // Mock data
  const parentName = "Sarah & John";
  const nextPayment = { date: "Dec 15, 2025", amount: "$8,500" };
  const currentPhase = "First Trimester";
  
  // Setup progress steps
  const setupSteps = [
    { 
      id: 1, 
      label: 'Create Account', 
      completed: true,
      description: 'Account created successfully'
    },
    { 
      id: 2, 
      label: 'GC Contract Validated & Confirmed by Surrogate', 
      completed: true,
      description: 'Contract confirmed by Jessica Smith'
    },
    { 
      id: 3, 
      label: 'Provide W-9 Info', 
      completed: false,
      description: 'Required for tax reporting',
      actionRequired: true
    },
    { 
      id: 4, 
      label: 'Wire Money to NBH Account', 
      completed: false,
      description: 'Set up your escrow fund',
      actionRequired: true,
      wireAmount: '$152,450', // From AI contract analysis - total journey cost
      wireSource: 'contract', // or 'default' for $10,000 minimum
      wireStatus: 'complete' // Options: 'not_started', 'pending', 'approved', 'complete'
    }
  ];

  const completedSteps = setupSteps.filter(s => s.completed).length;
  const totalSteps = setupSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;
  
  // Determine escrow balance based on wire transfer status
  const wireStep = setupSteps.find(s => s.id === 4);
  const escrowBalance = wireStep?.wireStatus === 'complete' ? "$152,450" : "$0";
  const escrowBalanceNumeric = wireStep?.wireStatus === 'complete' ? 12000 : 0; // Temporarily set to $12,000 to demo warning
  
  // Contract minimum balance (from contract or $10,000 default)
  const contractMinimumBalance = 10000; // This would come from contract analysis in production
  const lowBalanceThreshold = contractMinimumBalance + 5000; // Warn when within $5k of minimum
  
  // Check if balance is low
  const isBalanceLow = escrowBalanceNumeric > 0 && escrowBalanceNumeric <= lowBalanceThreshold;
  const isBalanceCritical = escrowBalanceNumeric > 0 && escrowBalanceNumeric <= contractMinimumBalance;
  
  const escrowBalanceNote = wireStep?.wireStatus === 'complete' 
    ? null 
    : wireStep?.wireStatus === 'pending' 
    ? 'Wire transfer pending verification' 
    : wireStep?.wireStatus === 'approved'
    ? 'Wire transfer approved, funds arriving soon'
    : 'Complete wire transfer to fund escrow';
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Logo />
              <div className="flex flex-col items-start">
                <span className="text-gray-900">TBA Surrogacy Escrow</span>
                <span className="text-xs text-white bg-secondary px-2 py-0.5 rounded">Intended Parents Portal</span>
              </div>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="text-primary"
              >
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate('payments')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Payments
              </button>
              <button 
                onClick={() => onNavigate('milestones')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contract
              </button>
              <button 
                onClick={() => onNavigate('support')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Support
              </button>
            </nav>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <a href="#profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Profile Settings
                  </a>
                  <a href="#security" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Security
                  </a>
                  <hr className="my-2" />
                  <button onClick={onBack} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Low Balance Warning Banner */}
      {isBalanceCritical && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-[1440px] mx-auto px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-900 mb-1">
                  <span className="font-medium">Critical: Escrow Balance Below Minimum</span>
                </p>
                <p className="text-red-700 text-sm">
                  Your current balance (${escrowBalanceNumeric.toLocaleString()}) is at or below the minimum required balance of ${contractMinimumBalance.toLocaleString()}. 
                  Please add funds to ensure uninterrupted payments to your Gestational Carrier.
                </p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm whitespace-nowrap">
                Add Funds Now
              </button>
            </div>
          </div>
        </div>
      )}
      {!isBalanceCritical && isBalanceLow && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-[1440px] mx-auto px-8 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-yellow-900 mb-1">
                  <span className="font-medium">Low Escrow Balance Warning</span>
                </p>
                <p className="text-yellow-700 text-sm">
                  Your current balance (${escrowBalanceNumeric.toLocaleString()}) is approaching the minimum required balance of ${contractMinimumBalance.toLocaleString()}. 
                  Consider adding funds soon to maintain sufficient reserves for upcoming milestone payments and reimbursements.
                </p>
              </div>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm whitespace-nowrap">
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Section 1 - Account Setup Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-gray-900">Account Setup</h2>
                  <span className="text-sm text-gray-600">{completedSteps} of {totalSteps} complete</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Setup Steps */}
              <div className="space-y-4">
                {setupSteps.map((step) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      step.completed 
                        ? 'border-green-500 bg-green-500' 
                        : step.actionRequired 
                        ? 'border-orange-500 bg-white' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : step.actionRequired ? (
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      ) : (
                        <span className="text-gray-400">{step.id}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`${step.completed ? 'text-gray-700' : 'text-gray-900'}`}>
                          {step.label}
                        </h4>
                        {step.id === 3 && (
                          <div className="relative">
                            <button
                              onMouseEnter={() => setShowW9Tooltip(true)}
                              onMouseLeave={() => setShowW9Tooltip(false)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                            {showW9Tooltip && (
                              <div className="absolute left-0 top-6 z-50 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                                <p className="mb-2">
                                  To open your FDIC-insured escrow account, banks require us to collect a W-9 (IRS) and verify your identity.
                                </p>
                                <p className="text-gray-300 text-xs">
                                  Your information is securely encrypted and only used for legally required tax and banking purposes.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        {step.completed && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                            Complete
                          </span>
                        )}
                        {step.actionRequired && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                            Action Required
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                      {step.id === 4 && step.wireAmount && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-700 text-sm mb-1">
                                <span className="font-medium">Wire Amount: </span>
                                <span className="text-gray-900 text-lg font-semibold">{step.wireAmount}</span>
                              </p>
                              <p className="text-gray-600 text-xs">
                                {step.wireSource === 'contract' 
                                  ? '✨ Amount determined by AI analysis of your contract'
                                  : 'Recommended minimum deposit to begin escrow services'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {step.actionRequired && (
                        <button 
                          onClick={() => {
                            if (step.id === 3) {
                              setShowW9Modal(true);
                            }
                          }}
                          className="mt-2 px-4 py-1.5 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                        >
                          Complete Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 - Journey Snapshot */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Journey Snapshot</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Escrow Balance */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-gray-600 text-sm">Total Escrow Balance</span>
                  </div>
                  <p className="text-gray-900 text-2xl">{escrowBalance}</p>
                  {escrowBalanceNote && (
                    <p className="text-gray-500 text-xs">{escrowBalanceNote}</p>
                  )}
                </div>

                {/* Next Expected Payment */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span className="text-gray-600 text-sm">Next Expected Payment</span>
                  </div>
                  <p className="text-gray-900">{nextPayment.amount}</p>
                  <p className="text-gray-500 text-sm">{nextPayment.date}</p>
                </div>

                {/* Current Phase */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-accent" />
                    <span className="text-gray-600 text-sm">Current Phase</span>
                  </div>
                  <p className="text-gray-900">{currentPhase}</p>
                </div>
              </div>
            </div>

            {/* Section 3 - Upcoming Milestones */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Upcoming Milestones</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">From milestone database</span>
              </div>
              <div className="space-y-4">
                {upcomingMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      milestone.completed ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'
                    }`}>
                      {milestone.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-gray-900">{milestone.milestone?.name || 'Unknown Milestone'}</h4>
                            <span className="text-xs text-gray-400">{milestone.milestoneId}</span>
                          </div>
                          {milestone.milestone && (
                            <p className="text-gray-600 text-xs mt-1">{milestone.milestone.ipPerspective[0]}</p>
                          )}
                        </div>
                        {milestone.actionNeeded && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                            <AlertCircle className="w-3 h-3" />
                            Action Needed
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">Expected: {milestone.date}</p>
                      <p className="text-gray-900 mt-1">{milestone.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                View All Milestones
              </button>
            </div>

            {/* Section 4 - Reimbursement Requests */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Approved Reimbursements</h3>
              <p className="text-gray-600 text-sm mb-4">Recently Approved & Paid</p>
              <div className="space-y-3">
                {reimbursementRequests
                  .filter(request => request.status === 'Approved' || request.status === 'Paid')
                  .map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-gray-900">{request.title}</h4>
                      <p className="text-gray-500 text-sm">{request.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 mb-1">{request.amount}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                View All Requests
              </button>
            </div>

            {/* Section 5 - Payment Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Payment Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Date</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Description</th>
                      <th className="text-right py-3 px-4 text-gray-600 text-sm">Amount</th>
                      <th className="text-right py-3 px-4 text-gray-600 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((payment, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">{payment.date}</td>
                        <td className="py-3 px-4 text-gray-700">{payment.description}</td>
                        <td className="py-3 px-4 text-gray-900 text-right">{payment.amount}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Transaction History
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* AI Contract Lookup */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-gray-900">Have a question about what's in your contract? Just ask me!</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Search your contract for rules about payments and milestones.</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your contract..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Documents</h3>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-secondary" />
                  <span className="text-gray-700 text-sm">Contract</span>
                </div>
                <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                  <CheckCircle className="w-4 h-4" />
                  Confirmed
                </span>
              </div>
              <button className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                Open Contract
              </button>
            </div>

            {/* Upcoming Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Upcoming Items</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm">Next milestone payment</p>
                    <p className="text-gray-500 text-xs">Feb 3, 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm">Insurance premium due</p>
                    <p className="text-gray-500 text-xs">Jan 15, 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm">Quarterly escrow review</p>
                    <p className="text-gray-500 text-xs">Mar 1, 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* W-9 Modal */}
      {showW9Modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-gray-900 mb-2">Complete W-9 Information</h2>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">NBH Bank Secure Verification</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowW9Modal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Trust Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-900 text-sm mb-1">
                      All escrow accounts require federal tax documentation.
                    </p>
                    <p className="text-blue-700 text-xs">
                      Your information is securely encrypted and only used for legally required tax and banking purposes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6">
                {/* Social Security Number */}
                <div>
                  <label className="block text-gray-900 mb-2">
                    Social Security Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ssnValue}
                    onChange={(e) => {
                      // Format as XXX-XX-XXXX
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length > 3 && value.length <= 5) {
                        value = value.slice(0, 3) + '-' + value.slice(3);
                      } else if (value.length > 5) {
                        value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5, 9);
                      }
                      setSsnValue(value);
                    }}
                    placeholder="XXX-XX-XXXX"
                    maxLength={11}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-gray-500 text-xs mt-1">Required for IRS Form W-9</p>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-gray-900 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dobValue}
                    onChange={(e) => setDobValue(e.target.value)}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-gray-500 text-xs mt-1">Required for identity verification</p>
                </div>

                {/* Driver's License Upload */}
                <div>
                  <label className="block text-gray-900 mb-2">
                    Driver's License Upload <span className="text-gray-500 text-sm">(Optional)</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-700 mb-1">
                      {licenseFile ? licenseFile.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {licenseFile 
                        ? 'File uploaded successfully' 
                        : 'If your bank partner requires additional KYC verification beyond SSN'
                      }
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setLicenseFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="license-upload"
                    />
                    <label
                      htmlFor="license-upload"
                      className="mt-3 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm"
                    >
                      {licenseFile ? 'Change File' : 'Select File'}
                    </label>
                  </div>
                </div>

                {/* Security Note */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700 text-sm mb-1">256-bit encryption in transit and at rest</p>
                      <p className="text-gray-600 text-xs">
                        We use bank-grade security to protect your personal information. Data is transmitted using TLS 1.3 and stored with AES-256 encryption.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowW9Modal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Validate and submit
                    if (!ssnValue || !dobValue) {
                      alert('Please fill in all required fields');
                      return;
                    }
                    alert('W-9 information submitted successfully! Your bank account will be verified within 1-2 business days.');
                    setShowW9Modal(false);
                  }}
                  className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Submit W-9 Information
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <p className="text-gray-500 text-sm">© 2025 TBA Surrogacy Escrow</p>
          </div>
        </div>
      </footer>
    </div>
  );
}