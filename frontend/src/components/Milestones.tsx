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
  Circle,
  CheckCircle2,
  FileCheck,
  Pill,
  Heart,
  Baby,
  Home,
  ChevronRight,
  Users
} from 'lucide-react';
import logo from 'figma:asset/772aa6854dfe11f4288b7a955fea018059bbad2d.png';
import { getMilestoneById } from '../data/milestoneData';

interface MilestonesProps {
  onBack: () => void;
  onNavigate: (page: 'dashboard' | 'payments' | 'milestones') => void;
}

export function Milestones({ onBack, onNavigate }: MilestonesProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCompletedMilestones, setShowCompletedMilestones] = useState(false);

  // Mock data for journey stages
  const milestoneStages = [
    { name: 'Matching', icon: Users, status: 'completed' },
    { name: 'Legal & Medical', icon: FileText, status: 'completed' },
    { name: 'Medications', icon: Pill, status: 'completed' },
    { name: 'Pregnancy Confirmation', icon: Heart, status: 'completed' },
    { name: 'Monthly Compensation', icon: Baby, status: 'current' },
    { name: 'Delivery', icon: Home, status: 'upcoming' },
  ];

  // Pull milestones from database
  const heartbeatMilestone = getMilestoneById('B2');
  const monthlyCompMilestone = getMilestoneById('C1');
  const clothingMilestone = getMilestoneById('F1');
  const deliveryMilestone = getMilestoneById('D1');
  
  // Mock data for milestone payment schedule - using database
  const upcomingMilestones = [
    {
      name: heartbeatMilestone?.name || 'Heartbeat Confirmation',
      amount: '$7,500',
      reference: heartbeatMilestone?.contractClause || 'Section 4.3',
      status: 'Triggered',
      condition: heartbeatMilestone?.documentsRequired.join(', ') || 'Pending medical confirmation from clinic',
      date: 'Expected Dec 10, 2025',
      milestoneId: 'B2'
    },
    {
      name: monthlyCompMilestone?.name || 'Monthly Base Compensation',
      amount: '$5,000',
      reference: monthlyCompMilestone?.contractClause || 'Section 4.4',
      status: 'Upcoming',
      condition: monthlyCompMilestone?.ipPerspective[0] || 'Ongoing monthly payments',
      date: 'Projected Jan 1, 2026',
      milestoneId: 'C1'
    },
    {
      name: clothingMilestone?.name || 'Maternity Clothing Allowance',
      amount: '$1,000',
      reference: clothingMilestone?.contractClause || 'Section 4.5',
      status: 'Upcoming',
      condition: clothingMilestone?.ipPerspective[0] || 'Upon submission of receipts',
      date: 'Projected Feb 5, 2026',
      milestoneId: 'F1'
    },
    {
      name: deliveryMilestone?.name || 'Delivery / Birth',
      amount: '$15,000',
      reference: deliveryMilestone?.contractClause || 'Section 5.1',
      status: 'Upcoming',
      condition: deliveryMilestone?.documentsRequired.join(', ') || 'Upon successful delivery',
      date: 'Projected Jul 15, 2026',
      milestoneId: 'D1'
    },
  ];

  // Pull completed milestones from database
  const embryoTransferMilestone = getMilestoneById('A5');
  const legalClearanceMilestone = getMilestoneById('A2');
  
  const completedMilestones = [
    {
      name: embryoTransferMilestone?.name || 'Embryo Transfer',
      amount: '$1,500',
      reference: embryoTransferMilestone?.contractClause || 'Section 4.2',
      datePaid: 'Nov 15, 2025',
      milestoneId: 'A5'
    },
    {
      name: legalClearanceMilestone?.name || 'Legal Clearance Payment',
      amount: '$1,000',
      reference: legalClearanceMilestone?.contractClause || 'Section 3.2',
      datePaid: 'Oct 1, 2025',
      milestoneId: 'A2'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'triggered':
      case 'pending confirmation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStageStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-600';
      case 'current':
        return 'bg-primary border-primary';
      case 'upcoming':
        return 'bg-gray-200 border-gray-300';
      default:
        return 'bg-gray-200 border-gray-300';
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
                onClick={() => onNavigate('dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
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
                className="text-primary"
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
          <h1 className="text-gray-900 mb-2">Milestones</h1>
          <p className="text-gray-600">Your contract-defined payment schedule and progress.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Section 1 - Journey Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-6">Journey Overview</h3>
              
              {/* Horizontal Progress Indicator */}
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" style={{ width: 'calc(100% - 48px)', marginLeft: '24px' }}>
                  <div className="h-full bg-green-500" style={{ width: '42%' }}></div>
                </div>

                {/* Stages */}
                <div className="relative flex items-start justify-between">
                  {milestoneStages.map((stage, index) => {
                    const Icon = stage.icon;
                    return (
                      <div key={index} className="flex flex-col items-center" style={{ width: '80px' }}>
                        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 bg-white ${getStageStatus(stage.status)}`}>
                          {stage.status === 'completed' ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <Icon className={`w-6 h-6 ${stage.status === 'current' ? 'text-white' : 'text-gray-400'}`} />
                          )}
                        </div>
                        <span className={`text-xs text-center ${stage.status === 'current' ? 'text-gray-900' : 'text-gray-600'}`}>
                          {stage.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section 2 - Milestone Payment Schedule */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Milestone Payment Schedule</h3>
              <div className="space-y-4">
                {upcomingMilestones.map((milestone, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-gray-900">{milestone.name}</h4>
                          <span className={`inline-block px-2 py-1 rounded text-xs border ${getStatusColor(milestone.status)}`}>
                            {milestone.status}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm">Contract Reference: {milestone.reference}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">{milestone.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="flex-1">
                        <p className="text-gray-600 mb-1">
                          <span className="text-gray-700">Trigger: </span>
                          {milestone.condition}
                        </p>
                        <p className="text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {milestone.date}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 - Completed Milestones */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                onClick={() => setShowCompletedMilestones(!showCompletedMilestones)}
                className="flex items-center justify-between w-full mb-4"
              >
                <h3 className="text-gray-900">Completed Milestones ({completedMilestones.length})</h3>
                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showCompletedMilestones ? 'rotate-180' : ''}`} />
              </button>
              
              {showCompletedMilestones && (
                <>
                  <div className="space-y-3 mb-4">
                    {completedMilestones.map((milestone, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg opacity-75">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <h4 className="text-gray-900">{milestone.name}</h4>
                            </div>
                            <p className="text-gray-500 text-sm">Contract Reference: {milestone.reference}</p>
                            <p className="text-gray-600 text-sm mt-1">Paid on {milestone.datePaid}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900">{milestone.amount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => onNavigate('payments')}
                    className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View All Transactions
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
              <p className="text-gray-600 text-sm mb-4">Search your contract for rules about milestone payments.</p>
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
                    <p className="text-gray-900 text-sm">Pregnancy Confirmation payment projected</p>
                    <p className="text-gray-500 text-xs">Feb 3, 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm">Trimester 1 payment projected</p>
                    <p className="text-gray-500 text-xs">Apr 15, 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm">Medical documentation required</p>
                    <p className="text-gray-500 text-xs">Dec 10, 2025</p>
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