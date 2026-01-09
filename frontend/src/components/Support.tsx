import { useState } from 'react';
import { 
  User, 
  ChevronDown,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';
import logo from 'figma:asset/772aa6854dfe11f4288b7a955fea018059bbad2d.png';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/userSlice';

interface SupportProps {
  onBack: () => void;
  userType: 'ip' | 'surrogate';
  onNavigate: (page: string) => void;
}

export function Support({ onBack, userType, onNavigate }: SupportProps) {
  const dispatch = useAppDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = userType === 'ip' 
    ? [
        { label: 'Dashboard', page: 'dashboard' },
        { label: 'Payments', page: 'payments' },
        { label: 'Milestones', page: 'milestones' },
        { label: 'Support', page: 'support', active: true }
      ]
    : [
        { label: 'Dashboard', page: 'surrogate-dashboard' },
        { label: 'Payments', page: 'surrogate-payments' },
        { label: 'Lost Wages', page: 'surrogate-lost-wages' },
        { label: 'Support', page: 'support', active: true }
      ];

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
              {navigationItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => item.page !== 'support' && onNavigate(item.page)}
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">Support</h1>
            <p className="text-gray-600">We're here to help. Reach out to us anytime.</p>
          </div>

          {/* Support Contact Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-8 h-8 text-primary" />
              <h2 className="text-gray-900">Get in Touch</h2>
            </div>

            <p className="text-gray-600 mb-8">
              Our team is available to answer your questions and provide support throughout your journey. Contact us via email or text message.
            </p>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">Email Us</h3>
                  <a 
                    href="mailto:hello@thebiggestask.com" 
                    className="text-primary hover:underline"
                  >
                    hello@thebiggestask.com
                  </a>
                  <p className="text-gray-500 text-sm mt-1">We typically respond within 24 hours</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">Text Us</h3>
                  <a 
                    href="sms:XXX-XXX-XXXX" 
                    className="text-primary hover:underline"
                  >
                    XXX-XXX-XXXX
                  </a>
                  <p className="text-gray-500 text-sm mt-1">Available Monday - Friday, 9am - 5pm PST</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-accent/5 rounded-lg">
              <p className="text-gray-700 text-sm">
                <strong>Note:</strong> For urgent matters related to payments or milestones, please email us with "URGENT" in the subject line.
              </p>
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
              <button onClick={() => onNavigate('support')} className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Support
              </button>
            </div>
            <p className="text-gray-500 text-sm">© 2025 The Biggest Ask</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
