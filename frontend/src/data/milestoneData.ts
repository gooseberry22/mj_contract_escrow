// Shared milestone data used across the entire application
// This simulates a backend database where milestone definitions are centralized

export interface MilestoneDefinition {
  id: string;
  category: string;
  name: string;
  gcPerspective: string[];
  ipPerspective: string[];
  timing: string;
  documentsRequired: string[];
  contractClause: string;
  typicalAmount: string;
}

export const MILESTONE_DATABASE: MilestoneDefinition[] = [
  // A. Pre-Pregnancy Milestones
  {
    id: 'A1',
    category: 'Pre-Pregnancy',
    name: 'Contract Signed',
    gcPerspective: ['Small early fee', 'Can submit screening expenses'],
    ipPerspective: ['Pay early fee', 'Enable expense reimbursements'],
    timing: 'Day 1',
    documentsRequired: ['Signed contract'],
    contractClause: 'Section 1.2',
    typicalAmount: '$500 - $1,000'
  },
  {
    id: 'A2',
    category: 'Pre-Pregnancy',
    name: 'Medical Screening Completed',
    gcPerspective: ['Screening fee', 'Travel reimbursement', 'Lost wages', 'Childcare'],
    ipPerspective: ['Pay screening fee', 'Reimburse all screening costs'],
    timing: 'Week 1-2',
    documentsRequired: ['Medical clearance letter', 'Travel receipts', 'Childcare receipts'],
    contractClause: 'Section 2.1',
    typicalAmount: '$500 - $1,500'
  },
  {
    id: 'A3',
    category: 'Pre-Pregnancy',
    name: 'Mock Cycle Completed',
    gcPerspective: ['Mock cycle fee', 'Medication reimbursement', 'Travel costs'],
    ipPerspective: ['Pay mock cycle fee', 'Reimburse medications & travel'],
    timing: 'Week 3-4',
    documentsRequired: ['Clinic completion letter', 'Medication receipts', 'Travel receipts'],
    contractClause: 'Section 2.3',
    typicalAmount: '$500 - $1,000'
  },
  {
    id: 'A4',
    category: 'Pre-Pregnancy',
    name: 'Start of Medications',
    gcPerspective: ['Medication-start fee', 'Prescription reimbursements', 'Monitoring mileage'],
    ipPerspective: ['Pay medication fee', 'Reimburse prescriptions & mileage'],
    timing: 'Week 5-6',
    documentsRequired: ['Medication start confirmation', 'Pharmacy receipts', 'Mileage log'],
    contractClause: 'Section 2.4',
    typicalAmount: '$300 - $800'
  },
  {
    id: 'A5',
    category: 'Pre-Pregnancy',
    name: 'Embryo Transfer',
    gcPerspective: ['Transfer fee', 'Travel costs', 'Lost wages', 'Childcare'],
    ipPerspective: ['Pay transfer fee', 'Reimburse all transfer-related expenses'],
    timing: 'Week 7-8',
    documentsRequired: ['Transfer procedure note', 'Travel receipts', 'Lost wage documentation'],
    contractClause: 'Section 2.5',
    typicalAmount: '$1,000 - $2,500'
  },

  // B. Pregnancy Confirmation Milestones
  {
    id: 'B1',
    category: 'Pregnancy Confirmation',
    name: 'Positive Beta (hCG)',
    gcPerspective: ['Lab visit reimbursements only', 'No compensation payment at this milestone'],
    ipPerspective: ['Reimburse lab visit costs', 'No base compensation due yet'],
    timing: '10-14 days post-transfer',
    documentsRequired: ['Beta hCG test results', 'Mileage/parking receipts'],
    contractClause: 'Section 3.1',
    typicalAmount: '$0 (reimbursements only)'
  },
  {
    id: 'B2',
    category: 'Pregnancy Confirmation',
    name: 'Heartbeat Confirmation',
    gcPerspective: ['Base compensation begins', 'Proportionate amount starts', 'Paid at periodic intervals per contract'],
    ipPerspective: ['Triggers start of base compensation', 'Periodic payments begin per contract schedule'],
    timing: '6-7 weeks pregnant',
    documentsRequired: ['Ultrasound report with heartbeat confirmation', 'Travel receipts'],
    contractClause: 'Section 3.2',
    typicalAmount: 'Varies - triggers periodic payments'
  },
  {
    id: 'B3',
    category: 'Pregnancy Confirmation',
    name: 'Graduation From IVF Clinic',
    gcPerspective: ['Graduation fee', 'OB visit reimbursements'],
    ipPerspective: ['Pay graduation fee', 'Reimburse first OB visit'],
    timing: '8-10 weeks pregnant',
    documentsRequired: ['IVF clinic discharge letter', 'OB acceptance letter', 'Visit receipts'],
    contractClause: 'Section 3.3',
    typicalAmount: '$500 - $1,500'
  },

  // C. Pregnancy Progression Milestones
  {
    id: 'C1',
    category: 'Pregnancy Progression',
    name: 'Monthly Base Compensation',
    gcPerspective: ['Monthly payment', 'Ongoing pregnancy support'],
    ipPerspective: ['Automated monthly payment', 'Track pregnancy progression'],
    timing: 'Monthly until delivery',
    documentsRequired: ['Monthly OB confirmation (automated after setup)'],
    contractClause: 'Section 4.1',
    typicalAmount: '$2,500 - $5,000/month'
  },
  {
    id: 'C2',
    category: 'Pregnancy Progression',
    name: 'Multiples Detected',
    gcPerspective: ['One-time multiples fee', 'Additional monthly comp', 'Extra monitoring reimbursements'],
    ipPerspective: ['Pay multiples fee', 'Increase monthly payments', 'Reimburse additional monitoring'],
    timing: 'When detected (usually 6-12 weeks)',
    documentsRequired: ['Ultrasound showing multiples', 'Doctor\'s letter'],
    contractClause: 'Section 4.3',
    typicalAmount: '$5,000 - $15,000'
  },
  {
    id: 'C3',
    category: 'Pregnancy Progression',
    name: 'Invasive Medical Procedure',
    gcPerspective: ['Procedure fee', 'Travel reimbursement', 'Childcare', 'Lost wages'],
    ipPerspective: ['Pay procedure fee', 'Reimburse all related expenses'],
    timing: 'As needed',
    documentsRequired: ['Procedure authorization', 'Medical records', 'Expense receipts'],
    contractClause: 'Section 4.5',
    typicalAmount: '$1,000 - $3,000'
  },
  {
    id: 'C4',
    category: 'Pregnancy Progression',
    name: 'Bed Rest (Physician-Ordered)',
    gcPerspective: ['Weekly bed rest comp', 'Childcare', 'Housekeeping', 'Lost wages', 'Partner lost wages'],
    ipPerspective: ['Pay weekly bed rest fees', 'Reimburse all support services'],
    timing: 'Per week on bed rest',
    documentsRequired: ['Doctor\'s bed rest order', 'Weekly confirmation', 'Expense receipts'],
    contractClause: 'Section 4.6',
    typicalAmount: '$200 - $500/week'
  },
  {
    id: 'C5',
    category: 'Pregnancy Progression',
    name: 'Special Pregnancy Events',
    gcPerspective: ['Selective reduction fee', 'Termination fee', 'Procedure reimbursements'],
    ipPerspective: ['Pay applicable fee', 'Reimburse medical & travel costs'],
    timing: 'As needed',
    documentsRequired: ['Medical authorization', 'Procedure records', 'All expense receipts'],
    contractClause: 'Section 4.7',
    typicalAmount: '$2,000 - $10,000'
  },

  // D. Delivery-Related Milestones
  {
    id: 'D1',
    category: 'Delivery',
    name: 'Delivery / Birth',
    gcPerspective: ['Final base comp installment', 'Delivery fee'],
    ipPerspective: ['Pay final base comp', 'Pay delivery fee'],
    timing: 'At delivery',
    documentsRequired: ['Birth certificate', 'Hospital discharge papers'],
    contractClause: 'Section 5.1',
    typicalAmount: '$5,000 - $15,000'
  },
  {
    id: 'D2',
    category: 'Delivery',
    name: 'C-Section Delivery',
    gcPerspective: ['C-section fee', 'Extra recovery reimbursements'],
    ipPerspective: ['Pay C-section fee', 'Reimburse extended recovery costs'],
    timing: 'If C-section performed',
    documentsRequired: ['Surgical records', 'Recovery documentation', 'Expense receipts'],
    contractClause: 'Section 5.2',
    typicalAmount: '$2,000 - $5,000'
  },
  {
    id: 'D3',
    category: 'Delivery',
    name: 'Multiple Birth Delivery',
    gcPerspective: ['Additional multiple-birth fee', 'Extra medical reimbursements'],
    ipPerspective: ['Pay multiple birth fee', 'Reimburse additional costs'],
    timing: 'At delivery of multiples',
    documentsRequired: ['Birth certificates (all babies)', 'Hospital records'],
    contractClause: 'Section 5.3',
    typicalAmount: '$3,000 - $8,000'
  },

  // E. Postpartum Milestones
  {
    id: 'E1',
    category: 'Postpartum',
    name: 'Postpartum Recovery',
    gcPerspective: ['Lost wages', 'Medical co-pays', 'Childcare', 'Housekeeping'],
    ipPerspective: ['Reimburse recovery-related expenses'],
    timing: '6-12 weeks postpartum',
    documentsRequired: ['Medical records', 'Expense receipts', 'Lost wage documentation'],
    contractClause: 'Section 6.1',
    typicalAmount: '$500 - $2,000'
  },
  {
    id: 'E2',
    category: 'Postpartum',
    name: 'Pumping Breast Milk',
    gcPerspective: ['Monthly pumping fee', 'Supply reimbursements', 'Shipping costs'],
    ipPerspective: ['Pay monthly pumping fee', 'Reimburse all pumping expenses'],
    timing: 'Per month of pumping',
    documentsRequired: ['Pumping log', 'Supply receipts', 'Shipping receipts'],
    contractClause: 'Section 6.2',
    typicalAmount: '$250 - $500/month'
  },

  // F. Allowance & Administrative Milestones
  {
    id: 'F1',
    category: 'Allowances',
    name: 'Maternity Clothing Allowance',
    gcPerspective: ['One-time stipend or receipt reimbursement'],
    ipPerspective: ['Pay clothing allowance'],
    timing: 'Usually 2nd trimester',
    documentsRequired: ['Receipts (if receipt-based)'],
    contractClause: 'Section 7.1',
    typicalAmount: '$500 - $1,500'
  },
  {
    id: 'F2',
    category: 'Allowances',
    name: 'Monthly Allowances',
    gcPerspective: ['Wellness allowance', 'Phone allowance', 'Local mileage stipend'],
    ipPerspective: ['Pay monthly allowances'],
    timing: 'Monthly during pregnancy',
    documentsRequired: ['None (automated) or mileage logs'],
    contractClause: 'Section 7.2',
    typicalAmount: '$100 - $300/month'
  },
  {
    id: 'F3',
    category: 'Allowances',
    name: 'Insurance-Related Events',
    gcPerspective: ['Premium payments', 'Co-pay reimbursements'],
    ipPerspective: ['Pay insurance premiums', 'Reimburse pregnancy co-pays'],
    timing: 'Monthly or as incurred',
    documentsRequired: ['Insurance bills', 'Co-pay receipts'],
    contractClause: 'Section 7.3',
    typicalAmount: '$200 - $1,000/month'
  },
];

// Helper function to get milestone by ID
export function getMilestoneById(id: string): MilestoneDefinition | undefined {
  return MILESTONE_DATABASE.find(m => m.id === id);
}

// Helper function to get milestones by category
export function getMilestonesByCategory(category: string): MilestoneDefinition[] {
  return MILESTONE_DATABASE.filter(m => m.category === category);
}