import { useState } from 'react';
import { Search, AlertCircle, ArrowLeft, FileText, DollarSign, Edit2, Save, Upload, Download, ZoomIn, ZoomOut, Eye, Check, X, Paperclip } from 'lucide-react';
import { Logo } from '../header/Logo';

interface Journey {
  id: string;
  ip_names: string;
  gc_name: string;
  status: 'Onboarding' | 'Funded' | 'Cycling' | 'Pregnant' | 'Postpartum' | 'Closed';
  contract_date: string;
  bank_status: 'Connected' | 'Pending' | 'Not Connected';
  escrow_balance: number;
  open_issues: number;
  last_activity: string;
  gc_state: string;
  ip_state: string;
  team_member: string;
}

interface ContractTerms {
  base_compensation: string;
  installment_schedule: string;
  transfer_fee: string;
  cycle_cancellation_fee: string;
  multiples_bonus: string;
  c_section_bonus: string;
  monthly_allowance: string;
  maternity_clothes: string;
  lost_wages_rules: string;
  category_caps: string;
  other_bonuses: string;
}

interface Reimbursement {
  id: string;
  date_submitted: string;
  category: string;
  description: string;
  amount_requested: number;
  amount_approved: number;
  status: 'Pending' | 'Approved' | 'Denied' | 'Needs Info';
  flags: string[];
  gc_notes: string;
  receipts: string[];
  admin_files: string[];
}

interface EscrowAdminConsoleProps {
  onBack: () => void;
}

