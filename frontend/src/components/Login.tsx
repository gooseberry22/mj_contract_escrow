import { useState, FormEvent } from 'react';
import { ArrowLeft, Shield, FileCheck, Bot, AlertCircle, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import { authAPI } from '../lib/api';

interface LoginProps {
  onBack: () => void;
  onCreateAccountClick?: () => void;
  onLoginSuccess?: () => void;
}

export function Login({ onBack, onCreateAccountClick, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authAPI.login({ email, password });
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          err.message || 
                          'Login failed. Please check your credentials and try again.';
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

            {/* Right side links */}
            <div className="flex items-center gap-6">
              <a href="#help" className="text-gray-600 hover:text-gray-900 transition-colors">
                Help
              </a>
              <span className="text-gray-300">|</span>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center">
        <div className="max-w-[1440px] mx-auto px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Login Form */}
            <div>
              <div className="mb-8">
                <h1 className="text-gray-900 mb-3">Welcome back</h1>
                <p className="text-gray-600">Log in to access your journey dashboard.</p>
              </div>

              {/* Form Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-red-800 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Email Field */}
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

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-gray-900">
                        Password
                      </label>
                      <a href="#forgot" className="text-primary hover:opacity-80 transition-opacity">
                        Forgot password?
                      </a>
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50"
                    />
                    <label htmlFor="remember" className="ml-2 text-gray-700">
                      Remember me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      'Log In'
                    )}
                  </button>

                  {/* Create account link */}
                  <div className="text-center">
                    <a
                      href="#signup"
                      className="text-primary hover:opacity-80 transition-opacity"
                      onClick={onCreateAccountClick}
                    >
                      Create an account instead
                    </a>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Illustration & Features */}
            <div>
              {/* Illustration Placeholder */}
              <div className="bg-gradient-to-br from-accent/30 to-secondary/10 rounded-lg p-12 mb-8 border border-gray-200">
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Logo size="large" />
                  </div>
                </div>
              </div>

              {/* Bullet Points */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-gray-700">Secure FDIC-insured accounts</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center">
                    <FileCheck className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="text-gray-700">Automated reimbursement processing</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center mt-1">
                    <Bot className="w-4 h-4 text-secondary" />
                  </div>
                  <p className="text-gray-700">AI-powered contract interpretation</p>
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