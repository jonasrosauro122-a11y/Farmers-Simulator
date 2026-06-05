// Customer account records: household, policies, billing, claims, documents, and activity.
// All data is fictional and exists only for navigation training.

import { addDaysISO, todayISO } from '../utils/dates.js';

export const ACCOUNT_STATUSES = ['Active', 'Prospect', 'Pending', 'Cancelled'];
export const POLICY_LINES = ['Personal Auto', 'Homeowners', 'Renters', 'Term Life', 'Personal Umbrella', 'Business Owner Policy', 'General Liability', 'Workers Compensation', 'Commercial Property', 'Commercial Auto'];

export const initialAccounts = [
  {
    id: 'A001',
    household: 'Kim Household',
    primaryContact: 'Evelyn Kim',
    status: 'Active',
    type: 'Personal Lines',
    phone: '(555) 381-5520',
    email: 'evelyn.kim@example.com',
    address: '214 Lakeview St, Madison, WI 53703',
    customerSince: '2022-04-14',
    accountManager: 'Marcus Lee',
    members: [
      { name: 'Evelyn Kim', relation: 'Primary Named Insured', dob: '1986-06-21' },
      { name: 'Daniel Kim', relation: 'Spouse', dob: '1984-02-09' },
      { name: 'Mina Kim', relation: 'Youthful Driver', dob: '2008-11-30' }
    ],
    policies: [
      { number: 'PA-100245', line: 'Personal Auto', status: 'Active', effective: '2026-01-01', expiration: '2027-01-01', premium: 1510 },
      { number: 'HO-204912', line: 'Homeowners', status: 'Active', effective: '2026-03-15', expiration: '2027-03-15', premium: 2140 }
    ],
    billing: { method: 'Auto-pay (checking)', balance: 0, nextDueDate: addDaysISO(18), nextDueAmount: 304.17, status: 'Current' },
    claims: [{ id: 'C101', date: '2025-10-18', policy: 'PA-100245', type: 'Auto glass', status: 'Closed', description: 'Windshield replacement, no deductible applied.' }],
    documents: [
      { id: 'DOC-101', name: 'Auto ID Cards (current term)', type: 'ID Card', date: '2026-01-02' },
      { id: 'DOC-102', name: 'Homeowners Declarations Page', type: 'Dec Page', date: '2026-03-15' }
    ],
    activity: [
      { date: addDaysISO(-1), author: 'Marcus Lee', text: 'Customer prefers email communication.' },
      { date: addDaysISO(-14), author: 'System', text: 'Birthday card task generated for this month.' }
    ]
  },
  {
    id: 'A002',
    household: 'Summit Bakery LLC',
    primaryContact: 'Dana Morris',
    status: 'Active',
    type: 'Commercial Lines',
    phone: '(555) 771-3040',
    email: 'dana@summitbakery.example',
    address: '90 Market Ave, Columbus, OH 43215',
    customerSince: '2023-08-09',
    accountManager: 'Commercial Team',
    members: [
      { name: 'Dana Morris', relation: 'Owner / Primary Contact', dob: '1979-09-12' },
      { name: 'Summit Bakery LLC', relation: 'Named Insured Entity', dob: '—' }
    ],
    policies: [
      { number: 'BOP-881220', line: 'Business Owner Policy', status: 'Active', effective: '2026-02-01', expiration: '2027-02-01', premium: 7350 },
      { number: 'WC-440182', line: 'Workers Compensation', status: 'Renewal Review', effective: '2025-07-01', expiration: addDaysISO(26), premium: 4880 }
    ],
    billing: { method: 'Agency invoice', balance: 612.5, nextDueDate: addDaysISO(14), nextDueAmount: 612.5, status: 'Invoice Open' },
    claims: [],
    documents: [
      { id: 'DOC-201', name: 'Certificate of Insurance — Farmers Market Vendor', type: 'Certificate', date: addDaysISO(-30) },
      { id: 'DOC-202', name: 'WC Payroll Worksheet (renewal)', type: 'Worksheet', date: addDaysISO(-5) }
    ],
    activity: [
      { date: addDaysISO(-5), author: 'Commercial Team', text: 'Collect updated payroll before WC renewal review.' }
    ]
  },
  {
    id: 'A003',
    household: 'Parker Family',
    primaryContact: 'Luis Parker',
    status: 'Active',
    type: 'Personal Lines',
    phone: '(555) 892-0192',
    email: 'luis.parker@example.com',
    address: '783 Willow Court, Raleigh, NC 27601',
    customerSince: '2021-11-03',
    accountManager: 'Jonas',
    members: [
      { name: 'Luis Parker', relation: 'Primary Named Insured', dob: '1990-01-17' },
      { name: 'Renee Parker', relation: 'Spouse', dob: '1991-05-03' }
    ],
    policies: [
      { number: 'PA-681004', line: 'Personal Auto', status: 'Pending Change', effective: '2025-12-10', expiration: '2026-12-10', premium: 1980 }
    ],
    billing: { method: 'Monthly card payment', balance: 165, nextDueDate: addDaysISO(-2), nextDueAmount: 165, status: 'Payment Past Due' },
    claims: [{ id: 'C118', date: addDaysISO(-60), policy: 'PA-681004', type: 'Liability', status: 'Open', description: 'Third-party liability claim in adjuster review. Do not discuss coverage outcome.' }],
    documents: [{ id: 'DOC-301', name: 'Endorsement Request — Add Vehicle', type: 'Request Form', date: addDaysISO(-7) }],
    activity: [
      { date: addDaysISO(-7), author: 'Jonas', text: 'Endorsement request received; assigned to licensed staff for processing.' }
    ]
  },
  {
    id: 'A004',
    household: 'Nguyen Household',
    primaryContact: 'Bao Nguyen',
    status: 'Prospect',
    type: 'Personal Lines',
    phone: '(555) 213-8876',
    email: 'bao.nguyen@example.com',
    address: '45 Birchwood Dr, Sacramento, CA 95814',
    customerSince: '—',
    accountManager: 'Training Team',
    members: [{ name: 'Bao Nguyen', relation: 'Prospect Contact', dob: '1995-03-28' }],
    policies: [],
    billing: { method: 'Not set up', balance: 0, nextDueDate: '—', nextDueAmount: 0, status: 'No Billing' },
    claims: [],
    documents: [],
    activity: [{ date: addDaysISO(-2), author: 'Training Team', text: 'Prospect intake started. Gathering prior carrier and dec pages.' }]
  },
  {
    id: 'A005',
    household: 'Ramos Household',
    primaryContact: 'Carla Ramos',
    status: 'Pending',
    type: 'Personal Lines',
    phone: '(555) 467-2210',
    email: 'carla.ramos@example.com',
    address: '1208 Pinehurst Ln, Tucson, AZ 85701',
    customerSince: todayISO(),
    accountManager: 'Priya Shah',
    members: [{ name: 'Carla Ramos', relation: 'Primary Named Insured', dob: '1988-12-05' }],
    policies: [{ number: 'HO-339875', line: 'Homeowners', status: 'Pending Issue', effective: addDaysISO(10), expiration: addDaysISO(375), premium: 1890 }],
    billing: { method: 'Mortgagee billed (escrow)', balance: 0, nextDueDate: addDaysISO(10), nextDueAmount: 1890, status: 'Awaiting Issue' },
    claims: [],
    documents: [{ id: 'DOC-501', name: 'Signed Application — Homeowners', type: 'Application', date: addDaysISO(-1) }],
    activity: [{ date: addDaysISO(-1), author: 'Priya Shah', text: 'Application submitted to underwriting. Awaiting inspection.' }]
  },
  {
    id: 'A006',
    household: 'Holloway Garage Inc',
    primaryContact: 'Reggie Holloway',
    status: 'Cancelled',
    type: 'Commercial Lines',
    phone: '(555) 980-3145',
    email: 'reggie@hollowaygarage.example',
    address: '310 Industrial Pkwy, Toledo, OH 43604',
    customerSince: '2020-05-19',
    accountManager: 'Commercial Team',
    members: [{ name: 'Reggie Holloway', relation: 'Owner', dob: '1972-07-22' }],
    policies: [{ number: 'GL-220467', line: 'General Liability', status: 'Cancelled', effective: '2025-06-01', expiration: '2026-06-01', premium: 4100 }],
    billing: { method: 'Invoice', balance: 0, nextDueDate: '—', nextDueAmount: 0, status: 'Closed' },
    claims: [],
    documents: [{ id: 'DOC-601', name: 'Cancellation Confirmation', type: 'Notice', date: addDaysISO(-40) }],
    activity: [{ date: addDaysISO(-40), author: 'Commercial Team', text: 'Business sold; coverage cancelled at insured request. Win-back candidate if new ownership inquires.' }]
  }
];
