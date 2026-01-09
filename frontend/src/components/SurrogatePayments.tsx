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
  Search,
  Sparkles,
  Download,
  Filter
} from 'lucide-react';
import logo from 'figma:asset/772aa6854dfe11f4288b7a955fea018059bbad2d.png';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/userSlice';
import { 
  surrogateReceivedPayments, 
  upcomingPayments, 
  reimbursementRequests 
} from '../data/sharedPaymentData';

interface SurrogatePaymentsProps {
  onBack: () => void;
  onNavigate: (page: 'surrogate-dashboard' | 'surrogate-payments' | 'surrogate-lost-wages') => void;
}

export function SurrogatePayments({ onBack, onNavigate }: SurrogatePaymentsProps) {
  const dispatch = useAppDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('all');

  // All transactions from shared data (only what surrogate has been PAID)
  const allTransactions = surrogateReceivedPayments.map(p => ({
    date: p.date,
    description: p.description,
    category: p.category,
    amount: p.amount,
    status: p.status
  }));

  const filteredTransactions = transactionFilter === 'all' 
    ? allTransactions 
    : allTransactions.filter(t => {
        if (transactionFilter === 'milestones') return t.category === 'Milestone Payment';
        if (transactionFilter === 'reimbursements') return t.category === 'Reimbursement';
        if (transactionFilter === 'allowances') return t.category === 'Allowance';
        return true;
      });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pending conditions':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'processing soon':
        return 'bg-purple-100 text-purple-800';
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
              <img src={logo} alt="The Biggest Ask" className="h-10 w-10" />
              <span className="text-gray-900">The Biggest Ask</span>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate('surrogate-dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate('surrogate-payments')}
                className="text-primary"
              >
                Payments
              </button>
              <button 
                onClick={() => onNavigate('surrogate-lost-wages')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Lost Wages
              </button>
              <a href="#support" className="text-gray-600 hover:text-gray-900 transition-colors">
                Support
              </a>
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
                  <button 
                    onClick={async () => {
                      setShowUserMenu(false);
                      await dispatch(logout());
                      onBack();
                    }} 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Payments</h1>
          <p className="text-gray-600">View all payments, reimbursement requests, and account activity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Section 1 - Upcoming Payments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Upcoming Payments</h3>
              <div className="space-y-4">
                {upcomingPayments.map((payment, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-1">{payment.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{payment.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 mb-1">{payment.amount}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                View All Milestones
              </button>
            </div>

            {/* Section 2 - Full Transaction History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Transaction History</h3>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select 
                    value={transactionFilter}
                    onChange={(e) => setTransactionFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Transactions</option>
                    <option value="milestones">Milestones</option>
                    <option value="reimbursements">Reimbursements</option>
                    <option value="allowances">Allowances</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Date</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Description</th>
                      <th className="text-left py-3 px-4 text-gray-600 text-sm">Category</th>
                      <th className="text-right py-3 px-4 text-gray-600 text-sm">Amount</th>
                      <th className="text-right py-3 px-4 text-gray-600 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">{transaction.date}</td>
                        <td className="py-3 px-4 text-gray-900">{transaction.description}</td>
                        <td className="py-3 px-4 text-gray-700">{transaction.category}</td>
                        <td className="py-3 px-4 text-gray-900 text-right">{transaction.amount}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <button className="mt-4 w-full py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download Statement
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
                    <p className="text-gray-900 text-sm">Next scheduled payment</p>
                    <p className="text-gray-500 text-xs">Dec 10, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm">Next medical appointment</p>
                    <p className="text-gray-500 text-xs">Dec 8, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm">Monthly allowance due</p>
                    <p className="text-gray-500 text-xs">Jan 1, 2026</p>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
}