import { useState, useEffect, useRef } from 'react';
import { Shield, FileCheck, Bot, Bell, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '../header/Logo';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signup, clearError } from '../../store/slices/userSlice';

interface CreateAccountProps {
  onBack: () => void;
  onLoginClick: () => void;
  onContractUploaded?: () => void;
}

export function CreateAccount({ onBack, onLoginClick, onContractUploaded }: CreateAccountProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.user);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'intended-parent' | 'gestational-carrier'>('intended-parent');
  const [inviteCode, setInviteCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || 
          file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setContractFile(file);
        setPasswordError('');
      } else {
        const errorMsg = 'Please upload a PDF or DOC file';
        setPasswordError(errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || 
          file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setContractFile(file);
        setPasswordError('');
      } else {
        const errorMsg = 'Please upload a PDF or DOC file';
        setPasswordError(errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const validateForm = (): boolean => {
    setPasswordError('');
    
    if (!firstName.trim()) {
      const errorMsg = 'First name is required';
      setPasswordError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    
    if (!lastName.trim()) {
      const errorMsg = 'Last name is required';
      setPasswordError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    
    if (!email.trim()) {
      const errorMsg = 'Email is required';
      setPasswordError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    
    if (!password) {
      const errorMsg = 'Password is required';
      setPasswordError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    
    if (password.length < 8) {
      const errorMsg = 'Password must be at least 8 characters';
      setPasswordError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    
    if (password !== confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setPasswordError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    
    if (role === 'gestational-carrier' && !inviteCode.trim()) {
      const errorMsg = 'Invite code is required for gestational carriers';
      setPasswordError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    
    if (role === 'intended-parent' && !contractFile) {
      const errorMsg = 'Contract file is required for intended parents';
      setPasswordError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Signup with basic user data
    const result = await dispatch(signup({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    }));
    
    if (signup.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      // After successful signup, if there's a contract file, navigate to contract parsing
      // Note: Contract upload will be handled separately after authentication
      if (role === 'intended-parent' && contractFile && onContractUploaded) {
        // Store contract file in sessionStorage for contract parsing page
        // In a real app, you might want to upload it immediately after login
        sessionStorage.setItem('pendingContractFile', JSON.stringify({
          name: contractFile.name,
          type: contractFile.type,
          size: contractFile.size,
        }));
        onContractUploaded();
      } else if (onContractUploaded) {
        // For gestational carriers or if no contract, just navigate
        onContractUploaded();
      }
    } else if (signup.rejected.match(result)) {
      // Error will be shown via useEffect
      const errorMessage = result.error?.message || 'Signup failed. Please try again.';
      if (!error) {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Logo />
              <span className="text-gray-900">TBA Surrogacy Escrow</span>
            </button>

            {/* Right side link */}
            <button 
              onClick={onLoginClick}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log in
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Create Account Form */}
            <div>
              <div className="mb-8">
                <h1 className="text-gray-900 mb-3">Create your account</h1>
                <p className="text-gray-600">
                  Intended Parents create the primary account. Gestational Carriers join by invitation. 
                  Upload your signed contract to set up your journey.
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                <form className="space-y-8" onSubmit={handleSubmit}>
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <h3 className="text-gray-900">Personal Information</h3>
                    
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-gray-900 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Jane"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-gray-900 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="password" className="block text-gray-900 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Create a password"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-gray-900 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>

                  {/* Role Selection Section */}
                  <div className="space-y-4">
                    <h3 className="text-gray-900">Who are you?</h3>
                    
                    {/* Intended Parent Option */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="intended-parent"
                        checked={role === 'intended-parent'}
                        onChange={(e) => setRole(e.target.value as 'intended-parent')}
                        disabled={loading}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div>
                        <span className="text-gray-900">Intended Parent</span>
                        <span className="text-gray-500 ml-2">(recommended)</span>
                      </div>
                    </label>

                    {/* Gestational Carrier Option */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="gestational-carrier"
                        checked={role === 'gestational-carrier'}
                        onChange={(e) => setRole(e.target.value as 'gestational-carrier')}
                        disabled={loading}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div>
                        <div className="text-gray-900">I have an invite code</div>
                        <p className="text-gray-600 text-sm mt-1">
                          For Gestational Carriers only. You will receive an invite link from your Intended Parent.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Conditional Invite Code Field */}
                  {role === 'gestational-carrier' && (
                    <div>
                      <label htmlFor="inviteCode" className="block text-gray-900 mb-2">
                        Invite Code
                      </label>
                      <input
                        type="text"
                        id="inviteCode"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your invite code"
                      />
                    </div>
                  )}

                  {/* Conditional Contract Upload Section */}
                  {role === 'intended-parent' && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-gray-900 mb-2">Upload your signed surrogacy contract</h3>
                        <p className="text-gray-600">
                          This allows us to build your journey and automate payments and reimbursements.
                        </p>
                      </div>

                      {/* Upload Box */}
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                          dragActive 
                            ? 'border-primary bg-primary/5' 
                            : contractFile
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        {contractFile ? (
                          <div>
                            <p className="text-gray-900 mb-2 font-medium">✓ {contractFile.name}</p>
                            <p className="text-gray-500 text-sm">{(contractFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button
                              type="button"
                              onClick={() => setContractFile(null)}
                              disabled={loading}
                              className="mt-2 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                            >
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <>
                            <p className="text-gray-900 mb-2">Drag and drop your contract here</p>
                            <p className="text-gray-500 text-sm mb-4">or</p>
                            <button
                              type="button"
                              onClick={handleFileButtonClick}
                              disabled={loading}
                              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Upload PDF
                            </button>
                            <p className="text-gray-500 text-sm mt-4">PDF or DOC · Max 10 MB</p>
                          </>
                        )}
                      </div>

                      {/* File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf, .doc, .docx"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={loading}
                      />
                    </div>
                  )}

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      disabled={loading}
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <label htmlFor="terms" className="text-gray-700">
                      I agree to the{' '}
                      <a href="#terms" className="text-primary hover:opacity-80 transition-opacity">
                        Terms
                      </a>
                      {' '}and{' '}
                      <a href="#privacy" className="text-primary hover:opacity-80 transition-opacity">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!agreedToTerms || loading}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating account...' : 'Create Account + Build My Journey'}
                  </button>

                  {/* Login Link */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={onLoginClick}
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      Already have an account? Log in
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Features */}
            <div>
              {/* Illustration */}
              <div className="bg-gradient-to-br from-accent/30 to-secondary/10 rounded-lg p-12 mb-8 border border-gray-200">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Logo size="large" />
                  </div>
                </div>
              </div>

              {/* Feature Bullets */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-gray-700">FDIC-insured escrow accounts</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center mt-1">
                    <Bot className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="text-gray-700">AI-assisted contract interpretation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center">
                    <FileCheck className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="text-gray-700">Automated reimbursements based on your contract</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent/30 rounded-full flex items-center justify-center mt-1">
                    <Bell className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="text-gray-700">Real-time payment tracking and alerts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Links */}
            <div className="flex items-center gap-4">
              <a href="#terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                Terms
              </a>
              <span className="text-gray-300">|</span>
              <a href="#privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacy
              </a>
              <span className="text-gray-300">|</span>
              <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">
                Security
              </a>
            </div>

            {/* Copyright */}
            <p className="text-gray-500 text-sm">© 2025 TBA Surrogacy Escrow</p>
          </div>
        </div>
      </footer>
    </div>
  );
}