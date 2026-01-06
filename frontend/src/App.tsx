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
import { useState } from 'react';
import { LayoutGrid } from 'lucide-react';

type Page = 'home' | 'login' | 'create-account' | 'contract-parsing' | 'contract-template' | 'surrogate-confirmation' | 'escrow-admin-console' | 'dashboard' | 'payments' | 'milestones' | 'surrogate-dashboard' | 'surrogate-payments' | 'surrogate-lost-wages' | 'support' | 'surrogate-support' | 'milestone-database' | 'milestone-flows' | 'ip-milestone-review';
type DashboardPage = 'dashboard' | 'payments' | 'milestones' | 'support';
type SurrogatePage = 'surrogate-dashboard' | 'surrogate-payments' | 'surrogate-lost-wages' | 'support';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

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
    return <Dashboard onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />;
  }

  if (currentPage === 'payments') {
    return <Payments onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />;
  }

  if (currentPage === 'milestones') {
    return (
      <ContractTemplate 
        onBack={() => setCurrentPage('home')} 
        onNavigate={(page) => setCurrentPage(page as Page)}
        userType="ip"
        mode="dashboard"
      />
    );
  }

  if (currentPage === 'surrogate-dashboard') {
    return <SurrogateDashboard onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />;
  }

  if (currentPage === 'surrogate-payments') {
    return <SurrogatePayments onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />;
  }

  if (currentPage === 'surrogate-lost-wages') {
    return <SurrogateLostWages onBack={() => setCurrentPage('home')} onNavigate={(page) => setCurrentPage(page)} />;
  }

  if (currentPage === 'support') {
    return <Support onBack={() => setCurrentPage('home')} userType="ip" onNavigate={(page) => setCurrentPage(page as Page)} />;
  }

  if (currentPage === 'surrogate-support') {
    return <Support onBack={() => setCurrentPage('home')} userType="surrogate" onNavigate={(page) => setCurrentPage(page as Page)} />;
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
      <ContractParsing 
        onComplete={() => setCurrentPage('contract-template')}
        onBack={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'contract-template') {
    return (
      <ContractTemplate 
        onConfirm={() => setCurrentPage('dashboard')}
        onBack={() => setCurrentPage('home')}
      />
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