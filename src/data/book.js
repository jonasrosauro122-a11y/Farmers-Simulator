// Fictional "book of business" used by the Policies and Customers pages.
// Every name, address, and policy number below is invented for training only.

export const seedCustomers = [
  {
    id: 'C001', household: 'Jordan Miller Household', accountType: 'Personal Lines Household',
    primaryContact: 'Jordan Miller', phone: '(555) 204-1180', email: 'jordan.miller@example.com',
    address: '418 Maple Grove Dr', city: 'Boise', state: 'ID', zip: '83702',
    customerStatus: 'Active Client', customerSince: '2021-04-12',
    policyNumbers: ['H09231458', 'A08351724']
  },
  {
    id: 'C002', household: 'Avery Thompson Household', accountType: 'Personal Lines Household',
    primaryContact: 'Avery Thompson', phone: '(555) 204-2291', email: 'avery.t@example.com',
    address: '77 Birchwood Ln', city: 'Reno', state: 'NV', zip: '89509',
    customerStatus: 'Active Client', customerSince: '2019-09-03',
    policyNumbers: ['A08361902']
  },
  {
    id: 'C003', household: 'Mia Carter Household', accountType: 'Personal Lines Household',
    primaryContact: 'Mia Carter', phone: '(555) 204-3340', email: 'mia.carter@example.com',
    address: '1205 Sunset Ridge', city: 'Columbus', state: 'OH', zip: '43215',
    customerStatus: 'Active Client', customerSince: '2022-01-22',
    policyNumbers: ['H09244871', 'U06120033']
  },
  {
    id: 'C004', household: 'Noah Bennett Household', accountType: 'Active Client',
    primaryContact: 'Noah Bennett', phone: '(555) 204-4418', email: 'noah.bennett@example.com',
    address: '9 Harbor View Ct', city: 'Nashville', state: 'TN', zip: '37203',
    customerStatus: 'Active Client', customerSince: '2020-06-18',
    policyNumbers: ['DF07720145']
  },
  {
    id: 'C005', household: 'Riverstone Bakery LLC', accountType: 'Commercial Business',
    primaryContact: 'Dana Riverstone', phone: '(555) 511-7781', email: 'office@riverstone.example',
    address: '300 Commerce St', city: 'Atlanta', state: 'GA', zip: '30303',
    customerStatus: 'Active Client', customerSince: '2018-03-09',
    policyNumbers: ['BOP-771245', 'WC-660392']
  },
  {
    id: 'C006', household: 'BluePeak Plumbing LLC', accountType: 'Commercial Business',
    primaryContact: 'Sam BluePeak', phone: '(555) 511-2204', email: 'admin@bluepeak.example',
    address: '52 Industrial Pkwy', city: 'San Antonio', state: 'TX', zip: '78205',
    customerStatus: 'Active Client', customerSince: '2017-11-14',
    policyNumbers: ['CGL-509281', 'CA-330914']
  },
  {
    id: 'C007', household: 'Northgate Dental Group', accountType: 'Prospect',
    primaryContact: 'Dr. Riley Northgate', phone: '(555) 511-9930', email: 'frontdesk@northgate.example',
    address: '8800 Wellness Blvd', city: 'Phoenix', state: 'AZ', zip: '85004',
    customerStatus: 'Prospect', customerSince: '',
    policyNumbers: []
  },
  {
    id: 'C008', household: 'Summit Auto Repair LLC', accountType: 'Commercial Business',
    primaryContact: 'Casey Summit', phone: '(555) 511-6650', email: 'shop@summitauto.example',
    address: '14 Garage Row', city: 'Denver', state: 'CO', zip: '80205',
    customerStatus: 'Active Client', customerSince: '2016-07-30',
    policyNumbers: ['BOP-778820', 'WC-661145']
  }
];

