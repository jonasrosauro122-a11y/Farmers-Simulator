// Lead records for the Leads module and the Lead Depot queue.
// All people, businesses, and contact details are fictional training data.

import { addDaysISO, todayISO } from '../utils/dates.js';

export const LEAD_STATUSES = ['New', 'Contacted', 'Quoted', 'Follow-Up', 'Converted', 'Lost'];
export const LEAD_INTERESTS = ['Auto', 'Home', 'Renters', 'Life', 'Commercial', 'Umbrella'];
export const LEAD_SOURCES = ['Website', 'Referral', 'Lead Depot', 'Direct Mail', 'Agency Lead Import', 'Walk-In', 'Phone Inquiry', 'Manual Entry'];
export const LINES = ['Personal Lines', 'Commercial Lines'];

export const initialLeads = [];

// Unclaimed leads sitting in the Lead Depot queue. Claiming one moves it into "My Leads".
export const initialDepotLeads = [
  {
    id: 'D001', name: 'Olivia Tran', type: 'Personal Lines', interest: 'Auto', product: 'Personal Auto',
    priority: 'High', source: 'Lead Depot', phone: '(555) 700-1121', email: 'olivia.tran@example.com',
    city: 'San Antonio', state: 'TX', premium: 1650, receivedDate: todayISO(),
    summary: 'Two-vehicle household shopping at renewal. Requested call after 3 PM.'
  },
  {
    id: 'D002', name: 'Cedar Ridge Landscaping', type: 'Commercial Lines', interest: 'Commercial', product: 'General Liability',
    priority: 'High', source: 'Lead Depot', phone: '(555) 700-2244', email: 'office@cedarridge.example',
    city: 'Boise', state: 'ID', premium: 5400, receivedDate: todayISO(),
    summary: 'New GL request. Needs certificate for a municipal contract — escalate certificate issuance.'
  },
  {
    id: 'D003', name: 'Daniel Foster', type: 'Personal Lines', interest: 'Home', product: 'Homeowners',
    priority: 'Medium', source: 'Lead Depot', phone: '(555) 700-3380', email: 'd.foster@example.com',
    city: 'Nashville', state: 'TN', premium: 2100, receivedDate: addDaysISO(-1),
    summary: 'Closing on a home in 21 days. Lender needs evidence of insurance.'
  },
  {
    id: 'D004', name: 'Sofia Marchetti', type: 'Personal Lines', interest: 'Renters', product: 'Renters',
    priority: 'Low', source: 'Lead Depot', phone: '(555) 700-4419', email: 'sofia.m@example.com',
    city: 'Columbus', state: 'OH', premium: 240, receivedDate: addDaysISO(-1),
    summary: 'Apartment complex requires renters policy before move-in.'
  },
  {
    id: 'D005', name: 'Hightower Consulting LLC', type: 'Commercial Lines', interest: 'Commercial', product: 'Professional Liability',
    priority: 'Medium', source: 'Lead Depot', phone: '(555) 700-5526', email: 'admin@hightower.example',
    city: 'Atlanta', state: 'GA', premium: 3900, receivedDate: addDaysISO(-2),
    summary: 'Client contract requires E&O proof. Gather operations details only; quoting needs approval.'
  },
  {
    id: 'D006', name: 'Marcus Delgado', type: 'Personal Lines', interest: 'Umbrella', product: 'Personal Umbrella',
    priority: 'Low', source: 'Lead Depot', phone: '(555) 700-6647', email: 'marcus.d@example.com',
    city: 'Reno', state: 'NV', premium: 380, receivedDate: addDaysISO(-3),
    summary: 'Existing auto customer of another agency asking about umbrella limits.'
  }
];
