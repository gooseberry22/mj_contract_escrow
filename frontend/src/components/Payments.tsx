import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { Logo } from './Logo';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPayments, fetchEscrowAccounts, updatePaymentStatus } from '../store/slices/paymentsSlice';

interface PaymentsProps {
  onBack: () => void;
  onNavigate: (page: 'dashboard' | 'payments' | 'milestones') => void;
}

export function Payments({ onBack, onNavigate }: PaymentsProps) {
  const dispatch = useAppDispatch();
  const { payments, escrowAccounts, loading, error } = useAppSelector((state) => state.payments);
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('all');

  // Fetch payments and escrow accounts on mount
  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchEscrowAccounts());
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load payment data: ${error}`);
    }
  }, [error]);

  // Calculate escrow balance from escrow accounts
  const totalEscrowBalance = escrowAccounts.reduce((sum, account) => {
    return sum + parseFloat(account.balance);
  }, 0);
  const escrowBalance = `$${totalEscrowBalance.toLocaleString()}`;

  // Get upcoming payments (pending or scheduled)
  const upcomingPayments = payments
    .filter(p => p.status === 'pending' || p.status === 'scheduled')
    .sort((a, b) => {
      const dateA = a.payment_date ? new Date(a.payment_date).getTime() : 0;
      const dateB = b.payment_date ? new Date(b.payment_date).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 5)
    .map(p => ({
      title: p.description || `${p.payment_type} payment`,
      date: p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
      amount: `$${parseFloat(p.amount).toLocaleString()}`,
      status: p.status
    }));
  
  // All transactions from API payments
  const paymentHistory = payments
    .sort((a, b) => {
      const dateA = a.payment_date ? new Date(a.payment_date).getTime() : new Date(a.created_at).getTime();
      const dateB = b.payment_date ? new Date(b.payment_date).getTime() : new Date(b.created_at).getTime();
      return dateB - dateA; // Newest first
    })
    .map(p => ({
      id: p.id,
      date: p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: p.description || `${p.payment_type} payment`,
      category: p.payment_type === 'milestone' ? 'Milestone Payment' : p.payment_type === 'reimbursement' ? 'Reimbursement' : p.payment_type === 'deposit' ? 'Deposit' : 'Payment',
      amount: `$${parseFloat(p.amount).toLocaleString()}`,
      status: p.status,
      payment: p // Keep reference to original payment for status updates
    }));

  const filteredTransactions = transactionFilter === 'all' 
    ? paymentHistory 
    : paymentHistory.filter(t => {
        if (transactionFilter === 'milestones') return t.category === 'Milestone Payment';
        if (transactionFilter === 'reimbursements') return t.category === 'Reimbursement';
        if (transactionFilter === 'deposits') return t.category === 'Deposit';
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
              <Logo />
              <span className="text-gray-900">TBA Surrogacy Escrow</span>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate('payments')}
                className="text-primary"
              >
                Payments
              </button>
              <button 
                onClick={() => onNavigate('milestones')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Milestones
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
                  <button onClick={onBack} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
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
            {/* Section 1 - Escrow Balance Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
                <h2 className="text-gray-900">Current Escrow Balance</h2>
              </div>
              {loading ? (
                <p className="text-gray-500 text-sm">Loading balance...</p>
              ) : error ? (
                <p className="text-red-600 text-sm">Error loading balance: {error}</p>
              ) : (
                <>
                  <p className="text-gray-900 text-4xl mb-2">{escrowBalance}</p>
                  <p className="text-gray-500 text-sm mb-3">Updated in real time</p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Contract confirmed — automated payments enabled.</span>
                  </div>
                </>
              )}
            </div>

            {/* Section 2 - Upcoming Payments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Upcoming Payments</h3>
              {loading && upcomingPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Loading upcoming payments...</div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  Error loading payments: {error}
                </div>
              ) : upcomingPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No upcoming payments</div>
              ) : (
                <>
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
                  <button 
                    onClick={() => onNavigate('milestones')}
                    className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View All Milestones
                  </button>
                </>
              )}
            </div>

            {/* Section 4 - Full Transaction History */}
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
                    <option value="deposits">Deposits</option>
                  </select>
                </div>
              </div>
              
              {loading && filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Loading transaction history...</div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  Error loading transactions: {error}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No transactions found</div>
              ) : (
                <>
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
                        {filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-100">
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
                </>
              )}
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