export const seedPolicies = [
  { policyNumber: 'H09231458', customerId: 'C001', household: 'Jordan Miller Household', lob: 'Homeowners', carrier: 'LAVA Sim Mutual', effectiveDate: '2024-04-12', expirationDate: '2025-04-12', premium: 2180, status: 'Active', billingStatus: 'Current' },
  { policyNumber: 'A08351724', customerId: 'C001', household: 'Jordan Miller Household', lob: 'Personal Auto', carrier: 'LAVA Sim Mutual', effectiveDate: '2024-04-12', expirationDate: '2025-04-12', premium: 1640, status: 'Active', billingStatus: 'Current' },
  { policyNumber: 'A08361902', customerId: 'C002', household: 'Avery Thompson Household', lob: 'Personal Auto', carrier: 'LAVA Sim Direct', effectiveDate: '2024-09-03', expirationDate: '2025-09-03', premium: 1490, status: 'Active', billingStatus: 'Pending Cancellation (Non-Pay)' },
  { policyNumber: 'H09244871', customerId: 'C003', household: 'Mia Carter Household', lob: 'Homeowners', carrier: 'LAVA Sim Mutual', effectiveDate: '2024-01-22', expirationDate: '2025-01-22', premium: 1975, status: 'Renewal Pending', billingStatus: 'Current' },
  { policyNumber: 'U06120033', customerId: 'C003', household: 'Mia Carter Household', lob: 'Personal Umbrella', carrier: 'LAVA Sim Mutual', effectiveDate: '2024-01-22', expirationDate: '2025-01-22', premium: 360, status: 'Active', billingStatus: 'Current' },
  { policyNumber: 'DF07720145', customerId: 'C004', household: 'Noah Bennett Household', lob: 'Dwelling Fire', carrier: 'LAVA Sim Specialty', effectiveDate: '2024-06-18', expirationDate: '2025-06-18', premium: 1120, status: 'Active', billingStatus: 'Current' },
  { policyNumber: 'BOP-771245', customerId: 'C005', household: 'Riverstone Bakery LLC', lob: 'Business Owners Policy', carrier: 'LAVA Sim Commercial', effectiveDate: '2024-03-09', expirationDate: '2025-03-09', premium: 4850, status: 'Active', billingStatus: 'Current' },
  { policyNumber: 'WC-660392', customerId: 'C005', household: 'Riverstone Bakery LLC', lob: 'Workers Compensation', carrier: 'LAVA Sim Commercial', effectiveDate: '2024-03-09', expirationDate: '2025-03-09', premium: 6200, status: 'Audit Pending', billingStatus: 'Current' },
  { policyNumber: 'CGL-509281', customerId: 'C006', household: 'BluePeak Plumbing LLC', lob: 'General Liability', carrier: 'LAVA Sim Commercial', effectiveDate: '2024-11-14', expirationDate: '2025-11-14', premium: 3380, status: 'Active', billingStatus: 'Current' },
  { policyNumber: 'CA-330914', customerId: 'C006', household: 'BluePeak Plumbing LLC', lob: 'Business Auto', carrier: 'LAVA Sim Commercial', effectiveDate: '2024-11-14', expirationDate: '2025-11-14', premium: 2740, status: 'Active', billingStatus: 'Current' },
  { policyNumber: 'BOP-778820', customerId: 'C008', household: 'Summit Auto Repair LLC', lob: 'Business Owners Policy', carrier: 'LAVA Sim Commercial', effectiveDate: '2024-07-30', expirationDate: '2025-07-30', premium: 5210, status: 'Renewal Pending', billingStatus: 'Current' },
  { policyNumber: 'WC-661145', customerId: 'C008', household: 'Summit Auto Repair LLC', lob: 'Workers Compensation', carrier: 'LAVA Sim Commercial', effectiveDate: '2024-07-30', expirationDate: '2025-07-30', premium: 7350, status: 'Active', billingStatus: 'Current' }
];

export const LOB_OPTIONS = [
  'Homeowners', 'Personal Auto', 'Renters', 'Condo', 'Dwelling Fire', 'Personal Umbrella',
  'General Liability', 'Business Auto', 'Business Owners Policy', 'Workers Compensation', 'Commercial Property'
];

export const POLICY_STATUSES = ['Active', 'Renewal Pending', 'Audit Pending', 'Pending Cancellation', 'Cancelled'];
