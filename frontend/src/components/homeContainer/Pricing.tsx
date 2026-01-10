import { Check } from 'lucide-react';

export function Pricing() {
  const features = [
    'AI-assisted reimbursement checks with human verification',
    'Automated milestone payments',
    'Dual fund tracking (platform ledger + NBH Bank ledger)',
    'FDIC-insured escrow accounts',
    'Real-time payment and reimbursement status',
    'Email & SMS notifications',
    '24/7 customer support'
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-600">
            One flat fee per journey. No hidden costs, no surprises.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white border-2 border-secondary rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full mb-4">
                Standard
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-gray-900" style={{ fontSize: '3rem', lineHeight: '1' }}>$500</span>
                <span className="text-gray-600">per journey</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}