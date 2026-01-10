import { Header } from '../header/Header';
import { Hero } from '../homeContainer/Hero';
import { ValueSection } from '../homeContainer/ValueSection';
import { HowItWorks } from '../homeContainer/HowItWorks';
import { FundsSafety } from '../homeContainer/FundsSafety';
import { Pricing } from '../homeContainer/Pricing';
import { FAQ } from '../homeContainer/FAQ';
import { Footer } from '../header/Footer';
import { Login } from '../signinContainer/Login';
import { CreateAccount } from '../signupContainer/CreateAccount';
import { Dashboard } from '../dashboardContainer/Dashboard';
import { Payments } from '../paymentsContainer/Payments';
import { Milestones } from '../milestoneContainer/Milestones';
import { SurrogateDashboard } from '../surrogateContainer/SurrogateDashboard';
import { SurrogatePayments } from '../surrogateContainer/SurrogatePayments';
import { MilestoneDatabase } from '../milestoneContainer/MilestoneDatabase';
import { MilestoneFlows } from '../milestoneContainer/MilestoneFlows';
import { IPMilestoneReview } from '../milestoneContainer/IPMilestoneReview';
import { SurrogateConfirmation } from '../surrogateContainer/SurrogateConfirmation';
import { EscrowAdminConsole } from '../adminContainer/EscrowAdminConsole';
import { LayoutGrid, X } from 'lucide-react';

interface PageThumbnailsProps {
  onSelectPage: (page: 'home' | 'login' | 'create-account' | 'dashboard' | 'payments' | 'milestones' | 'surrogate-confirmation' | 'escrow-admin-console' | 'surrogate-dashboard' | 'surrogate-payments' | 'milestone-database' | 'milestone-flows' | 'ip-milestone-review') => void;
  onClose: () => void;
}

export function PageThumbnails({ onSelectPage, onClose }: PageThumbnailsProps) {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-6 h-6 text-gray-700" />
            <h1 className="text-gray-900">Pages Overview</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Thumbnails Grid */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Landing Page Thumbnail */}
        <div
          onClick={() => onSelectPage('home')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <div className="min-h-screen bg-white">
                <Header />
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
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Landing Page</p>
              <p className="text-white/70 text-sm">Home • Hero • Features • Pricing • FAQ</p>
            </div>
          </div>
        </div>

        {/* Login Page Thumbnail */}
        <div
          onClick={() => onSelectPage('login')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <Login onBack={() => {}} />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Login Page</p>
              <p className="text-white/70 text-sm">Sign In • Social Auth</p>
            </div>
          </div>
        </div>

        {/* Create Account Page Thumbnail */}
        <div
          onClick={() => onSelectPage('create-account')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <CreateAccount onBack={() => {}} onLoginClick={() => {}} />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Create Account Page</p>
              <p className="text-white/70 text-sm">Sign Up • Role Selection • Contract Upload</p>
            </div>
          </div>
        </div>

        {/* Dashboard Page Thumbnail */}
        <div
          onClick={() => onSelectPage('dashboard')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <Dashboard onBack={() => {}} onNavigate={() => {}} />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Dashboard Page</p>
              <p className="text-white/70 text-sm">Journey • Milestones • Payments</p>
            </div>
          </div>
        </div>

        {/* Payments Page Thumbnail */}
        <div
          onClick={() => onSelectPage('payments')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <Payments onBack={() => {}} onNavigate={() => {}} />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Payments Page</p>
              <p className="text-white/70 text-sm">Payment History • Invoice Details • Payment Methods</p>
            </div>
          </div>
        </div>

        {/* Milestones Page Thumbnail */}
        <div
          onClick={() => onSelectPage('milestones')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <Milestones onBack={() => {}} onNavigate={() => {}} />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Milestones Page</p>
              <p className="text-white/70 text-sm">Milestone Details • Progress Tracking • Approval</p>
            </div>
          </div>
        </div>

        {/* Surrogate Confirmation Page Thumbnail */}
        <div
          onClick={() => onSelectPage('surrogate-confirmation')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <SurrogateConfirmation onBack={() => {}} onConfirm={() => {}} />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Surrogate Confirmation Page</p>
              <p className="text-white/70 text-sm">Contract Review • Agreement • Payment Trigger</p>
            </div>
          </div>
        </div>

        {/* Escrow Admin Console Page Thumbnail */}
        <div
          onClick={() => onSelectPage('escrow-admin-console')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <EscrowAdminConsole onBack={() => {}} />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Escrow Admin Console</p>
              <p className="text-white/70 text-sm">Manage Contracts • Monitor Payments • Resolve Disputes</p>
            </div>
          </div>
        </div>

        {/* Surrogate Dashboard Page Thumbnail */}
        <div
          onClick={() => onSelectPage('surrogate-dashboard')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <SurrogateDashboard onBack={() => {}} onNavigate={() => {}} />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Surrogate Dashboard Page</p>
              <p className="text-white/70 text-sm">Journey • Milestones • Payments</p>
            </div>
          </div>
        </div>

        {/* Surrogate Payments Page Thumbnail */}
        <div
          onClick={() => onSelectPage('surrogate-payments')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <SurrogatePayments onBack={() => {}} onNavigate={() => {}} />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Surrogate Payments Page</p>
              <p className="text-white/70 text-sm">Payment History • Invoice Details • Payment Methods</p>
            </div>
          </div>
        </div>

        {/* Milestone Database Page Thumbnail */}
        <div
          onClick={() => onSelectPage('milestone-database')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <MilestoneDatabase />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Milestone Database</p>
              <p className="text-white/70 text-sm">All Milestones • GC & IP Perspectives</p>
            </div>
          </div>
        </div>

        {/* Milestone Flows Page Thumbnail */}
        <div
          onClick={() => onSelectPage('milestone-flows')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <MilestoneFlows />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">Payment Flows</p>
              <p className="text-white/70 text-sm">GC-Triggered • Automated Monthly</p>
            </div>
          </div>
        </div>

        {/* IP Milestone Review Page Thumbnail */}
        <div
          onClick={() => onSelectPage('ip-milestone-review')}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <div className="relative">
            {/* Thumbnail Preview */}
            <div className="scale-[0.25] origin-top-left w-[400%] h-[300vh] overflow-hidden pointer-events-none">
              <IPMilestoneReview />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white">IP Milestone Review</p>
              <p className="text-white/70 text-sm">Review Submissions • AI Verification • Approve/Deny</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}