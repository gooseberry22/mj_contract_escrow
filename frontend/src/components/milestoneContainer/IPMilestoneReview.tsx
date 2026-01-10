import { 
  CheckCircle, 
  X,
  MessageCircle,
  FileText,
  Calendar,
  DollarSign,
  Sparkles,
  Receipt,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface MilestoneSubmission {
  id: number;
  type: string;
  category: string;
  description: string;
  amount: string;
  submittedDate: string;
  gcName: string;
  documentsProvided: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  contractClause: string;
  aiVerificationStatus: 'verified' | 'review_needed' | 'flagged';
  aiNotes: string;
  gcNotes?: string;
}

export function IPMilestoneReview() {
  const pendingSubmissions: MilestoneSubmission[] = [
    {
      id: 1,
      type: 'C-Section Delivery',
      category: 'Delivery',
      description: 'C-section fee as outlined in contract Section 5.2',
      amount: '$3,500.00',
      submittedDate: 'Dec 4, 2025',
      gcName: 'Maria',
      documentsProvided: [
        { name: 'Surgical_Records_12-3-2025.pdf', type: 'PDF', url: '#' },
        { name: 'Hospital_Discharge_Summary.pdf', type: 'PDF', url: '#' },
        { name: 'Birth_Certificate.pdf', type: 'PDF', url: '#' }
      ],
      contractClause: 'Section 5.2 - C-Section Compensation',
      aiVerificationStatus: 'verified',
      aiNotes: 'All required documentation provided. C-section procedure confirmed via surgical records dated 12/3/2025. Amount matches contract terms ($3,500 for C-section delivery). Recommended for approval.',
      gcNotes: 'Emergency C-section performed on December 3rd. Hospital discharge was December 5th. All babies are healthy and doing well!'
    },
    {
      id: 2,
      type: 'Bed Rest - Week 3',
      category: 'Pregnancy Progression',
      description: 'Weekly bed rest compensation for physician-ordered bed rest',
      amount: '$350.00',
      submittedDate: 'Dec 3, 2025',
      gcName: 'Maria',
      documentsProvided: [
        { name: 'Bed_Rest_Order_Dr_Smith.pdf', type: 'PDF', url: '#' },
        { name: 'Weekly_Confirmation_Week3.pdf', type: 'PDF', url: '#' },
        { name: 'Childcare_Receipt_Nov25-Dec1.jpg', type: 'Image', url: '#' }
      ],
      contractClause: 'Section 4.6 - Bed Rest Compensation',
      aiVerificationStatus: 'verified',
      aiNotes: 'Physician-ordered bed rest confirmed. Week 3 of ongoing bed rest period. Amount aligns with contract ($350/week). Doctor\'s note and weekly confirmation both provided. Childcare receipt attached for reimbursement tracking.',
      gcNotes: 'This is week 3 of bed rest. Childcare costs included for my 2 children while I\'m unable to care for them.'
    },
    {
      id: 3,
      type: 'Maternity Clothing Allowance',
      category: 'Allowances & Reimbursements',
      description: 'Maternity clothing purchases - second trimester allowance',
      amount: '$750.00',
      submittedDate: 'Dec 2, 2025',
      gcName: 'Maria',
      documentsProvided: [
        { name: 'Target_Receipt_11-28-2025.jpg', type: 'Image', url: '#' },
        { name: 'Amazon_Receipt_Maternity_Clothes.pdf', type: 'PDF', url: '#' },
        { name: 'Old_Navy_Receipt.jpg', type: 'Image', url: '#' }
      ],
      contractClause: 'Section 7.1 - Maternity Clothing',
      aiVerificationStatus: 'verified',
      aiNotes: 'Contract allows $1,000 one-time maternity clothing allowance or receipt-based reimbursement. This request totals $750 across 3 receipts. All receipts verified as maternity clothing purchases. Within allowance limit.',
      gcNotes: 'Purchased maternity jeans, tops, and work clothes as I\'m now showing and regular clothes don\'t fit.'
    },
    {
      id: 4,
      type: 'Mileage to OB Appointment',
      category: 'Allowances & Reimbursements',
      description: 'Travel reimbursement for monthly OB visit',
      amount: '$47.50',
      submittedDate: 'Dec 1, 2025',
      gcName: 'Maria',
      documentsProvided: [
        { name: 'Mileage_Log_November.pdf', type: 'PDF', url: '#' },
        { name: 'OB_Appointment_Confirmation.jpg', type: 'Image', url: '#' }
      ],
      contractClause: 'Section 7.2 - Mileage Reimbursement',
      aiVerificationStatus: 'verified',
      aiNotes: 'Mileage calculated at 95 miles round trip × $0.50/mile = $47.50. Contract specifies $0.50 per mile for medical appointments. Appointment confirmation and mileage log both provided.',
      gcNotes: 'Round trip to Dr. Smith\'s office for monthly checkup on Nov 28th.'
    }
  ];

  const getAIStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            <Sparkles className="w-3 h-3" />
            AI Verified
          </span>
        );
      case 'review_needed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
            <AlertCircle className="w-3 h-3" />
            Review Needed
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
            <AlertCircle className="w-3 h-3" />
            Flagged
          </span>
        );
    }
  };

  const handleApprove = (id: number) => {
    alert('Milestone approved! Payment will be processed within 24 hours.');
  };

  const handleDeny = (id: number) => {
    alert('Milestone denied. Your surrogate will be notified.');
  };

  const handleContactSupport = (id: number) => {
    alert('Our support team will reach out within 2 hours to discuss this milestone.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-gray-900">Milestone Review</h1>
              <p className="text-gray-600">Review and approve milestone payment requests from your Gestational Carrier</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-800 rounded-full">
                {pendingSubmissions.length}
              </span>
              <span className="text-gray-600">Pending</span>
            </div>
          </div>
        </div>

        {/* Milestone Submissions */}
        <div className="space-y-6">
          {pendingSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-gray-900">{submission.type}</h2>
                      {getAIStatusBadge(submission.aiVerificationStatus)}
                      <span className="text-gray-500 text-sm">• {submission.category}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{submission.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-gray-900 text-2xl">{submission.amount}</p>
                    <p className="text-gray-500 text-sm">Submitted {submission.submittedDate}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-4">
                    {/* Contract Reference */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-blue-900 text-sm mb-1">Contract Reference</p>
                          <p className="text-blue-700 text-sm">{submission.contractClause}</p>
                          <button className="text-blue-600 hover:text-blue-700 text-xs mt-2 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            View in Contract
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* AI Verification Notes */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-purple-900 text-sm mb-1">AI Verification</p>
                          <p className="text-purple-700 text-sm">{submission.aiNotes}</p>
                        </div>
                      </div>
                    </div>

                    {/* GC Notes */}
                    {submission.gcNotes && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <MessageCircle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-gray-700 text-sm mb-1">Note from {submission.gcName}</p>
                            <p className="text-gray-600 text-sm">{submission.gcNotes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Documents */}
                  <div>
                    <h3 className="text-gray-900 mb-3">Supporting Documents</h3>
                    <div className="space-y-2">
                      {submission.documentsProvided.map((doc, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white border border-gray-200 rounded flex items-center justify-center">
                              {doc.type === 'PDF' ? (
                                <FileText className="w-5 h-5 text-red-500" />
                              ) : (
                                <Receipt className="w-5 h-5 text-green-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-gray-900 text-sm">{doc.name}</p>
                              <p className="text-gray-500 text-xs">{doc.type}</p>
                            </div>
                          </div>
                          <button className="text-secondary hover:underline text-sm flex items-center gap-1">
                            View
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Document Summary */}
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="text-green-700 text-sm">All required documents provided</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-200 mt-6">
                  <button
                    onClick={() => handleApprove(submission.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve & Release Funds
                  </button>
                  <button
                    onClick={() => handleDeny(submission.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Deny Request
                  </button>
                  <button
                    onClick={() => handleContactSupport(submission.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no submissions) */}
        {pendingSubmissions.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-gray-900 mb-2">All Caught Up!</h2>
            <p className="text-gray-600">No pending milestone submissions to review at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
