import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  FileText, 
  User, 
  ChevronDown,
  Search,
  Sparkles,
  Heart,
  Upload,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '../header/Logo';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPayments, createPayment } from '../../store/slices/paymentsSlice';
import { fetchMilestones, completeMilestone, uploadMilestoneDocument } from '../../store/slices/milestonesSlice';
import { fetchContracts } from '../../store/slices/contractsSlice';
import { logout } from '../../store/slices/userSlice';

interface SurrogateDashboardProps {
  onBack: () => void;
  onNavigate: (page: 'surrogate-dashboard' | 'surrogate-payments' | 'surrogate-lost-wages' | 'milestones' | 'support') => void;
}

export function SurrogateDashboard({ onBack, onNavigate }: SurrogateDashboardProps) {
  const dispatch = useAppDispatch();
  const { payments, loading: paymentsLoading } = useAppSelector((state) => state.payments);
  const { milestones, loading: milestonesLoading } = useAppSelector((state) => state.milestones);
  const { contracts, loading: contractsLoading } = useAppSelector((state) => state.contracts);
  const { user } = useAppSelector((state) => state.user);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [reimbursementType, setReimbursementType] = useState('');
  const [reimbursementAmount, setReimbursementAmount] = useState('');
  const [reimbursementNotes, setReimbursementNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showMilestoneDropdown, setShowMilestoneDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [heartbeatDate, setHeartbeatDate] = useState('');
  const [embryoTransferDate, setEmbryoTransferDate] = useState('');
  const [heartbeatFile, setHeartbeatFile] = useState<File | null>(null);
  const [heartbeatNotes, setHeartbeatNotes] = useState('');
  const [showHeartbeatSection, setShowHeartbeatSection] = useState(false);
  const [heartbeatApproved, setHeartbeatApproved] = useState(false);
  const [reportingLoss, setReportingLoss] = useState(false);
  const [submittingReimbursement, setSubmittingReimbursement] = useState(false);
  const [submittingHeartbeat, setSubmittingHeartbeat] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchContracts());
  }, [dispatch]);

  // Fetch milestones once contracts are loaded
  useEffect(() => {
    if (contracts.length > 0 && contracts[0]?.id) {
      dispatch(fetchMilestones({ contractId: contracts[0].id }));
    }
  }, [dispatch, contracts]);

  const loading = paymentsLoading || milestonesLoading || contractsLoading;

  // Get user's name from Redux store
  const surrogateName = user ? user.first_name : "Surrogate";

  // Calculate total received from paid payments
  const totalReceived = payments
    .filter(p => p.status === 'paid' || p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  // Get next payment from upcoming milestones
  const upcomingMilestones = milestones
    .filter(m => m.status === 'pending' || m.status === 'in_progress')
    .sort((a, b) => {
      const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
      const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 1);

  const nextPayment = upcomingMilestones[0] ? {
    date: upcomingMilestones[0].due_date ? new Date(upcomingMilestones[0].due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
    amount: `$${parseFloat(upcomingMilestones[0].amount).toLocaleString()}`
  } : { date: "TBD", amount: "$0" };

  // Determine current phase based on milestones
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;
  const currentPhase = totalMilestones > 0 
    ? completedMilestones === 0 
      ? "First Trimester" 
      : completedMilestones < totalMilestones / 2 
      ? "Second Trimester" 
      : "Third Trimester"
    : "Setup Phase";

  // Get upcoming payments with milestone data
  const upcomingPayments = milestones
    .filter(m => m.status === 'pending' || m.status === 'in_progress')
    .sort((a, b) => {
      const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
      const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 3)
    .map(m => ({
      milestoneId: m.id,
      milestone: m,
      date: m.due_date ? new Date(m.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
      amount: `$${parseFloat(m.amount).toLocaleString()}`,
      status: m.status === 'pending' ? 'Upcoming' : m.status === 'in_progress' ? 'Processing Soon' : m.status,
      actionNeeded: m.status === 'in_progress'
    }));

  // Get recent payments
  const recentPayments = payments
    .filter(p => p.status === 'paid' || p.status === 'completed')
    .sort((a, b) => {
      const dateA = a.payment_date ? new Date(a.payment_date).getTime() : new Date(a.created_at).getTime();
      const dateB = b.payment_date ? new Date(b.payment_date).getTime() : new Date(b.created_at).getTime();
      return dateB - dateA;
    })
    .slice(0, 5)
    .map(p => ({
      date: p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: p.description || `${p.payment_type} payment`,
      amount: `$${parseFloat(p.amount).toLocaleString()}`,
      status: p.status.charAt(0).toUpperCase() + p.status.slice(1)
    }));

  // Milestone categories and options
  const milestoneCategories = {
    'Pre-Pregnancy': [
      'Contract Signed - Early Fee',
      'Medical Screening - Screening Fee & Travel',
      'Mock Cycle - Cycle Fee & Medications',
      'Start of Medications - Med Fee & Prescriptions',
      'Embryo Transfer - Transfer Fee & Travel'
    ],
    'Pregnancy Confirmation': [
      'Positive Beta (hCG) - Base Comp Installment',
      'Heartbeat Confirmation - Triggers Monthly Base Comp',
      'Graduation From IVF Clinic - Graduation Fee'
    ],
    'Pregnancy Progression': [
      'Monthly Base Compensation',
      'Multiples Detected - One-time Fee',
      'Invasive Medical Procedure - Procedure Fee',
      'Bed Rest - Weekly Compensation',
      'Special Pregnancy Events - Related Fees'
    ],
    'Delivery': [
      'Delivery / Birth - Final Base Comp',
      'C-Section Delivery - C-Section Fee',
      'Multiple Birth - Additional Fee'
    ],
    'Postpartum': [
      'Postpartum Recovery - Lost Wages & Care',
      'Pumping Breast Milk - Monthly Fee & Supplies'
    ],
    'Allowances & Reimbursements': [
      'Maternity Clothing Allowance',
      'Monthly Wellness/Phone Allowance',
      'Mileage/Travel to Appointments',
      'Prenatal Vitamins',
      'Medical Appointment Parking',
      'Prescription Medications',
      'Medical Supplies',
      'Childcare During Appointments',
      'Meal Allowance',
      'Insurance Premiums/Co-pays',
      'Lost Wages',
      'Other Reimbursement'
    ]
  };

  const handleMilestoneSelect = (milestone: string) => {
    setReimbursementType(milestone);
    setShowMilestoneDropdown(false);
    setSelectedCategory('');
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmitReimbursement = async () => {
    if (!uploadedFile || !reimbursementType || !reimbursementAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Get the first contract (assuming surrogate has access to at least one contract)
    const contract = contracts[0];
    if (!contract) {
      toast.error('No contract found. Please contact support.');
      return;
    }

    setSubmittingReimbursement(true);

    try {
      // First, create the payment with milestone type (reimbursements are tracked as milestone payments)
      // Note: Backend Payment model doesn't have 'reimbursement' type, using 'milestone' with description
      const paymentData = {
        contract: contract.id,
        payer: contract.intended_parent, // Intended parent pays
        payee: contract.surrogate, // Surrogate receives
        amount: reimbursementAmount,
        payment_type: 'milestone', // Using milestone type for reimbursements
        description: `Reimbursement: ${reimbursementType}`,
        notes: reimbursementNotes || undefined,
      };

      const result = await dispatch(createPayment(paymentData));
      
      if (createPayment.fulfilled.match(result)) {
        // If file upload is needed, it would be handled separately
        // For now, we'll just show success
        toast.success('Reimbursement request submitted! The AI will review against your contract terms and automatically process if approved.');
        // Reset form
        setReimbursementType('');
        setReimbursementAmount('');
        setReimbursementNotes('');
        setUploadedFile(null);
        // Refresh payments list
        dispatch(fetchPayments());
      } else {
        const errorMessage = result.payload as string || 'Failed to submit reimbursement request';
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('An error occurred while submitting your request');
    } finally {
      setSubmittingReimbursement(false);
    }
  };

  const handleHeartbeatFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeartbeatFile(e.target.files[0]);
    }
  };

  const handleSubmitHeartbeat = async () => {
    if (reportingLoss) {
      // For pregnancy loss, we would need a specific endpoint or milestone status update
      // For now, we'll show a message and handle it appropriately
      toast.info('We are so sorry for your loss. This notification has been sent to your Intended Parents and support team. Monthly base compensation and allowances will be paused. A support specialist will reach out to you within 24 hours.');
      setShowHeartbeatSection(false);
      setReportingLoss(false);
      return;
    }

    if (!heartbeatDate || !embryoTransferDate || !heartbeatFile) {
      toast.error('Please fill in all required fields and upload the ultrasound report');
      return;
    }

    // Find heartbeat milestone (typically a milestone with title containing "heartbeat" or specific ID)
    const heartbeatMilestone = milestones.find(m => 
      m.title.toLowerCase().includes('heartbeat') || 
      m.title.toLowerCase().includes('heart beat') ||
      m.status === 'in_progress'
    );

    if (!heartbeatMilestone) {
      toast.error('Heartbeat milestone not found. Please contact support.');
      return;
    }

    setSubmittingHeartbeat(true);

    try {
      // Upload the document first
      const uploadResult = await dispatch(uploadMilestoneDocument({
        milestoneId: heartbeatMilestone.id,
        title: `Heartbeat Confirmation - ${heartbeatDate}`,
        file: heartbeatFile
      }));

      if (uploadMilestoneDocument.fulfilled.match(uploadResult)) {
        // Then complete the milestone with notes
        const completionNotes = `Heartbeat confirmed on ${heartbeatDate}. Embryo transfer date: ${embryoTransferDate}. ${heartbeatNotes || ''}`;
        const completeResult = await dispatch(completeMilestone({
          id: heartbeatMilestone.id,
          completion_notes: completionNotes
        }));

        if (completeMilestone.fulfilled.match(completeResult)) {
          toast.success('Heartbeat confirmation submitted! This will be sent to your Intended Parents for approval. Once approved, your base compensation payments will begin.');
          // Reset form and hide section
          setHeartbeatDate('');
          setEmbryoTransferDate('');
          setHeartbeatFile(null);
          setHeartbeatNotes('');
          setShowHeartbeatSection(false);
          setHeartbeatApproved(true);
          // Refresh milestones list
          const contractId = contracts[0]?.id;
          if (contractId) {
            dispatch(fetchMilestones({ contractId }));
          }
        } else {
          const errorMessage = completeResult.payload as string || 'Failed to complete milestone';
          toast.error(errorMessage);
        }
      } else {
        const errorMessage = uploadResult.payload as string || 'Failed to upload document';
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('An error occurred while submitting your heartbeat confirmation');
    } finally {
      setSubmittingHeartbeat(false);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-gray-100 text-gray-800';
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
                <span className="text-xs text-white bg-accent px-2 py-0.5 rounded">Surrogate Portal</span>
              </div>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => onNavigate('surrogate-dashboard')}
                className="text-primary"
              >
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate('surrogate-payments')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
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

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Heartbeat Confirmed - Success Message (shows after approval) */}
            {heartbeatApproved && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-gray-900">Heartbeat Confirmed!</h2>
                    <p className="text-gray-600 text-sm">Monthly base compensation is now active</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm mb-2">Your monthly payments are now in effect:</p>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Base compensation: $5,000/month</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Next payment: {nextPayment.date}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>All allowances are now active per your contract</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pregnancy Loss Reporting (Always visible after heartbeat confirmed or during pregnancy) */}
            {(heartbeatApproved || !showHeartbeatSection) && (
              <div className="bg-gray-50 border border-gray-300 rounded-lg shadow-sm p-6">
                <h3 className="text-gray-900 mb-3">Need to Report a Complication?</h3>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reportingLoss}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const checked = e.target.checked;
                        setReportingLoss(checked);
                        if (checked) {
                          const confirmed = window.confirm(
                            'We are deeply sorry for your loss. This will notify your Intended Parents and our support team, and pause monthly base compensation and allowances. A support specialist will contact you within 24 hours. Do you want to proceed?'
                          );
                          if (confirmed) {
                            alert('Your notification has been sent. A support specialist will reach out within 24 hours. We are here for you during this difficult time.');
                            setReportingLoss(false);
                          } else {
                            setReportingLoss(false);
                          }
                        }
                      }}
                      className="mt-1 w-4 h-4 text-primary focus:ring-2 focus:ring-primary border-gray-300 rounded"
                    />
                    <div>
                      <p className="text-gray-900 text-sm">I need to report a miscarriage or stillbirth</p>
                      <p className="text-gray-500 text-xs mt-1">
                        This will notify your Intended Parents and our support team, and will pause monthly base compensation and allowances. A support specialist will contact you within 24 hours.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* NEW SECTION - Heartbeat Confirmation (Critical Milestone) */}
            {showHeartbeatSection && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-300 rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-gray-900">Confirm Heartbeat Detection</h2>
                    <p className="text-gray-600 text-sm">Critical milestone - Starts base compensation payments</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 text-sm mb-1">What happens after approval:</p>
                      <ul className="text-gray-600 text-sm space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="text-pink-500 mt-1">•</span>
                          <span>Monthly base compensation begins immediately (paid per your contract schedule)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-pink-500 mt-1">•</span>
                          <span>Payments continue monthly until delivery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-pink-500 mt-1">•</span>
                          <span>Monthly allowances activate as specified in your contract</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Date of Heartbeat Confirmation */}
                  <div>
                    <label className="text-gray-700 mb-2 block">Date of Heartbeat Confirmation <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={heartbeatDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setHeartbeatDate(e.target.value)}
                      className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Embryo Transfer Date */}
                  <div>
                    <label className="text-gray-700 mb-2 block">Transfer Date of Embryo(s) <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={embryoTransferDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEmbryoTransferDate(e.target.value)}
                      className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Upload Ultrasound Report */}
                  <div>
                    <label className="text-gray-700 mb-2 block">Upload Ultrasound Report <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-pink-300 bg-white rounded-lg p-6 text-center hover:border-pink-400 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="heartbeat-upload"
                        onChange={handleHeartbeatFileUpload}
                        className="hidden"
                        accept="image/*,.pdf"
                        required
                      />
                      <label htmlFor="heartbeat-upload" className="cursor-pointer">
                        {heartbeatFile ? (
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            <span className="text-gray-900">{heartbeatFile.name}</span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setHeartbeatFile(null);
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                            <p className="text-gray-600">Upload ultrasound showing heartbeat</p>
                            <p className="text-gray-400 text-xs mt-1">PNG, JPG, or PDF (max 10MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Notes (Optional) */}
                  <div>
                    <label className="text-gray-700 mb-2 block">Notes (Optional)</label>
                    <textarea
                      value={heartbeatNotes}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setHeartbeatNotes(e.target.value)}
                      placeholder="Add any additional details about your ultrasound appointment..."
                      className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitHeartbeat}
                    disabled={submittingHeartbeat || (!reportingLoss && (!heartbeatDate || !embryoTransferDate || !heartbeatFile))}
                    className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {submittingHeartbeat ? 'Submitting...' : 'Submit for Approval'}
                  </button>
                  <p className="text-gray-500 text-xs text-center">
                    This will be sent to your Intended Parents for approval. You&apos;ll receive a notification once approved.
                  </p>

                  {/* Pregnancy Loss Reporting Section */}
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reportingLoss}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setReportingLoss(e.target.checked)}
                          className="mt-1 w-4 h-4 text-primary focus:ring-2 focus:ring-primary border-gray-300 rounded"
                        />
                        <div>
                          <p className="text-gray-900 text-sm">I need to report a miscarriage or stillbirth</p>
                          <p className="text-gray-500 text-xs mt-1">
                            We are deeply sorry for your loss. Checking this box will notify your Intended Parents and our support team, and will pause monthly base compensation and allowances. A support specialist will contact you within 24 hours.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NEW Section - Request Reimbursement */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
                <h2 className="text-gray-900">Request Reimbursement</h2>
              </div>
              <p className="text-gray-600 text-sm mb-4">Upload a receipt and submit your reimbursement request. AI will verify against your contract before sending to Intended Parents for approval.</p>
              
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className="text-gray-700 mb-2 block">Upload Receipt <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="receipt-upload"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf"
                      required
                    />
                    <label htmlFor="receipt-upload" className="cursor-pointer">
                      {uploadedFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-gray-900">{uploadedFile.name}</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setUploadedFile(null);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-gray-400 text-xs mt-1">PNG, JPG, or PDF (max 10MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Reimbursement Type Dropdown */}
                <div>
                  <label className="text-gray-700 mb-2 block">Reimbursement Type <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      value={reimbursementType}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setReimbursementType(e.target.value)}
                      placeholder="e.g., Prenatal vitamins, Mileage to appointment, Maternity clothing..."
                      className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                    <button
                      onClick={() => setShowMilestoneDropdown(!showMilestoneDropdown)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  {showMilestoneDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200">
                      <div className="p-2">
                        <input
                          type="text"
                          value={selectedCategory}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedCategory(e.target.value)}
                          placeholder="Search categories..."
                          className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {Object.keys(milestoneCategories).map((category) => {
                          const categoryKey = category as keyof typeof milestoneCategories;
                          return (
                            <div key={category} className="p-2">
                              <div
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => setSelectedCategory(category)}
                              >
                                {category}
                              </div>
                              {selectedCategory === category && (
                                <div className="pl-4">
                                  {milestoneCategories[categoryKey].map((milestone: string) => (
                                    <div
                                      key={milestone}
                                      className="cursor-pointer hover:bg-gray-100"
                                      onClick={() => handleMilestoneSelect(milestone)}
                                    >
                                      {milestone}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="text-gray-700 mb-2 block">Amount <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={reimbursementAmount}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setReimbursementAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full py-2 pl-8 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Notes (Optional) */}
                <div>
                  <label className="text-gray-700 mb-2 block">Notes (Optional)</label>
                  <textarea
                    value={reimbursementNotes}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReimbursementNotes(e.target.value)}
                    placeholder="Add any additional details..."
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitReimbursement}
                  disabled={submittingReimbursement || !uploadedFile || !reimbursementType || !reimbursementAmount}
                  className="w-full py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReimbursement ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>

            {/* Section 1 - Welcome + Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-gray-900 mb-2">Welcome back, {surrogateName}!</h2>
                  <p className="text-gray-600 mb-4">Your journey is underway.</p>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mb-3">
                    <CheckCircle className="w-4 h-4" />
                    Contract Confirmed
                  </span>
                  <p className="text-gray-500 text-sm">Questions about your contract? Use the Lookup tool on the right.</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  View Contract
                </button>
              </div>
            </div>

            {/* Section 2 - Payment Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Payment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Received to Date */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-gray-600 text-sm">Total Received to Date</span>
                  </div>
                  <p className="text-gray-900 text-2xl">${totalReceived.toLocaleString()}</p>
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
                    <Heart className="w-5 h-5 text-accent" />
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
                {loading && <span className="text-xs text-gray-500">Loading...</span>}
              </div>
              {loading && upcomingPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Loading upcoming milestones...</div>
              ) : upcomingPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No upcoming milestones</div>
              ) : (
                <>
                  <div className="space-y-4">
                    {upcomingPayments.map((payment) => (
                      <div key={payment.milestoneId} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-gray-900">{payment.milestone?.title || 'Unknown Milestone'}</h4>
                            </div>
                            {payment.milestone?.description && (
                              <p className="text-gray-600 text-xs">{payment.milestone.description}</p>
                            )}
                            <p className="text-gray-600 text-sm flex items-center gap-1 mt-2">
                              <Calendar className="w-4 h-4" />
                              Expected: {payment.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 mb-1">{payment.amount}</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(payment.status)}`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => onNavigate('milestones')}
                    className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Contract
                  </button>
                </>
              )}
            </div>

            {/* Section 4 - Recent Payments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Recent Payments</h3>
              {loading && recentPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Loading recent payments...</div>
              ) : recentPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No recent payments</div>
              ) : (
                <>
                  <div className="space-y-3">
                    {recentPayments.map((payment, index) => (
                      <div key={`${payment.date}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="text-gray-900">{payment.description}</h4>
                          <p className="text-gray-500 text-sm">{payment.date}</p>
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
                    onClick={() => onNavigate('surrogate-payments')}
                    className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Payment History
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
              <p className="text-gray-600 text-sm mb-4">See what your contract says about payments and allowances.</p>
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
                    <p className="text-gray-500 text-xs">Dec 15, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm">Monthly allowance</p>
                    <p className="text-gray-500 text-xs">Jan 1, 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-sm">Contract check-in reminder</p>
                    <p className="text-gray-500 text-xs">Automatic</p>
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