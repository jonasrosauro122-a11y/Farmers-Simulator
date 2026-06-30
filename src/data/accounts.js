// Customer account records: household, policies, billing, claims, documents, and activity.
// All data is fictional and exists only for navigation training.

import { todayISO } from '../utils/dates.js';

export const ACCOUNT_STATUSES = ['Active', 'Prospect', 'Pending', 'Cancelled'];
export const POLICY_LINES = ['Personal Auto', 'Homeowners', 'Renters', 'Term Life', 'Personal Umbrella', 'Business Owner Policy', 'General Liability', 'Workers Compensation', 'Commercial Property', 'Commercial Auto'];

export const initialAccounts = [
  {
    id: 'A1001',
    household: 'Santini Rivera Household',
    primaryContact: 'Alana Rivera',
    status: 'Active',
    type: 'Personal Lines',
    phone: '(555) 310-4020',
    email: 'alana.rivera@example.com',
    address: '2147 Cypress Lake Dr, Sacramento, CA 95821',
    customerSince: '2022-03-18',
    accountManager: 'Allison Demo Agency',
    customerCode: 'CUST-PL-1048',
    preferredLanguage: 'English',
    communicationPreference: 'Email + Phone',
    members: [
      { name: 'Alana Rivera', relation: 'Primary Named Insured', dob: '1984-07-22' },
      { name: 'Mateo Rivera', relation: 'Spouse / Listed Driver', dob: '1981-11-04' }
    ],
    policies: [
      {
        number: 'PL-200460-782',
        line: 'Homeowners',
        status: 'Active',
        effective: '2026-02-14',
        expiration: '2027-02-14',
        premium: 1888,
        carrier: 'LAVA Sim Personal',
        policyType: 'Homeowners Package',
        policyTerm: '12 Months',
        agentOfRecord: 'Allison Demo Agency',
        underwritingCompany: 'LAVA Sim Insurance Exchange',
        propertyAddress: '2147 Cypress Lake Dr, Sacramento, CA 95821',
        billingAccount: 'BILL-PL-701092',
        coverages: [
          { label: 'Coverage A — Dwelling', value: '$475,000' },
          { label: 'Coverage B — Other Structures', value: '$47,500' },
          { label: 'Coverage C — Personal Property', value: '$237,500' },
          { label: 'Coverage E — Liability', value: '$300,000' }
        ],
        documents: ['Declaration Page', 'Mortgagee Clause', 'Billing Notice', 'Policy Jacket'],
        endorsementQueue: [
          { id: 'END-PL-101', type: 'Mortgagee Update', status: 'Licensed Review', requestedDate: '2026-06-21', note: 'Customer provided corrected lender loan number.' }
        ]
      },
      {
        number: 'AU-083517-240',
        line: 'Personal Auto',
        status: 'Active',
        effective: '2026-02-14',
        expiration: '2027-02-14',
        premium: 1642,
        carrier: 'LAVA Sim Personal',
        policyType: 'Personal Auto Package',
        policyTerm: '12 Months',
        agentOfRecord: 'Allison Demo Agency',
        underwritingCompany: 'LAVA Sim Auto Group',
        billingAccount: 'BILL-PL-701092',
        vehicles: ['2022 Toyota RAV4', '2020 Honda Accord'],
        coverages: [
          { label: 'BI Liability', value: '$100,000 / $300,000' },
          { label: 'PD Liability', value: '$100,000' },
          { label: 'Comprehensive Deductible', value: '$500' },
          { label: 'Collision Deductible', value: '$500' }
        ],
        documents: ['Auto ID Cards', 'Declaration Page', 'Lienholder Notice']
      }
    ],
    billing: {
      accountNumber: 'BILL-PL-701092',
      method: 'Automatic Payment - Bank Account',
      balance: 302.16,
      nextDueDate: '2026-07-14',
      nextDueAmount: 302.16,
      status: 'Current',
      billPlan: 'Monthly EFT',
      payor: 'Alana Rivera',
      mailingAddress: '2147 Cypress Lake Dr, Sacramento, CA 95821',
      paymentHistory: [
        { date: '2026-06-14', type: 'Automatic Payment', amount: 302.16, status: 'Posted' },
        { date: '2026-05-14', type: 'Automatic Payment', amount: 302.16, status: 'Posted' },
        { date: '2026-04-14', type: 'Automatic Payment', amount: 302.16, status: 'Posted' }
      ]
    },
    claims: [],
    documents: [
      { id: 'DOC-PL-001', name: 'Homeowners Declaration Page', type: 'Policy Document', date: '2026-02-14' },
      { id: 'DOC-PL-002', name: 'Auto ID Cards', type: 'Auto Document', date: '2026-02-14' },
      { id: 'DOC-PL-003', name: 'Billing Schedule', type: 'Billing', date: '2026-06-14' }
    ],
    activity: [
      { date: todayISO(), author: 'Training System', text: 'Customer information portal seeded for Personal Lines training. Policy and billing links are clickable simulator records.' },
      { date: '2026-06-21', author: 'Service Team', text: 'Mortgagee update collected. Routed to licensed staff for endorsement review.' }
    ]
  },
  {
    id: 'A2001',
    household: 'Harbor Grove Contractors LLC',
    primaryContact: 'Morgan Lee',
    status: 'Active',
    type: 'Commercial Lines',
    phone: '(555) 620-1184',
    email: 'service@harborgrove.example',
    address: '880 Industrial Way, Phoenix, AZ 85004',
    customerSince: '2020-09-10',
    accountManager: 'Allison Demo Agency',
    customerCode: 'CUST-CL-2217',
    preferredLanguage: 'English',
    communicationPreference: 'Email',
    members: [
      { name: 'Morgan Lee', relation: 'Owner / Primary Contact', dob: '—' },
      { name: 'Riley Chen', relation: 'Office Manager', dob: '—' }
    ],
    policies: [
      {
        number: 'CL-607110-474',
        line: 'Business Owner Policy',
        status: 'Active',
        effective: '2026-01-01',
        expiration: '2027-01-01',
        premium: 5830,
        carrier: 'LAVA Sim Commercial',
        policyType: 'BOP',
        policyTerm: '12 Months',
        agentOfRecord: 'Allison Demo Agency',
        underwritingCompany: 'LAVA Sim Commercial Exchange',
        billingAccount: 'BILL-CL-011099',
        locations: ['880 Industrial Way, Phoenix, AZ 85004'],
        coverages: [
          { label: 'Business Personal Property', value: '$250,000' },
          { label: 'Business Liability', value: '$1,000,000 / $2,000,000' },
          { label: 'Business Income', value: 'Actual Loss Sustained' }
        ],
        documents: ['Declaration Page', 'Policy Forms', 'Evidence of Commercial Property'],
        endorsementQueue: [
          { id: 'END-CL-201', type: 'Add Additional Insured', status: 'Needs Contract Review', requestedDate: '2026-06-24', note: 'Customer uploaded sample certificate wording.' }
        ]
      },
      {
        number: 'CA-330914-CL',
        line: 'Commercial Auto',
        status: 'Active',
        effective: '2026-01-01',
        expiration: '2027-01-01',
        premium: 3275,
        carrier: 'LAVA Sim Commercial',
        policyType: 'Business Auto',
        policyTerm: '12 Months',
        agentOfRecord: 'Allison Demo Agency',
        underwritingCompany: 'LAVA Sim Commercial Exchange',
        billingAccount: 'BILL-CL-011099',
        vehicles: ['2019 Ford Transit', '2021 Chevrolet Silverado'],
        coverages: [
          { label: 'Combined Single Limit', value: '$1,000,000' },
          { label: 'Hired / Non-Owned Auto', value: 'Included' },
          { label: 'Physical Damage Deductible', value: '$1,000' }
        ],
        documents: ['Auto ID Cards', 'Vehicle Schedule', 'Driver Schedule']
      },
      {
        number: 'WC-660392-CL',
        line: 'Workers Compensation',
        status: 'Audit Pending',
        effective: '2026-01-01',
        expiration: '2027-01-01',
        premium: 7210,
        carrier: 'LAVA Sim Commercial',
        policyType: 'Workers Compensation',
        policyTerm: '12 Months',
        agentOfRecord: 'Allison Demo Agency',
        underwritingCompany: 'LAVA Sim Commercial Exchange',
        billingAccount: 'BILL-CL-011099',
        coverages: [
          { label: 'Workers Compensation', value: 'Statutory' },
          { label: "Employer's Liability", value: '$500,000 / $500,000 / $500,000' }
        ],
        documents: ['Declaration Page', 'Audit Worksheet', 'Class Code Schedule']
      }
    ],
    billing: {
      accountNumber: 'BILL-CL-011099',
      method: 'Invoice',
      balance: 740.14,
      nextDueDate: '2026-07-01',
      nextDueAmount: 740.14,
      status: 'Payment Due',
      billPlan: '10-Pay Direct Bill',
      payor: 'Harbor Grove Contractors LLC',
      mailingAddress: '880 Industrial Way, Phoenix, AZ 85004',
      paymentHistory: [
        { date: '2026-06-01', type: 'Invoice', amount: 740.14, status: 'Open' },
        { date: '2026-05-01', type: 'Online Payment', amount: 740.14, status: 'Posted' },
        { date: '2026-04-01', type: 'Online Payment', amount: 740.14, status: 'Posted' }
      ]
    },
    claims: [
      { id: 'CLM-9021', type: 'Commercial Auto', status: 'Closed', date: '2025-08-12', policy: 'CA-330914-CL', description: 'Minor parking lot incident. Closed for training record.' }
    ],
    documents: [
      { id: 'DOC-CL-001', name: 'BOP Declaration Page', type: 'Policy Document', date: '2026-01-01' },
      { id: 'DOC-CL-002', name: 'Commercial Auto ID Cards', type: 'Auto Document', date: '2026-01-01' },
      { id: 'DOC-CL-003', name: 'Workers Comp Audit Worksheet', type: 'Audit', date: '2026-06-10' },
      { id: 'DOC-CL-004', name: 'Certificate Request Packet', type: 'COI Draft', date: '2026-06-24' }
    ],
    activity: [
      { date: todayISO(), author: 'Training System', text: 'Commercial portal seeded with clickable policy, billing, endorsement, and document workflows.' },
      { date: '2026-06-24', author: 'Commercial Service Team', text: 'Additional insured request gathered and placed into licensed review queue.' }
    ]
  }
];
