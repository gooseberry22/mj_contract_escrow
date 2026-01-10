import { useState, useEffect } from 'react';
import { 
  Loader2, 
  FileText, 
  CheckCircle, 
  Sparkles,
  Search,
  DollarSign,
  Calendar,
  Shield
} from 'lucide-react';
import logo from 'figma:asset/772aa6854dfe11f4288b7a955fea018059bbad2d.png';

interface ContractParsingProps {
  onComplete: () => void;
  onBack: () => void;
}

export function ContractParsing({ onComplete, onBack }: ContractParsingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { 
      label: 'Uploading contract', 
      description: 'Securely transferring your document',
      icon: FileText,
      duration: 1500
    },
    { 
      label: 'Analyzing contract structure', 
      description: 'Reading sections and clauses',
      icon: Search,
      duration: 2000
    },
    { 
      label: 'Extracting milestone payments', 
      description: 'Identifying payment schedules and amounts',
      icon: DollarSign,
      duration: 2500
    },
    { 
      label: 'Verifying insurance terms', 
      description: 'Checking coverage requirements',
      icon: Shield,
      duration: 1800
    },
    { 
      label: 'Mapping key dates', 
      description: 'Creating timeline from contract terms',
      icon: Calendar,
      duration: 1500
    },
    { 
      label: 'Finalizing contract template', 
      description: 'Preparing your personalized dashboard',
      icon: Sparkles,
      duration: 2000
    }
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, steps[currentStep].duration);
      return () => clearTimeout(timer);
    } else {
      // All steps complete, move to contract template
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStep, steps, onComplete]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={logo} alt="The Biggest Ask" className="h-10 w-10" />
              <span className="text-gray-900">The Biggest Ask</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="max-w-2xl w-full">
          {/* Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-gray-900 mb-2">Analyzing Your Contract</h1>
              <p className="text-gray-600">
                Our AI is reading your contract and setting up your personalized dashboard. This usually takes 30-60 seconds.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-gray-500 text-sm text-center">
                {Math.round(progress)}% Complete
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isComplete = index < currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div 
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-300 ${
                      isCurrent ? 'bg-primary/5 border border-primary/20' : 
                      isComplete ? 'bg-green-50 border border-green-200' : 
                      'bg-gray-50 border border-gray-200 opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isComplete ? 'bg-green-500' : 
                      isCurrent ? 'bg-primary' : 
                      'bg-gray-300'
                    }`}>
                      {isComplete ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : isCurrent ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <StepIcon className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className={`text-gray-900 mb-1 ${isCurrent ? 'font-semibold' : ''}`}>
                        {step.label}
                      </h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Note */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 text-sm">
                <strong>What happens next:</strong> Once analysis is complete, you'll review the extracted contract terms and confirm they're correct before proceeding.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
