import { useState, FormEvent } from 'react';
import { Shield, FileCheck, Bot, Bell, Upload, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Logo } from './Logo';
import { authAPI } from '@/lib/api';

interface CreateAccountProps {
  onBack: () => void;
  onLoginClick: () => void;
  onContractUploaded?: () => void;
}

export function CreateAccount({ onBack, onLoginClick, onContractUploaded }: CreateAccountProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [role, setRole] = useState<'intended-parent' | 'gestational-carrier'>('intended-parent');
  const [inviteCode, setInviteCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    // Handle file upload logic here
    if (onContractUploaded) {
      onContractUploaded();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      // Note: File upload to backend would happen after account creation
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(null); // Clear error on input change
  };

  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (role === 'gestational-carrier' && !inviteCode) {
      setError('Invite code is required for gestational carriers');
      return false;
    }

    if (role === 'intended-parent' && !uploadedFile) {
      setError('Please upload your signed contract');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      // Create account
      await authAPI.signup({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      setSuccess(true);
      
      // If IP and contract uploaded, proceed to contract parsing
      if (role === 'intended-parent' && uploadedFile && onContractUploaded) {
        // Note: Contract upload would happen here or in next step
        setTimeout(() => {
          if (onContractUploaded) {
            onContractUploaded();
          }
        }, 1500);
      } else {
        // For gestational carriers or if no contract, redirect to login or dashboard
        setTimeout(() => {
          if (onLoginClick) {
            onLoginClick();
          }
        }, 1500);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.email?.[0] || 
                          err.response?.data?.password?.[0] ||
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to create account. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
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
                  {/* Success Message */}
                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <p className="text-green-800 text-sm">Account created successfully! Redirecting...</p>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

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
                        value={formData.firstName}
                        onChange={handleInputChange}
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
                        value={formData.lastName}
                        onChange={handleInputChange}
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
                        value={formData.email}
                        onChange={handleInputChange}
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
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        minLength={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Create a password (min. 8 characters)"
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
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
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
                        className="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary"
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
                        className="mt-1 w-4 h-4 text-primary border-gray-300 focus:ring-primary"
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
                        required
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
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-900 mb-2">Drag and drop your contract here</p>
                        <p className="text-gray-500 text-sm mb-4">or</p>
                        <label
                          htmlFor="fileInput"
                          className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer inline-block"
                        >
                          Upload PDF
                        </label>
                        <p className="text-gray-500 text-sm mt-4">PDF or DOC · Max 10 MB</p>
                      </div>

                      {/* File Input */}
                      <input
                        type="file"
                        id="fileInput"
                        accept=".pdf, .doc, .docx"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={loading}
                      />
                      {uploadedFile && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-800">{uploadedFile.name}</span>
                        </div>
                      )}
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
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50"
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
                    disabled={!agreedToTerms || loading || success}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating account...
                      </>
                    ) : success ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Account created!
                      </>
                    ) : (
                      'Create Account + Build My Journey'
                    )}
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