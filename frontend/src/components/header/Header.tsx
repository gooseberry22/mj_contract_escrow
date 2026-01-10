import { Logo } from './Logo';

export function Header({ onLoginClick, onCreateAccountClick }: { onLoginClick?: () => void; onCreateAccountClick?: () => void }) {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => window.location.reload()} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo />
            <span className="text-gray-900">TBA Surrogacy Escrow</span>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors">
              Security
            </a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onLoginClick}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Login
            </button>
            <button 
              onClick={onCreateAccountClick}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}