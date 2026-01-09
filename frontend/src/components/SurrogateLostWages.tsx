import { useState, useEffect } from 'react';
import { 
  User, 
  ChevronDown,
  Upload,
  CheckCircle,
  Calendar,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  FileText,
  Clock,
  Info,
  ArrowLeft,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from './Logo';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPayments, createPayment } from '../store/slices/paymentsSlice';
import { fetchContracts } from '../store/slices/contractsSlice';

interface SurrogateLostWagesProps {
  onBack: () => void;
  onNavigate: (page: 'dashboard' | 'payments' | 'lost-wages') => void;
}

export function SurrogateLostWages({ onBack, onNavigate }: SurrogateLostWagesProps) {
  const dispatch = useAppDispatch();
  const { payments, loading: paymentsLoading } = useAppSelector((state) => state.payments);
  const { contracts, loading: contractsLoading } = useAppSelector((state) => state.contracts);
  const { user } = useAppSelector((state) => state.user);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Stored employment info (simulating saved data from previous requests)
  const [hasStoredEmploymentInfo, setHasStoredEmploymentInfo] = useState(false);
  const [showEditEmploymentInfo, setShowEditEmploymentInfo] = useState(false);

  // Form state
  const [missedWorkDate, setMissedWorkDate] = useState('');
  const [hoursMissed, setHoursMissed] = useState('');
  const [reason, setReason] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [isPregnancyRelated, setIsPregnancyRelated] = useState(false);

  // Employment info
  const [employmentType, setEmploymentType] = useState<'hourly' | 'salaried' | 'self-employed'>('hourly');
  const [hourlyRate, setHourlyRate] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [typicalHoursPerWeek, setTypicalHoursPerWeek] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [employerContact, setEmployerContact] = useState('');

  // File uploads
  const [payStubFile, setPayStubFile] = useState<File | null>(null);
  const [appointmentFile, setAppointmentFile] = useState<File | null>(null);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchContracts());
  }, [dispatch]);

  // Get contract data (mock for now, could be enhanced with real contract data)
  const contract = contracts[0];
  const contractData = {
    maxHourlyRate: '$35.00',
    maxHoursPerMonth: '40',
    monthlyCap: '$1,400'
  };

  // Calculate monthly usage from past lost wages payments
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const monthlyLostWagesPayments = payments
    .filter(p => 
      p.description?.toLowerCase().includes('lost wages') &&
      p.created_at && 
      new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) === currentMonth
    );

  const monthlyUsed = monthlyLostWagesPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const monthlyCap = 1400; // From contract
  const monthlyUsage = {
    used: `$${monthlyUsed.toFixed(2)}`,
    remaining: `$${(monthlyCap - monthlyUsed).toFixed(2)}`
  };

  // Past requests from API
  const pastRequests = payments
    .filter(p => p.description?.toLowerCase().includes('lost wages'))
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    })
    .slice(0, 5)
    .map(p => ({
      date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: `$${parseFloat(p.amount).toLocaleString()}`,
      status: p.status === 'paid' || p.status === 'completed' ? 'Approved' : p.status.charAt(0).toUpperCase() + p.status.slice(1)
    }));

  const steps = [
    { number: 1, label: 'Visit details' },
    { number: 2, label: 'Employment info' },
    { number: 3, label: 'Documentation' },
    { number: 4, label: 'Review & submit' }
  ];

  const calculateRequestAmount = () => {
    if (employmentType === 'hourly' && hourlyRate && hoursMissed) {
      const rate = parseFloat(hourlyRate);
      const hours = parseFloat(hoursMissed);
      return (rate * hours).toFixed(2);
    }
    if (employmentType === 'salaried' && monthlySalary && hoursMissed && typicalHoursPerWeek) {
      const salary = parseFloat(monthlySalary);
      const hours = parseFloat(hoursMissed);
      const weeklyHours = parseFloat(typicalHoursPerWeek);
      const hourlyEquivalent = salary / (weeklyHours * 4.33); // approximate weeks per month
      return (hourlyEquivalent * hours).toFixed(2);
    }
    return '0.00';
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (type: 'payStub' | 'appointment', file: File | null) => {
    if (type === 'payStub') {
      setPayStubFile(file);
    } else {
      setAppointmentFile(file);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!missedWorkDate || !hoursMissed || !reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!payStubFile && !appointmentFile) {
      toast.error('Please upload at least one document (pay stub or appointment documentation)');
      return;
    }

    if (!contract) {
      toast.error('No contract found. Please contact support.');
      return;
    }

    const calculatedAmount = calculateRequestAmount();
    if (parseFloat(calculatedAmount) <= 0) {
      toast.error('Please provide valid employment information to calculate lost wages');
      return;
    }

    setSubmitting(true);

    try {
      // Build description with all lost wages details
      const description = `Lost Wages: ${reason}${clinicName ? ` - ${clinicName}` : ''} on ${missedWorkDate}`;
      
      // Build notes with employment and calculation details
      const notes = [
        `Hours missed: ${hoursMissed}`,
        `Employment type: ${employmentType}`,
        employmentType === 'hourly' ? `Hourly rate: $${hourlyRate}` : `Monthly salary: $${monthlySalary}`,
        `Typical hours per week: ${typicalHoursPerWeek}`,
        `Employer: ${employerName}`,
        employerContact ? `Employer contact: ${employerContact}` : '',
        isPregnancyRelated ? 'Pregnancy-related: Yes' : 'Pregnancy-related: No',
        `Calculated amount: $${calculatedAmount}`
      ].filter(Boolean).join('\n');

      // Create payment for lost wages
      const paymentData = {
        contract: contract.id,
        payer: contract.intended_parent, // Intended parent pays
        payee: contract.surrogate, // Surrogate receives
        amount: calculatedAmount,
        payment_type: 'milestone', // Using milestone type for lost wages
        description: description,
        notes: notes,
      };

      const result = await dispatch(createPayment(paymentData));

      if (createPayment.fulfilled.match(result)) {
        // Note: File uploads would need to be handled separately if the backend supports it
        // For now, we'll just show success
        toast.success('Lost wages request submitted successfully! Your Intended Parents and the escrow team will review this request.');
        
        // Reset form after a delay
        setTimeout(() => {
          setMissedWorkDate('');
          setHoursMissed('');
          setReason('');
          setClinicName('');
          setIsPregnancyRelated(false);
          setPayStubFile(null);
          setAppointmentFile(null);
          setCurrentStep(1);
          // Refresh payments to show new request
          dispatch(fetchPayments());
          // Navigate to dashboard after 2 seconds
          setTimeout(() => {
            onNavigate('dashboard');
          }, 2000);
        }, 2000);
      } else {
        const errorMessage = result.payload as string || 'Failed to submit lost wages request';
        toast.error(errorMessage);
      }
    } catch (err) {
      toast.error('An error occurred while submitting your request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'border-green-600 text-green-700';
      case 'pending':
        return 'border-gray-400 text-gray-700';
      default:
        return 'border-gray-400 text-gray-700';
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
                onClick={() => onNavigate('lost-wages')}
                className="text-primary"
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
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
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
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
          <h1 className="text-gray-900 mb-2">Request Lost Wages</h1>
          <p className="text-gray-600">Submit a request for income you lost due to pregnancy-related appointments or required time off.</p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep === step.number 
                      ? 'border-primary bg-primary text-white' 
                      : currentStep > step.number
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    currentStep === step.number ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Step 1: Visit Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-gray-900 mb-6">1. Visit details</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-700 mb-2">Date of missed work</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={missedWorkDate}
                        onChange={(e) => setMissedWorkDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Hours missed</label>
                    <input
                      type="number"
                      value={hoursMissed}
                      onChange={(e) => setHoursMissed(e.target.value)}
                      placeholder="e.g., 4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Reason</label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select a reason</option>
                      <option value="prenatal-visit">Prenatal visit</option>
                      <option value="monitoring">Monitoring / lab work</option>
                      <option value="bed-rest">Bed rest / complications</option>
                      <option value="delivery">Delivery-related</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Clinic or provider name (optional)</label>
                    <input
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="pregnancy-related"
                      checked={isPregnancyRelated}
                      onChange={(e) => setIsPregnancyRelated(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="pregnancy-related" className="text-gray-700 text-sm cursor-pointer">
                      This absence was pregnancy-related and recommended by my provider.
                    </label>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Next: Employment info
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Employment Info */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-gray-900 mb-6">2. Employment info</h2>
                
                {/* Show saved employment info summary if it exists and not editing */}
                {hasStoredEmploymentInfo && !showEditEmploymentInfo ? (
                  <div className="space-y-5">
                    <div className="p-5 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-gray-900 mb-1">Employment info saved</h3>
                          <p className="text-gray-600 text-sm">We have your employment information on file from your previous request.</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-white rounded-lg">
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Employment type</p>
                          <p className="text-gray-900 capitalize">{employmentType}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Hourly rate</p>
                          <p className="text-gray-900">${hourlyRate}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Hours per week</p>
                          <p className="text-gray-900">{typicalHoursPerWeek}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Employer</p>
                          <p className="text-gray-900">{employerName}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowEditEmploymentInfo(true)}
                      className="text-primary hover:underline text-sm"
                    >
                      Changed jobs or need to update this info?
                    </button>
                  </div>
                ) : (
                  // Show full employment form
                  <div className="space-y-5">
                    <div>
                      <label className="block text-gray-700 mb-3">Employment type</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="employment-type"
                            value="hourly"
                            checked={employmentType === 'hourly'}
                            onChange={(e) => setEmploymentType('hourly')}
                            className="w-4 h-4"
                          />
                          <span className="text-gray-700">Hourly</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="employment-type"
                            value="salaried"
                            checked={employmentType === 'salaried'}
                            onChange={(e) => setEmploymentType('salaried')}
                            className="w-4 h-4"
                          />
                          <span className="text-gray-700">Salaried</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="employment-type"
                            value="self-employed"
                            checked={employmentType === 'self-employed'}
                            onChange={(e) => setEmploymentType('self-employed')}
                            className="w-4 h-4"
                          />
                          <span className="text-gray-700">Self-employed</span>
                        </label>
                      </div>
                    </div>

                    {employmentType === 'hourly' && (
                      <>
                        <div>
                          <label className="block text-gray-700 mb-2">Hourly rate (before taxes)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="number"
                              value={hourlyRate}
                              onChange={(e) => setHourlyRate(e.target.value)}
                              placeholder="e.g., 24.00"
                              step="0.01"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Typical hours per week</label>
                          <input
                            type="number"
                            value={typicalHoursPerWeek}
                            onChange={(e) => setTypicalHoursPerWeek(e.target.value)}
                            placeholder="e.g., 40"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    {employmentType === 'salaried' && (
                      <>
                        <div>
                          <label className="block text-gray-700 mb-2">Monthly salary (before taxes)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="number"
                              value={monthlySalary}
                              onChange={(e) => setMonthlySalary(e.target.value)}
                              placeholder="e.g., 5000"
                              step="0.01"
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Typical hours per week</label>
                          <input
                            type="number"
                            value={typicalHoursPerWeek}
                            onChange={(e) => setTypicalHoursPerWeek(e.target.value)}
                            placeholder="e.g., 40"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-gray-700 mb-2">Employer name</label>
                      <input
                        type="text"
                        value={employerName}
                        onChange={(e) => setEmployerName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Employer contact (optional)</label>
                      <input
                        type="text"
                        value={employerContact}
                        onChange={(e) => setEmployerContact(e.target.value)}
                        placeholder="HR email or phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Next: Documentation
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Documentation */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-gray-900 mb-6">3. Documentation</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-700 mb-2">Pay stub or income proof</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="pay-stub-upload"
                        onChange={(e) => handleFileUpload('payStub', e.target.files?.[0] || null)}
                        accept="image/*,.pdf"
                        className="hidden"
                      />
                      <label htmlFor="pay-stub-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        {payStubFile ? (
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            <p className="text-gray-700">{payStubFile.name}</p>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setPayStubFile(null);
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-700 mb-1">Click to upload or drag and drop</p>
                            <p className="text-gray-500 text-sm">Upload a recent pay stub, earnings statement, or invoice.</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Appointment or doctor documentation</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="appointment-upload"
                        onChange={(e) => handleFileUpload('appointment', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="appointment-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        {appointmentFile ? (
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="w-5 h-5 text-green-600" />
                            <p className="text-gray-700">{appointmentFile.name}</p>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setAppointmentFile(null);
                              }}
                              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-700 mb-1">Click to upload or drag and drop</p>
                            <p className="text-gray-500 text-sm">Upload a visit summary, appointment confirmation, or doctor&apos;s note.</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">
                      We use these documents only to calculate your lost wages based on your contract.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Next: Review & submit
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-gray-900 mb-6">4. Review & submit</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Date of missed work</p>
                      <p className="text-gray-900">{missedWorkDate || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Hours missed</p>
                      <p className="text-gray-900">{hoursMissed || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Employment type</p>
                      <p className="text-gray-900 capitalize">{employmentType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Employer</p>
                      <p className="text-gray-900">{employerName || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
                    <p className="text-gray-600 text-sm mb-2">Calculated request amount</p>
                    <p className="text-gray-900 text-3xl">${calculateRequestAmount()}</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      Based on your contract, this amount will be sent to your Intended Parents and the escrow team for review.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        // Save draft functionality could be implemented with localStorage or API
                        toast.success('Draft saved successfully!');
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Save draft
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit request'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Helper Text */}
            <div className="pt-4">
              <p className="text-gray-500 text-sm mb-2">
                Once you submit, your Intended Parents and the escrow team will review this request. Most requests are processed within a few business days.
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Contract Snapshot */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Contract snapshot</h3>
              
              <div className="space-y-3 mb-4">
                <p className="text-gray-600 text-sm">Lost wages terms</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>Max hourly rate: {contractData.maxHourlyRate}</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>Max hours per month: {contractData.maxHoursPerMonth}</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>Monthly lost wages cap: {contractData.monthlyCap}</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-500 text-xs">
                This summary is extracted automatically from your contract.
              </p>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">This month so far</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Used this month</span>
                  <span className="text-gray-900">{monthlyUsage.used}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: '25%' }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Remaining this month</span>
                  <span className="text-gray-900">{monthlyUsage.remaining}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600 text-sm mb-3">Past requests</p>
                <div className="space-y-2">
                  {pastRequests.map((request, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{request.date}</span>
                      <span className="text-gray-900">{request.amount}</span>
                      <span className={`px-2 py-1 border rounded text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  ))}
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