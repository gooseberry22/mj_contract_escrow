import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'How does your AI escrow work?',
      answer: 'Our platform reads your signed surrogacy contract, extracts all payment terms, and sets up automated rules for compensation, allowances, and reimbursements. Surrogates submit expenses through the dashboard, and AI checks them against the contract and processes approved reimbursements automatically.'
    },
    {
      question: 'Are my funds safe?',
      answer: 'Yes. All client money is held in individual FDIC-insured For-Benefit-Of (FBO) accounts at our partner bank. Funds never sit with us—they remain at the bank at all times and can only move according to your contract and your approvals.'
    },
    {
      question: 'Do you act as the escrow agent?',
      answer: 'Yes. Our team serves as the designated escrow agent, overseeing compliance with your contract and ensuring payments are made accurately and on time.'
    },
    {
      question: 'How quickly are payments processed?',
      answer: 'Approved reimbursements and scheduled contract payments are typically processed same day or next business day, depending on bank cut-off times.'
    },
    {
      question: 'What if my surrogate disagrees with an AI interpretation?',
      answer: 'Our escrow team reviews nearly all surrogate requests directly. When something is unclear or ambiguous, we loop back with your attorneys to confirm the correct interpretation. This ensures all payments follow your contract exactly.'
    },
    {
      question: 'Does this replace my surrogacy agency?',
      answer: 'No. Agencies provide support, matching, and case management. Our escrow handles only the financial side—securely, transparently, and automatically.'
    },
    {
      question: 'Do Intended Parents or surrogates pay any fees?',
      answer: 'Fees are flat, transparent, and charged only to the Intended Parents. Surrogates never pay anything.'
    },
    {
      question: 'Can I use your escrow if I\'m not with an agency?',
      answer: 'Yes. Independent Intended Parents and surrogates can use our escrow service as long as they have a legally valid contract.'
    },
    {
      question: 'Do you support international Intended Parents?',
      answer: 'Not at this time. Escrow services are currently available only for U.S.-based Intended Parents.'
    },
    {
      question: 'I know that TBA is also a surrogacy agency. Is it ethical to also own an escrow company? Aren\'t there conflicts of interest?',
      answer: 'It\'s an important question, and one we\'ve designed our systems to address directly.\n\nOur sister company, The Biggest Ask, offers matching and case management, but our model is individualized. Surrogates are not "signed" to us, and each journey is built around a bespoke contract. This means there are no internal incentives that could influence how or when payments are made.\n\nJust as importantly:\n\n• No coordinators from The Biggest Ask have any involvement in escrow disbursements.\n• The escrow team functions independently, with separate oversight and decision-making.\n• All payments are determined strictly by your contract, and reviewed through our AI rules engine, which applies the terms consistently and without bias.\n• When something is unclear or ambiguous, we consult with the attorneys, not agency staff.\n\nBecause the platform relies on AI to enforce the contract, it removes the subjectivity that can occur in traditional manual escrow. Decisions aren\'t based on relationships, personal judgment, or internal preferences—just the written agreement both parties signed.\n\nThe result is a structure that is more neutral, transparent, and conflict-resistant than the typical agency–escrow setup.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-900 pr-8">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <div className="pt-2 border-t border-gray-100">
                    {faq.answer.split('\n').map((paragraph, pIndex) => {
                      // Check if this is a bullet point
                      if (paragraph.trim().startsWith('•')) {
                        return (
                          <p key={pIndex} className="text-gray-600 mt-2 pl-4">
                            {paragraph.trim()}
                          </p>
                        );
                      }
                      // Regular paragraph
                      return paragraph.trim() ? (
                        <p key={pIndex} className="text-gray-600 mt-2">
                          {paragraph}
                        </p>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}