export function EscrowAdminConsole({ onBack }: EscrowAdminConsoleProps) {
  const [view, setView] = useState<'list' | 'contract' | 'reimbursements'>('list');
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [editingTerms, setEditingTerms] = useState(false);
  
  const teamMembers = ['Ashley O', 'Terra C', 'Jade P', 'Bri E', 'MJ C'];
  
  // Mock journey data
  const [journeys, setJourneys] = useState<Journey[]>([
    {
      id: 'JRN-2024-001',
      ip_names: 'Sarah & Michael Thompson',
      gc_name: 'Maria Rodriguez',
      status: 'Pregnant',
      contract_date: '2024-11-15',
      bank_status: 'Connected',
      escrow_balance: 48500,
      open_issues: 0,
      last_activity: '2 hours ago',
      gc_state: 'CA',
      ip_state: 'NY',
      team_member: 'Ashley O'
    },
    {
      id: 'JRN-2024-002',
      ip_names: 'David & Jennifer Chen',
      gc_name: 'Emily Martinez',
      status: 'Cycling',
      contract_date: '2024-12-01',
      bank_status: 'Connected',
      escrow_balance: 52000,
      open_issues: 1,
      last_activity: '1 day ago',
      gc_state: 'TX',
      ip_state: 'CA',
      team_member: 'Terra C'
    },
    {
      id: 'JRN-2024-003',
      ip_names: 'Robert & Amanda Lee',
      gc_name: 'Jessica Williams',
      status: 'Funded',
      contract_date: '2024-10-20',
      bank_status: 'Pending',
      escrow_balance: 50000,
      open_issues: 2,
      last_activity: '3 days ago',
      gc_state: 'FL',
      ip_state: 'IL',
      team_member: 'Jade P'
    }
  ]);

  const [contractTerms, setContractTerms] = useState<ContractTerms>({
    base_compensation: '45000',
    installment_schedule: 'Monthly after heartbeat confirmation',
    transfer_fee: '1000',
    cycle_cancellation_fee: '500',
    multiples_bonus: '5000',
    c_section_bonus: '2500',
    monthly_allowance: '300',
    maternity_clothes: '1500',
    lost_wages_rules: 'Documented hourly rate for medical appointments',
    category_caps: 'Maternity clothes: $300/month max $1500 total',
    other_bonuses: 'Breastmilk pumping: $250/week for 6 weeks'
  });

  // Mock reimbursements data
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([
    {
      id: 'REIMB-001',
      date_submitted: '2024-12-01',
      category: 'Medical Expenses',
      description: 'OB-GYN appointment co-pay',
      amount_requested: 45.00,
      amount_approved: 45.00,
      status: 'Approved',
      flags: [],
      gc_notes: 'Monthly checkup at Dr. Smith\'s office',
      receipts: ['receipt-001.pdf'],
      admin_files: []
    },
    {
      id: 'REIMB-002',
      date_submitted: '2024-12-03',
      category: 'Maternity Clothes',
      description: 'Maternity pants and tops for work',
      amount_requested: 450.00,
      amount_approved: 0,
      status: 'Pending',
      flags: ['Exceeds monthly cap'],
      gc_notes: 'Needed professional maternity clothes for my job as I\'m starting to show. Bought 3 pairs of pants and 4 tops from Motherhood Maternity.',
      receipts: ['receipt-002.pdf', 'receipt-003.pdf'],
      admin_files: []
    },
    {
      id: 'REIMB-003',
      date_submitted: '2024-11-28',
      category: 'Lost Wages',
      description: 'Missed work for embryo transfer',
      amount_requested: 280.00,
      amount_approved: 280.00,
      status: 'Approved',
      flags: [],
      gc_notes: 'Had to take full day off work for the transfer procedure. Attached pay stub showing hourly rate.',
      receipts: ['paystub-nov.pdf', 'transfer-appointment.pdf'],
      admin_files: []
    },
    {
      id: 'REIMB-004',
      date_submitted: '2024-12-05',
      category: 'Vitamins & Supplements',
      description: 'Prenatal vitamins (3-month supply)',
      amount_requested: 65.00,
      amount_approved: 0,
      status: 'Needs Info',
      flags: ['Need prescription'],
      gc_notes: 'Bought prenatal vitamins at CVS as recommended by my doctor.',
      receipts: ['cvs-receipt.pdf'],
      admin_files: []
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pregnant': return 'bg-green-100 text-green-800';
      case 'Cycling': return 'bg-blue-100 text-blue-800';
      case 'Funded': return 'bg-yellow-100 text-yellow-800';
      case 'Onboarding': return 'bg-gray-100 text-gray-800';
      case 'Postpartum': return 'bg-purple-100 text-purple-800';
      case 'Closed': return 'bg-gray-100 text-gray-600';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Denied': return 'bg-red-100 text-red-800';
      case 'Needs Info': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJourneys = journeys.filter(journey => {
    const matchesSearch = searchQuery === '' || 
      journey.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.ip_names.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.gc_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(journey.status);
    
    return matchesSearch && matchesStatus;
  });

  const handleViewContract = (journey: Journey) => {
    setSelectedJourney(journey);
    setView('contract');
  };

  const handleViewReimbursements = (journey: Journey) => {
    setSelectedJourney(journey);
    setView('reimbursements');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedJourney(null);
    setEditingTerms(false);
  };

  const handleUpdateAmount = (id: string, newAmount: number) => {
    setReimbursements(reimbursements.map(r => 
      r.id === id ? { ...r, amount_approved: newAmount } : r
    ));
  };

  // Journey List View
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo className="h-10 w-10" />
                <div className="flex flex-col items-start">
                  <span className="text-gray-900">TBA Surrogacy Escrow</span>
                  <span className="text-xs text-white bg-red-600 px-2 py-0.5 rounded">Admin Console</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={onBack}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Exit Admin
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">AD</span>
                  </div>
                  <span className="text-gray-700 text-sm">Admin User</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">Journeys</h1>
            <p className="text-gray-600">Manage all surrogacy journeys and escrow accounts</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Journey ID, Intended Parent name, or Gestational Carrier name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-600 text-sm">Filters:</span>
              {['Onboarding', 'Funded', 'Cycling', 'Pregnant', 'Postpartum', 'Closed'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    if (statusFilter.includes(status)) {
                      setStatusFilter(statusFilter.filter(s => s !== status));
                    } else {
                      setStatusFilter([...statusFilter, status]);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    statusFilter.includes(status)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Journey ID</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Intended Parents</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Gestational Carrier</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Team Member</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Contract Date</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Bank Status</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Escrow Balance</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Open Issues</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Last Activity</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJourneys.map(journey => (
                    <tr 
                      key={journey.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-primary">{journey.id}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{journey.ip_names}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{journey.gc_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={journey.team_member}
                          onChange={(e) => {
                            setJourneys(journeys.map(j => 
                              j.id === journey.id ? { ...j, team_member: e.target.value } : j
                            ));
                          }}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                        >
                          {teamMembers.map(member => (
                            <option key={member} value={member}>{member}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(journey.status)}`}>
                          {journey.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                        {new Date(journey.contract_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${
                          journey.bank_status === 'Connected' ? 'text-green-600' : 
                          journey.bank_status === 'Pending' ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {journey.bank_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        ${journey.escrow_balance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {journey.open_issues > 0 ? (
                          <span className="flex items-center gap-1 text-orange-600">
                            <AlertCircle className="w-4 h-4" />
                            {journey.open_issues}
                          </span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">{journey.last_activity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewContract(journey)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            Contract
                          </button>
                          <button
                            onClick={() => handleViewReimbursements(journey)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            Reimbursements
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Contract Terms View (Admin-Editable)
  if (view === 'contract' && selectedJourney) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo />
                <div className="flex flex-col items-start">
                  <span className="text-gray-900">TBA Surrogacy Escrow</span>
                  <span className="text-xs text-white bg-red-600 px-2 py-0.5 rounded">Admin Console</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToList}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Journeys
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">AD</span>
                  </div>
                  <span className="text-gray-700 text-sm">Admin User</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Journey Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1600px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 mb-1">{selectedJourney.id} - Contract Terms</h1>
                <p className="text-gray-600">
                  {selectedJourney.ip_names} & {selectedJourney.gc_name}
                </p>
              </div>
              {!editingTerms && (
                <button
                  onClick={() => setEditingTerms(true)}
                  className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Terms
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Side - Contract Terms */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-gray-900 mb-6">Contract Terms</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-2">Base Compensation</label>
                  {editingTerms ? (
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={contractTerms.base_compensation}
                        onChange={(e) => setContractTerms({...contractTerms, base_compensation: e.target.value})}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">${parseInt(contractTerms.base_compensation).toLocaleString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">Installment Schedule</label>
                  {editingTerms ? (
                    <input
                      type="text"
                      value={contractTerms.installment_schedule}
                      onChange={(e) => setContractTerms({...contractTerms, installment_schedule: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ) : (
                    <p className="text-gray-900">{contractTerms.installment_schedule}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">Transfer Fee</label>
                  {editingTerms ? (
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={contractTerms.transfer_fee}
                        onChange={(e) => setContractTerms({...contractTerms, transfer_fee: e.target.value})}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">${parseInt(contractTerms.transfer_fee).toLocaleString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">Cycle Cancellation Fee</label>
                  {editingTerms ? (
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={contractTerms.cycle_cancellation_fee}
                        onChange={(e) => setContractTerms({...contractTerms, cycle_cancellation_fee: e.target.value})}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">${parseInt(contractTerms.cycle_cancellation_fee).toLocaleString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">Multiples Bonus</label>
                  {editingTerms ? (
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={contractTerms.multiples_bonus}
                        onChange={(e) => setContractTerms({...contractTerms, multiples_bonus: e.target.value})}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">${parseInt(contractTerms.multiples_bonus).toLocaleString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">C-Section Bonus</label>
                  {editingTerms ? (
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={contractTerms.c_section_bonus}
                        onChange={(e) => setContractTerms({...contractTerms, c_section_bonus: e.target.value})}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">${parseInt(contractTerms.c_section_bonus).toLocaleString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">Monthly Allowance</label>
                  {editingTerms ? (
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={contractTerms.monthly_allowance}
                        onChange={(e) => setContractTerms({...contractTerms, monthly_allowance: e.target.value})}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">${parseInt(contractTerms.monthly_allowance).toLocaleString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">Maternity Clothes Budget</label>
                  {editingTerms ? (
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={contractTerms.maternity_clothes}
                        onChange={(e) => setContractTerms({...contractTerms, maternity_clothes: e.target.value})}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900">${parseInt(contractTerms.maternity_clothes).toLocaleString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">Lost Wages Rules</label>
                  {editingTerms ? (
                    <textarea
                      value={contractTerms.lost_wages_rules}
                      onChange={(e) => setContractTerms({...contractTerms, lost_wages_rules: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-900">{contractTerms.lost_wages_rules}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">Category Caps</label>
                  {editingTerms ? (
                    <textarea
                      value={contractTerms.category_caps}
                      onChange={(e) => setContractTerms({...contractTerms, category_caps: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-900">{contractTerms.category_caps}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-2">Other Bonuses</label>
                  {editingTerms ? (
                    <textarea
                      value={contractTerms.other_bonuses}
                      onChange={(e) => setContractTerms({...contractTerms, other_bonuses: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-900">{contractTerms.other_bonuses}</p>
                  )}
                </div>
              </div>

              {editingTerms && (
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setEditingTerms(false);
                      alert('Changes saved successfully!');
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingTerms(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="ml-auto px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Re-run AI Parsing
                  </button>
                </div>
              )}
            </div>

            {/* Right Side - PDF Viewer */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Original Contract</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    <ZoomOut className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    <ZoomIn className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Mock PDF Viewer */}
              <div className="border border-gray-300 rounded-lg h-[800px] bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">PDF Contract Viewer</p>
                  <p className="text-gray-500 text-sm mt-2">Original contract would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Reimbursements View (IP-style with admin edit)
  if (view === 'reimbursements' && selectedJourney) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo />
                <div className="flex flex-col items-start">
                  <span className="text-gray-900">TBA Surrogacy Escrow</span>
                  <span className="text-xs text-white bg-red-600 px-2 py-0.5 rounded">Admin Console</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToList}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Journeys
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">AD</span>
                  </div>
                  <span className="text-gray-700 text-sm">Admin User</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Journey Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1600px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-gray-900 mb-1">{selectedJourney.id} - Reimbursements</h1>
                <p className="text-gray-600">
                  {selectedJourney.ip_names} & {selectedJourney.gc_name}
                </p>
              </div>
              <button
                onClick={() => handleViewContract(selectedJourney)}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                View Contract
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-8 py-8">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-gray-600 text-sm">Filter by Status:</span>
              {['All', 'Pending', 'Approved', 'Denied', 'Needs Info'].map(status => (
                <button
                  key={status}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Reimbursements List */}
          <div className="space-y-4">
            {reimbursements.map((reimb) => (
              <div key={reimb.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{reimb.category}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(reimb.status)}`}>
                        {reimb.status}
                      </span>
                      {reimb.flags.length > 0 && (
                        <span className="flex items-center gap-1 text-orange-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {reimb.flags[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{reimb.description}</p>
                    <p className="text-gray-500 text-sm">Submitted {new Date(reimb.date_submitted).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm mb-1">Requested</p>
                    <p className="text-gray-900 text-xl">${reimb.amount_requested.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-900 text-sm">
                    <span className="text-gray-600">GC Notes:</span> {reimb.gc_notes}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-2">Attached Receipts:</p>
                  <div className="flex gap-2">
                    {reimb.receipts.map((receipt, index) => (
                      <button key={index} className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {receipt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Files Section */}
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-900 text-sm">Admin Files (IP Confirmations, Emails, etc.)</p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const fileName = e.target.files[0].name;
                            setReimbursements(reimbursements.map(r => 
                              r.id === reimb.id 
                                ? { ...r, admin_files: [...r.admin_files, fileName] }
                                : r
                            ));
                            alert(`File "${fileName}" uploaded successfully!`);
                          }
                        }}
                      />
                      <span className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        Upload File
                      </span>
                    </label>
                  </div>
                  {reimb.admin_files.length > 0 ? (
                    <div className="flex gap-2 flex-wrap">
                      {reimb.admin_files.map((file, index) => (
                        <div key={index} className="px-3 py-1 bg-white border border-blue-300 rounded text-gray-700 text-sm flex items-center gap-1.5">
                          <Paperclip className="w-3 h-3 text-blue-600" />
                          {file}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs">No admin files uploaded yet</p>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <div className="flex-1">
                    <label className="block text-gray-600 text-sm mb-2">Approved Amount (Editable)</label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={reimb.amount_approved}
                        onChange={(e) => handleUpdateAmount(reimb.id, parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return null;
}