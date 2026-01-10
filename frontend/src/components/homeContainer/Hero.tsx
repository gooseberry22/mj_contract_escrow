import { ArrowRight, DollarSign, CheckCircle } from 'lucide-react';

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-accent/30 to-white py-20">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div>
            <h1 className="text-gray-900 mb-6">
              Automated, Secure Surrogacy Escrow
            </h1>
            <p className="text-gray-600 mb-8 max-w-lg">
              A modern platform for Intended Parents and Gestational Carriers, built with transparency and contract-based automation.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Book Demo
              </button>
            </div>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded-full"></div>
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded mt-2"></div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Active
                </div>
              </div>

              {/* Balance Card */}
              <div className="bg-gradient-to-br from-secondary to-primary rounded-xl p-6 mb-6 text-white">
                <div className="text-sm opacity-90 mb-2">Total Escrow Balance</div>
                <div className="text-3xl mb-4">$152,450</div>
                <div className="flex gap-4">
                  <div>
                    <div className="text-xs opacity-75">Paid to Date</div>
                    <div className="text-sm">$1,500</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">Remaining</div>
                    <div className="text-sm">$150,950</div>
                  </div>
                </div>
              </div>

              {/* Recent Payments - Surrogacy Specific */}
              <div className="space-y-3">
                {/* Escrow Funding */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Escrow Funding</div>
                      <div className="text-xs text-gray-500">Dec 1, 2025</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 font-medium ml-2">$152,450</div>
                </div>

                {/* Embryo Transfer Payment */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Embryo Transfer Payment</div>
                      <div className="text-xs text-gray-500">Nov 15, 2025</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 font-medium ml-2">$1,500</div>
                </div>

                {/* Heartbeat Confirmation Payment */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">Heartbeat Confirmation</div>
                      <div className="text-xs text-gray-500">Pending documentation</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 font-medium ml-2">$7,500</div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-full opacity-40 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full opacity-40 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}