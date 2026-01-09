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
  Circle,
  CheckCircle2,
  FileCheck,
  Pill,
  Heart,
  Baby,
  Home,
  ChevronRight,
  Users,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from './Logo';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMilestones, completeMilestone, uploadMilestoneDocument, updateMilestoneStatus } from '../store/slices/milestonesSlice';
import { logout } from '../store/slices/userSlice';

interface MilestonesProps {
  onBack: () => void;
  onNavigate: (page: 'dashboard' | 'payments' | 'milestones') => void;
}

export function Milestones({ onBack, onNavigate }: MilestonesProps) {
  const dispatch = useAppDispatch();
  const { milestones, loading, error } = useAppSelector((state) => state.milestones);
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCompletedMilestones, setShowCompletedMilestones] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  // Fetch milestones on mount
  useEffect(() => {
    dispatch(fetchMilestones());
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load milestones: ${error}`);
    }
  }, [error]);

  // Separate milestones by status
  const upcomingMilestones = milestones
    .filter(m => m.status === 'pending' || m.status === 'in_progress')
    .sort((a, b) => {
      const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
      const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
      return dateA - dateB;
    })
    .map(m => ({
      id: m.id,
      name: m.title,
      amount: `$${parseFloat(m.amount).toLocaleString()}`,
      reference: `Milestone #${m.id}`,
      status: m.status === 'pending' ? 'Upcoming' : m.status === 'in_progress' ? 'Triggered' : 'Upcoming',
      condition: m.description || 'Pending completion',
      date: m.due_date ? `Expected ${new Date(m.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'TBD',
      milestone: m
    }));

  const completedMilestones = milestones
    .filter(m => m.status === 'completed')
    .sort((a, b) => {
      const dateA = a.completed_date ? new Date(a.completed_date).getTime() : 0;
      const dateB = b.completed_date ? new Date(b.completed_date).getTime() : 0;
      return dateB - dateA; // Newest first
    })
    .map(m => ({
      id: m.id,
      name: m.title,
      amount: `$${parseFloat(m.amount).toLocaleString()}`,
      reference: `Milestone #${m.id}`,
      datePaid: m.completed_date ? new Date(m.completed_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      milestone: m
    }));

  // Calculate journey progress based on milestones
  const completedCount = completedMilestones.length;
  const totalCount = milestones.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Mock data for journey stages (could be enhanced with real milestone data)
  const milestoneStages = [
    { name: 'Matching', icon: Users, status: completedCount > 0 ? 'completed' : 'upcoming' },
    { name: 'Legal & Medical', icon: FileText, status: completedCount > 1 ? 'completed' : completedCount > 0 ? 'current' : 'upcoming' },
    { name: 'Medications', icon: Pill, status: completedCount > 2 ? 'completed' : completedCount > 1 ? 'current' : 'upcoming' },
    { name: 'Pregnancy Confirmation', icon: Heart, status: completedCount > 3 ? 'completed' : completedCount > 2 ? 'current' : 'upcoming' },
    { name: 'Monthly Compensation', icon: Baby, status: completedCount > 4 ? 'completed' : completedCount > 3 ? 'current' : 'upcoming' },
    { name: 'Delivery', icon: Home, status: completedCount > 5 ? 'completed' : completedCount > 4 ? 'current' : 'upcoming' },
  ];

  const handleCompleteMilestone = async (milestoneId: number) => {
    const result = await dispatch(completeMilestone({ id: milestoneId, completion_notes: '' }));
    if (completeMilestone.fulfilled.match(result)) {
      toast.success('Milestone marked as complete');
      // Refresh milestones list
      dispatch(fetchMilestones());
    } else if (completeMilestone.rejected.match(result)) {
      const errorMessage = result.error?.message || 'Failed to complete milestone';
      toast.error(errorMessage);
    }
  };

  const handleUploadDocument = async (milestoneId: number, file: File) => {
    setUploadingDocument(true);
    const result = await dispatch(uploadMilestoneDocument({
      milestoneId,
      title: file.name,
      file
    }));
    setUploadingDocument(false);
    if (uploadMilestoneDocument.fulfilled.match(result)) {
      toast.success('Document uploaded successfully');
      setSelectedMilestone(null);
      // Refresh milestones list
      dispatch(fetchMilestones());
    } else if (uploadMilestoneDocument.rejected.match(result)) {
      const errorMessage = result.error?.message || 'Failed to upload document';
      toast.error(errorMessage);
    }
  };

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
          <h1 className="text-gray-900 mb-2">Milestones</h1>
          <p className="text-gray-600">Your contract-defined payment schedule and progress.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Section 1 - Journey Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-6">Journey Overview</h3>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading milestones...</div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  Error loading milestones: {error}
                </div>
              ) : (
                <>
                  {/* Horizontal Progress Indicator */}
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" style={{ width: 'calc(100% - 48px)', marginLeft: '24px' }}>
                      <div className="h-full bg-green-500" style={{ width: `${progressPercentage}%` }}></div>
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
              <div className="mt-4 text-center text-sm text-gray-600">
                {completedCount} of {totalCount} milestones completed ({Math.round(progressPercentage)}%)
              </div>
                </>
              )}
            </div>

            {/* Section 2 - Milestone Payment Schedule */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Milestone Payment Schedule</h3>
              {loading && upcomingMilestones.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Loading upcoming milestones...</div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  Error loading milestones: {error}
                </div>
              ) : upcomingMilestones.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No upcoming milestones</div>
              ) : (
                <div className="space-y-4">
                  {upcomingMilestones.map((milestone) => (
                    <div key={milestone.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
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
                      {milestone.milestone.status === 'in_progress' && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleCompleteMilestone(milestone.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Mark as Complete
                          </button>
                          <label className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleUploadDocument(milestone.id, e.target.files[0]);
                                }
                              }}
                              disabled={uploadingDocument}
                            />
                            {uploadingDocument ? 'Uploading...' : 'Upload Document'}
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                  {loading && completedMilestones.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Loading completed milestones...</div>
                  ) : completedMilestones.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No completed milestones yet</div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {completedMilestones.map((milestone) => (
                          <div key={milestone.id} className="p-4 bg-gray-50 rounded-lg opacity-75">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <h4 className="text-gray-900">{milestone.name}</h4>
                                </div>
                                <p className="text-gray-500 text-sm">Contract Reference: {milestone.reference}</p>
                                <p className="text-gray-600 text-sm mt-1">Completed on {milestone.datePaid}</p>
                                {milestone.milestone.completion_notes && (
                                  <p className="text-gray-600 text-sm mt-1 italic">{milestone.milestone.completion_notes}</p>
                                )}
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
            <p className="text-gray-500 text-sm">© 2025 TBA Surrogacy Escrow</p>
          </div>
        </div>
      </footer>
    </div>
  );
}