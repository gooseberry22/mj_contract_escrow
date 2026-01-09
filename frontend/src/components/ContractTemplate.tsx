import { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle,
  DollarSign, 
  FileText, 
  Calendar,
  Shield,
  Edit2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  User
} from 'lucide-react';
import logo from 'figma:asset/772aa6854dfe11f4288b7a955fea018059bbad2d.png';
import { MILESTONE_DATABASE } from '../data/milestoneData';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/userSlice';

interface ContractTemplateProps {
  onConfirm?: () => void;
  onBack: () => void;
  onNavigate?: (page: string) => void;
  userType?: 'ip' | 'surrogate';
  mode?: 'onboarding' | 'dashboard';
}

export function ContractTemplate({ onConfirm, onBack, onNavigate, userType = 'ip', mode = 'onboarding' }: ContractTemplateProps) {
  const dispatch = useAppDispatch();
  const [showMilestoneDetails, setShowMilestoneDetails] = useState<string[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleMilestoneDetails = (milestoneId: string) => {
    setShowMilestoneDetails(prev =>
      prev.includes(milestoneId)
        ? prev.filter(id => id !== milestoneId)
        : [...prev, milestoneId]
    );
  };

  // Navigation items based on user type
  const navigationItems = userType === 'ip' 
    ? [
        { label: 'Dashboard', page: 'dashboard' },
        { label: 'Payments', page: 'payments' },
        { label: 'Contract', page: 'milestones', active: true },
        { label: 'Support', page: 'support' }
      ]
    : [
        { label: 'Dashboard', page: 'surrogate-dashboard' },
        { label: 'Payments', page: 'surrogate-payments' },
        { label: 'Contract', page: 'milestones', active: true },
        { label: 'Lost Wages', page: 'surrogate-lost-wages' },
        { label: 'Support', page: 'support' }
      ];

  // Group milestones by category
  const milestonesByCategory = MILESTONE_DATABASE.reduce((acc, milestone) => {
    if (!acc[milestone.category]) {
      acc[milestone.category] = [];
    }
    acc[milestone.category].push(milestone);
    return acc;
  }, {} as Record<string, typeof MILESTONE_DATABASE>);

  // Calculate total compensation
  const calculateTotal = () => {
    // Mock calculation - in reality this would parse the amounts
    return '$45,000';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={logo} alt="The Biggest Ask" className="h-10 w-10" />
              <span className="text-gray-900">The Biggest Ask</span>
            </button>

            {/* Show navigation if in dashboard mode */}
            {mode === 'dashboard' && onNavigate ? (
              <>
                <nav className="hidden md:flex items-center gap-8">
                  {navigationItems.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => !item.active && onNavigate(item.page)}
                      className={item.active ? 'text-primary' : 'text-gray-600 hover:text-gray-900 transition-colors'}
                    >
                      {item.label}
                    </button>
                  ))}
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
              </>
            ) : (
              /* Show confirmation badge if in onboarding mode */
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-sm">Contract Analysis Complete</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-2">Review Your Contract Terms</h1>
              <p className="text-gray-600">
                We've analyzed your contract and extracted the key terms below. Please review and confirm everything is accurate.
              </p>
            </div>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm & Continue
            </button>
          </div>

          {/* AI Confidence Banner */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-green-900 mb-1">High Confidence Analysis</h3>
              <p className="text-green-700 text-sm">
                We found all major contract sections and extracted payment terms with 98% confidence. Review the details below and make any necessary adjustments.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Contract Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Contract Summary</h2>
                <button className="flex items-center gap-2 text-secondary hover:underline text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-gray-600 text-sm">Total Compensation</span>
                  </div>
                  <p className="text-gray-900 text-2xl">{calculateTotal()}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-secondary" />
                    <span className="text-gray-600 text-sm">Contract Date</span>
                  </div>
                  <p className="text-gray-900">October 1, 2025</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-accent" />
                    <span className="text-gray-600 text-sm">Surrogacy friendly insurance</span>
                  </div>
                  <p className="text-gray-900">Yes</p>
                </div>
              </div>
            </div>

            {/* Parties */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Parties</h2>
                <button className="flex items-center gap-2 text-secondary hover:underline text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-900 mb-3">Intended Parents</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600"><strong>Names:</strong> Sarah Johnson & John Johnson</p>
                    <p className="text-gray-600"><strong>Email:</strong> sarah.john@email.com</p>
                    <p className="text-gray-600"><strong>Phone:</strong> (555) 123-4567</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-900 mb-3">Gestational Carrier</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600"><strong>Name:</strong> Emily Rodriguez</p>
                    <p className="text-gray-600"><strong>Email:</strong> emily.r@email.com</p>
                    <p className="text-gray-600"><strong>Phone:</strong> (555) 987-6543</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone Payments by Category */}
            {Object.entries(milestonesByCategory).map(([category, milestones]) => (
              <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-gray-900">{category}</h2>
                    <p className="text-gray-600 text-sm">{milestones.length} milestones</p>
                  </div>
                  <button className="flex items-center gap-2 text-secondary hover:underline text-sm">
                    <Edit2 className="w-4 h-4" />
                    Edit Category
                  </button>
                </div>

                <div className="space-y-3">
                  {milestones.map((milestone) => {
                    const isExpanded = showMilestoneDetails.includes(milestone.id);
                    
                    return (
                      <div key={milestone.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleMilestoneDetails(milestone.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-4 flex-1 text-left">
                            <span className="inline-block px-2 py-1 bg-secondary/10 text-secondary rounded text-xs font-mono">
                              {milestone.id}
                            </span>
                            <div className="flex-1">
                              <h4 className="text-gray-900 mb-1">{milestone.name}</h4>
                              <p className="text-gray-600 text-sm">{milestone.timing}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-900">{milestone.typicalAmount}</p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 ml-4" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 ml-4" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                            {/* IP Perspective */}
                            <div>
                              <h5 className="text-gray-900 text-sm mb-2">Intended Parents Responsibilities:</h5>
                              <ul className="list-disc list-inside space-y-1">
                                {milestone.ipPerspective.map((item, idx) => (
                                  <li key={idx} className="text-gray-600 text-sm">{item}</li>
                                ))}
                              </ul>
                            </div>

                            {/* GC Perspective */}
                            <div>
                              <h5 className="text-gray-900 text-sm mb-2">Surrogate Receives:</h5>
                              <ul className="list-disc list-inside space-y-1">
                                {milestone.gcPerspective.map((item, idx) => (
                                  <li key={idx} className="text-gray-600 text-sm">{item}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Documents Required */}
                            <div>
                              <h5 className="text-gray-900 text-sm mb-2">Documents Required:</h5>
                              <ul className="list-disc list-inside space-y-1">
                                {milestone.documentsRequired.map((doc, idx) => (
                                  <li key={idx} className="text-gray-600 text-sm">{doc}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Contract Reference */}
                            <div className="pt-3 border-t border-gray-200">
                              <p className="text-gray-500 text-xs">
                                <strong>Contract Reference:</strong> {milestone.contractClause}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Insurance Requirements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Insurance Requirements</h2>
                <button className="flex items-center gap-2 text-secondary hover:underline text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Health Insurance</h4>
                    <p className="text-gray-600 text-sm">Coverage required throughout pregnancy. Premium reimbursement up to $500/month.</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Life Insurance</h4>
                    <p className="text-gray-600 text-sm">$250,000 policy required. Premium covered by Intended Parents.</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Reimbursement Terms */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Reimbursement Terms</h2>
                <button className="flex items-center gap-2 text-secondary hover:underline text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Medical Expenses</h4>
                    <p className="text-gray-600 text-sm">All pregnancy-related medical expenses not covered by insurance</p>
                  </div>
                  <span className="text-gray-900">100%</span>
                </div>

                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Travel & Mileage</h4>
                    <p className="text-gray-600 text-sm">$0.50 per mile for medical appointments beyond 50 miles</p>
                  </div>
                  <span className="text-gray-900">$0.50/mi</span>
                </div>

                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Childcare</h4>
                    <p className="text-gray-600 text-sm">Up to $50 per appointment for childcare during medical visits</p>
                  </div>
                  <span className="text-gray-900">$50/visit</span>
                </div>

                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Lost Wages</h4>
                    <p className="text-gray-600 text-sm">Documented lost wages due to medical appointments or bed rest</p>
                  </div>
                  <span className="text-gray-900">As incurred</span>
                </div>

                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-gray-900 mb-1">Maternity Clothing</h4>
                    <p className="text-gray-600 text-sm">Allowance for maternity clothing</p>
                  </div>
                  <span className="text-gray-900">$1,000</span>
                </div>
              </div>
            </div>

            {/* Additional Terms */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Additional Terms</h2>
                <button className="flex items-center gap-2 text-secondary hover:underline text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-gray-900 mb-1">Multiple Birth Bonus</h4>
                  <p className="text-gray-600">$5,000 per additional fetus if twins or multiples</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-gray-900 mb-1">C-Section Fee</h4>
                  <p className="text-gray-600">$2,500 additional if delivery is via C-section</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-gray-900 mb-1">Invasive Procedures</h4>
                  <p className="text-gray-600">$500 per amniocentesis or other invasive procedure</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-gray-900 mb-1">Monthly Allowance</h4>
                  <p className="text-gray-600">$250/month for miscellaneous pregnancy-related expenses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Action Required */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="text-gray-900">Action Required</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Please review all contract terms carefully. Once confirmed, these will be used to automate your payment schedule.
              </p>
              <button
                onClick={onConfirm}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Confirm Terms
              </button>
            </div>

            {/* Confidence Score */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-gray-900">AI Confidence</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 text-sm">Milestone Payments</span>
                    <span className="text-green-600 text-sm">99%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '99%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 text-sm">Reimbursement Terms</span>
                    <span className="text-green-600 text-sm">97%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '97%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 text-sm">Insurance Requirements</span>
                    <span className="text-green-600 text-sm">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 text-sm">Party Information</span>
                    <span className="text-green-600 text-sm">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-secondary" />
                <h3 className="text-gray-900">Need Help?</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                If something doesn't look right, you can edit any section or contact our support team.
              </p>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                Contact Support
              </button>
            </div>

            {/* Original Document */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-secondary" />
                <h3 className="text-gray-900">Original Document</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                View or download your original contract
              </p>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                View Contract PDF
              </button>
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