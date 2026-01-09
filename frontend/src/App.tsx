import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ValueSection } from './components/ValueSection';
import { HowItWorks } from './components/HowItWorks';
import { FundsSafety } from './components/FundsSafety';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { CreateAccount } from './components/CreateAccount';
import { Dashboard } from './components/Dashboard';
import { Payments } from './components/Payments';
import { Milestones } from './components/Milestones';
import { SurrogateDashboard } from './components/SurrogateDashboard';
import { SurrogatePayments } from './components/SurrogatePayments';
import { SurrogateLostWages } from './components/SurrogateLostWages';
import { Support } from './components/Support';
import { ContractParsing } from './components/ContractParsing';
import { ContractTemplate } from './components/ContractTemplate';
import { SurrogateConfirmation } from './components/SurrogateConfirmation';
import { EscrowAdminConsole } from './components/EscrowAdminConsole';
import { PageThumbnails } from './components/PageThumbnails';
import { MilestoneDatabase } from './components/MilestoneDatabase';
import { MilestoneFlows } from './components/MilestoneFlows';
import { IPMilestoneReview } from './components/IPMilestoneReview';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import { useState, useEffect } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchProfile } from './store/slices/userSlice';

type Page = 'home' | 'login' | 'create-account' | 'contract-parsing' | 'contract-template' | 'surrogate-confirmation' | 'escrow-admin-console' | 'dashboard' | 'payments' | 'milestones' | 'surrogate-dashboard' | 'surrogate-payments' | 'surrogate-lost-wages' | 'support' | 'surrogate-support' | 'milestone-database' | 'milestone-flows' | 'ip-milestone-review';
type DashboardPage = 'dashboard' | 'payments' | 'milestones' | 'support';
type SurrogatePage = 'surrogate-dashboard' | 'surrogate-payments' | 'surrogate-lost-wages' | 'support';

export default function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Initialize auth state on app load
  useEffect(() => {
    // If we have a token, try to fetch user profile to verify authentication
    if (accessToken && !isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, accessToken, isAuthenticated]);

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