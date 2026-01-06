// Shared Payment Data - Single Source of Truth
// This file represents the actual payment state driven by surrogate actions

import { getMilestoneById } from './milestoneData';

// Get milestone data
const embryoTransferMilestone = getMilestoneById('A5');
const heartbeatMilestone = getMilestoneById('B2');
const monthlyCompMilestone = getMilestoneById('C1');

export interface PaymentTransaction {
  id: string;
  date: string;
  milestoneId?: string;
  milestoneName?: string;
  description: string;
  category: 'Milestone Payment' | 'Reimbursement' | 'Deposit' | 'Insurance';
  amount: string;
  amountNumeric: number;
  status: 'Completed' | 'Pending' | 'Approved' | 'Scheduled' | 'Processing Soon';
  submittedBy?: 'surrogate' | 'system';
  documentsSubmitted?: string[];
}

export interface UpcomingPayment {
  id: string;
  date: string;
  milestoneId?: string;
  milestoneName?: string;
  description: string;
  amount: string;
  amountNumeric: number;
  status: 'Pending Conditions' | 'Scheduled' | 'Processing Soon' | 'Awaiting Documentation';
  requiredDocuments?: string[];
  surrogateAction?: string;
}

// COMPLETED PAYMENTS - Historical record
export const completedPayments: PaymentTransaction[] = [
  {
    id: 'pay-001',
    date: 'Oct 1, 2025',
    description: 'Initial Escrow Deposit',
    category: 'Deposit',
    amount: '$152,450',
    amountNumeric: 152450,
    status: 'Completed',
    submittedBy: 'system'
  },
  {
    id: 'pay-002',
    date: 'Nov 15, 2025',
    milestoneId: 'A5',
    milestoneName: embryoTransferMilestone?.name || 'Embryo Transfer',
    description: `Milestone Payment: ${embryoTransferMilestone?.name || 'Embryo Transfer'}`,
    category: 'Milestone Payment',
    amount: '$1,500',
    amountNumeric: 1500,
    status: 'Completed',
    submittedBy: 'surrogate',
    documentsSubmitted: embryoTransferMilestone?.documentsRequired || []
  },
  {
    id: 'pay-003',
    date: 'Nov 28, 2025',
    description: 'Reimbursement: Prenatal Vitamins',
    category: 'Reimbursement',
    amount: '$45',
    amountNumeric: 45,
    status: 'Completed',
    submittedBy: 'surrogate',
    documentsSubmitted: ['Receipt from pharmacy']
  },
  {
    id: 'pay-004',
    date: 'Dec 1, 2025',
    milestoneId: 'C1',
    milestoneName: monthlyCompMilestone?.name || 'Monthly Base Compensation',
    description: `Milestone Payment: ${monthlyCompMilestone?.name || 'Monthly Base Compensation'}`,
    category: 'Milestone Payment',
    amount: '$5,000',
    amountNumeric: 5000,
    status: 'Completed',
    submittedBy: 'system' // Automated monthly payment
  }
];

// Surrogate-only transactions (what they've been PAID)
export const surrogateReceivedPayments = completedPayments.filter(
  p => p.category !== 'Deposit' && p.category !== 'Insurance'
);

// UPCOMING PAYMENTS - Driven by surrogate milestone submissions
export const upcomingPayments: UpcomingPayment[] = [
  {
    id: 'upcoming-001',
    date: 'Dec 10, 2025',
    milestoneId: 'B2',
    milestoneName: heartbeatMilestone?.name || 'Heartbeat Confirmation',
    description: `Milestone: ${heartbeatMilestone?.name || 'Heartbeat Confirmation'}`,
    amount: '$7,500',
    amountNumeric: 7500,
    status: 'Pending Conditions',
    requiredDocuments: heartbeatMilestone?.documentsRequired || [],
    surrogateAction: 'Upload ultrasound report with heartbeat confirmation'
  },
  {
    id: 'upcoming-002',
    date: 'Jan 1, 2026',
    milestoneId: 'C1',
    milestoneName: monthlyCompMilestone?.name || 'Monthly Base Compensation',
    description: `Milestone: ${monthlyCompMilestone?.name || 'Monthly Base Compensation'}`,
    amount: '$5,000',
    amountNumeric: 5000,
    status: 'Scheduled',
    surrogateAction: 'Automated - no action needed'
  },
  {
    id: 'upcoming-003',
    date: 'Jan 1, 2026',
    description: 'Monthly Insurance Premium',
    category: 'Insurance',
    amount: '$450',
    amountNumeric: 450,
    status: 'Processing Soon'
  }
];

// REIMBURSEMENT REQUESTS - Submitted by surrogate
export const reimbursementRequests = [
  {
    id: 'reimb-001',
    title: 'Mileage reimbursement',
    date: 'Dec 1, 2025',
    amount: '$120',
    amountNumeric: 120,
    status: 'Approved',
    documentsSubmitted: ['Mileage log', 'Google Maps routes']
  },
  {
    id: 'reimb-002',
    title: 'Prenatal vitamins',
    date: 'Nov 28, 2025',
    amount: '$45',
    amountNumeric: 45,
    status: 'Pending',
    documentsSubmitted: ['Receipt']
  },
  {
    id: 'reimb-003',
    title: 'Medical appointment parking',
    date: 'Nov 25, 2025',
    amount: '$15',
    amountNumeric: 15,
    status: 'Paid',
    documentsSubmitted: ['Parking receipt']
  }
];

// Helper functions
export const getTotalEscrowBalance = (): number => {
  const deposits = completedPayments
    .filter(p => p.category === 'Deposit')
    .reduce((sum, p) => sum + p.amountNumeric, 0);
  
  const paid = completedPayments
    .filter(p => p.category !== 'Deposit')
    .reduce((sum, p) => sum + p.amountNumeric, 0);
  
  return deposits - paid;
};

export const getUpcomingPaymentsTotal = (): number => {
  return upcomingPayments.reduce((sum, p) => sum + p.amountNumeric, 0);
};

export const getCompletedMilestonePayments = () => {
  return completedPayments.filter(p => p.category === 'Milestone Payment');
};

export const getPendingMilestonePayments = () => {
  return upcomingPayments.filter(p => p.milestoneId);
};