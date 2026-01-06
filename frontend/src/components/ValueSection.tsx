import { Shield, Bot, CheckCircle } from 'lucide-react';

export function ValueSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-gray-900 mb-3">
              Secure Escrow Accounts
            </h3>
            <p className="text-gray-600">
              FDIC-insured FBO accounts for each journey.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-gray-900 mb-3">
              AI Contract Interpretation
            </h3>
            <p className="text-gray-600">
              Instant contract lookups for reimbursements.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-gray-900 mb-3">
              Automated Milestone Payments
            </h3>
            <p className="text-gray-600">
              Schedules, tracks, and releases payments automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}