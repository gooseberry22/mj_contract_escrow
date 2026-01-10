import { Header } from './components/header/Header';
import { Hero } from './components/homeContainer/Hero';
import { ValueSection } from './components/homeContainer/ValueSection';
import { HowItWorks } from './components/homeContainer/HowItWorks';
import { FundsSafety } from './components/homeContainer/FundsSafety';
import { Pricing } from './components/homeContainer/Pricing';
import { FAQ } from './components/homeContainer/FAQ';
import { Footer } from './components/header/Footer';
import { Login } from './components/signinContainer/Login';
import { CreateAccount } from './components/signupContainer/CreateAccount';
import { Dashboard } from './components/dashboardContainer/Dashboard';
import { Payments } from './components/paymentsContainer/Payments';
import { Milestones } from './components/milestoneContainer/Milestones';
import { SurrogateDashboard } from './components/surrogateContainer/SurrogateDashboard';
import { SurrogatePayments } from './components/surrogateContainer/SurrogatePayments';
import { SurrogateLostWages } from './components/surrogateContainer/SurrogateLostWages';
import { Support } from './components/supportContainer/Support';
import { ContractParsing } from './components/contractContainer/ContractParsing';
import { ContractTemplate } from './components/contractContainer/ContractTemplate';
import { SurrogateConfirmation } from './components/surrogateContainer/SurrogateConfirmation';
import { EscrowAdminConsole } from './components/adminContainer/EscrowAdminConsole';
import { PageThumbnails } from './components/common/PageThumbnails';
import { MilestoneDatabase } from './components/milestoneContainer/MilestoneDatabase';
import { MilestoneFlows } from './components/milestoneContainer/MilestoneFlows';
import { IPMilestoneReview } from './components/milestoneContainer/IPMilestoneReview';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import { useState, useEffect } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchProfile } from './store/slices/userSlice';

type Page = 'home' | 'login' | 'create-account' | 'contract-parsing' | 'contract-template' | 'surrogate-confirmation' | 'escrow-admin-console' | 'dashboard' | 'payments' | 'milestones' | 'surrogate-dashboard' | 'surrogate-payments' | 'surrogate-lost-wages' | 'support' | 'surrogate-support' | 'milestone-database' | 'milestone-flows' | 'ip-milestone-review';
type DashboardPage = 'dashboard' | 'payments' | 'milestones' | 'support';
type SurrogatePage = 'surrogate-dashboard' | 'surrogate-payments' | 'surrogate-lost-wages' | 'support';

// Protected pages that require authentication
const PROTECTED_PAGES: Page[] = [
  'dashboard', 'payments', 'milestones', 'surrogate-dashboard', 
  'surrogate-payments', 'surrogate-lost-wages', 'support', 
  'surrogate-support', 'contract-parsing', 'contract-template'
];

export default function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, loading } = useAppSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Initialize auth state on app load
  useEffect(() => {
    // If we have a token, try to fetch user profile to verify authentication
    if (accessToken && !isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, accessToken, isAuthenticated]);

  // Handle authentication state changes for redirects
  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // If user becomes authenticated and is on login/create-account, redirect to dashboard
    if (isAuthenticated && (currentPage === 'login' || currentPage === 'create-account')) {
      setCurrentPage('dashboard');
    }
    
    // If user becomes unauthenticated and is on a protected page, redirect to login
    if (!isAuthenticated && PROTECTED_PAGES.includes(currentPage)) {
      setCurrentPage('login');
    }
  }, [isAuthenticated, currentPage, loading]);

  if (currentPage === 'thumbnails') {
    return (
      <PageThumbnails
        onSelectPage={(page) => setCurrentPage(page)}
        onClose={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'login') {
    return (
      <Login 
        onBack={() => setCurrentPage('home')}
        onCreateAccountClick={() => setCurrentPage('create-account')}
        onLoginSuccess={() => setCurrentPage('dashboard')}
      />
    );
  }

  if (currentPage === 'create-account') {
    return (
      <CreateAccount 
        onBack={() => setCurrentPage('home')} 
        onLoginClick={() => setCurrentPage('login')}
        onContractUploaded={() => setCurrentPage('contract-parsing')}
      />
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <ProtectedRoute redirectTo={() => setCurrentPage('login')}>
        <Dashboard onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'payments') {
    return (
      <ProtectedRoute redirectTo={() => setCurrentPage('login')}>
        <Payments onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'milestones') {
    return (
      <ProtectedRoute redirectTo={() => setCurrentPage('login')}>
        <ContractTemplate 
          onBack={() => setCurrentPage('home')} 
          onNavigate={(page) => setCurrentPage(page as Page)}
          userType="ip"
          mode="dashboard"
        />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'surrogate-dashboard') {
    return (
      <ProtectedRoute redirectTo={() => setCurrentPage('login')}>
        <SurrogateDashboard onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'surrogate-payments') {
    return (
      <ProtectedRoute redirectTo={() => setCurrentPage('login')}>
        <SurrogatePayments onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'surrogate-lost-wages') {
    return (
      <ProtectedRoute redirectTo={() => setCurrentPage('login')}>
        <SurrogateLostWages onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'support') {
    return (
      <ProtectedRoute redirectTo={() => setCurrentPage('login')}>
        <Support onBack={() => setCurrentPage('home')} userType="ip" onNavigate={(page) => setCurrentPage(page as Page)} />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'surrogate-support') {
    return (
      <ProtectedRoute redirectTo={() => setCurrentPage('login')}>
        <Support onBack={() => setCurrentPage('home')} userType="surrogate" onNavigate={(page) => setCurrentPage(page as Page)} />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'milestone-database') {
    return <MilestoneDatabase />;
  }

  if (currentPage === 'milestone-flows') {
    return <MilestoneFlows />;
  }

  if (currentPage === 'ip-milestone-review') {
    return <IPMilestoneReview />;
  }

  if (currentPage === 'contract-parsing') {
    return (
      <ProtectedRoute redirectTo={() => setCurrentPage('login')}>
        <ContractParsing 
          onComplete={() => setCurrentPage('contract-template')}
          onBack={() => setCurrentPage('home')}
        />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'contract-template') {
    return (
      <ProtectedRoute redirectTo={() => setCurrentPage('login')}>
        <ContractTemplate 
          onConfirm={() => setCurrentPage('dashboard')}
          onBack={() => setCurrentPage('home')}
        />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'surrogate-confirmation') {
    return (
      <SurrogateConfirmation 
        onConfirm={() => setCurrentPage('surrogate-dashboard')}
        onBack={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'escrow-admin-console') {
    return (
      <EscrowAdminConsole 
        onBack={() => setCurrentPage('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      {/* Thumbnail View Toggle */}
      <button
        onClick={() => setCurrentPage('thumbnails')}
        className="fixed bottom-8 right-8 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110"
        title="View all pages"
      >
        <LayoutGrid className="w-6 h-6" />
      </button>

      <Header 
        onLoginClick={() => setCurrentPage('login')}
        onCreateAccountClick={() => setCurrentPage('create-account')}
      />
      <main>
        <Hero />
        <ValueSection />
        <HowItWorks />
        <FundsSafety />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}