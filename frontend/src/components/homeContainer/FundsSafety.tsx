import { Landmark, Shield, Cpu, CheckCircle, Send, ArrowRight, UserCheck } from 'lucide-react';

export function FundsSafety() {
  const steps = [
    {
      number: '1',
      icon: Landmark,
      title: 'Intended Parents fund the escrow account',
      subtitle: 'Deposit goes directly into a segregated, FDIC-insured FBO account at NBH Bank.',
      color: 'bg-secondary/10'
    },
    {
      number: '2',
      icon: Shield,
      title: 'Funds remain fully separated',
      subtitle: 'No pooling, no commingling with other journeys.',
      color: 'bg-accent/20'
    },
    {
      number: '3',
      icon: Cpu,
      title: 'AI provides the first, efficient layer',
      subtitle: 'AI analyzes reimbursement requests to ensure contract conditions are met.',
      color: 'bg-primary/10'
    },
    {
      number: '4',
      icon: UserCheck,
      title: 'Human verification before release',
      subtitle: 'Our team verifies everything the AI applies, then sends a request to the bank to release funds.',
      color: 'bg-secondary/10'
    },
    {
      number: '5',
      icon: Send,
      title: 'Bank releases funds securely',
      subtitle: 'Automatic disbursement with full audit trail.',
      color: 'bg-accent/20'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">
            How Your Funds Stay Safe
          </h2>
        </div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative flex items-start justify-between gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative flex-1">
                  {/* Step Box */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                    {/* Icon */}
                    <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>

                    {/* Number Badge */}
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-secondary text-white rounded-full text-sm mb-3">
                      {step.number}
                    </div>

                    {/* Content */}
                    <h4 className="text-gray-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Arrow Connector */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-20 -right-6 flex items-center justify-center z-10">
                      <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile/Tablet: Vertical Stack */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index}>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-secondary" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="inline-flex items-center justify-center w-6 h-6 bg-secondary text-white rounded-full text-sm mb-2">
                        {step.number}
                      </div>
                      <h4 className="text-gray-900 mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector for mobile */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-5 h-5 text-gray-300 transform rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}