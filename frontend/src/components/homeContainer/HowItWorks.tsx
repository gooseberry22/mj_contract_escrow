import { Upload, GitBranch, DollarSign } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '1',
      icon: Upload,
      title: 'Upload contract',
      subtitle: 'AI parses details instantly',
      description: 'Upload your surrogacy contract and our AI automatically extracts key terms, payment schedules, milestone requirements, and reimbursement rules.',
      description2: 'We then share a clean, structured summary with your Gestational Carrier for confirmation. Once both parties confirm, these details become the foundation of your automated escrow.',
      benefits: [
        'No manual data entry',
        'No guessing what\'s covered',
        'Clear, shared understanding for everyone from day one'
      ]
    },
    {
      number: '2',
      icon: GitBranch,
      title: 'Approvals flow',
      subtitle: 'GC submits → AI verifies → we confirm',
      description: 'Your surrogate can submit expenses or milestone confirmations directly through the platform.',
      description2: 'Our AI reviews each request against the contract, flags any mismatches or missing documentation, and prepares a quick summary for our team to approve.',
      benefits: [
        'Automatic verification against contract terms',
        'Immediate alerts for anything outside the agreement',
        'A transparent, documented approval trail'
      ]
    },
    {
      number: '3',
      icon: DollarSign,
      title: 'Funds disbursed automatically',
      subtitle: 'Secure and transparent',
      description: 'Once approved, payments are released automatically from the escrow account.',
      description2: 'Every transaction includes a full audit trail, timestamps, and instant notifications to both parties.',
      benefits: [
        'Bank-level security',
        'Clear recordkeeping for legal, tax, and insurance needs',
        'Real-time balance and payment history at your fingertips'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Three simple steps to automate your surrogacy journey payments
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gray-200" style={{ width: 'calc(100% - 16rem)', left: '8rem' }}></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow h-full flex flex-col">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center z-10">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 mt-4">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-primary mb-4">
                    {step.subtitle}
                  </p>
                  <p className="text-gray-600 mb-3">
                    {step.description}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {step.description2}
                  </p>
                  
                  {/* Benefits */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <p className="text-gray-700 text-sm mb-2">
                      {index === 0 && 'What this means for you:'}
                      {index === 1 && 'You get:'}
                      {index === 2 && 'Built for peace of mind:'}
                    </p>
                    <ul className="space-y-2">
                      {step.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="text-gray-600 text-sm flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}