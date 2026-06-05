// Lead records for the Leads module and the Lead Depot queue.
// All people, businesses, and contact details are fictional training data.

import { addDaysISO, todayISO } from '../utils/dates.js';

export const LEAD_STATUSES = ['New', 'Contacted', 'Quoted', 'Follow-Up', 'Converted', 'Lost'];
export const LEAD_INTERESTS = ['Auto', 'Home', 'Renters', 'Life', 'Commercial', 'Umbrella'];
export const LEAD_SOURCES = ['Website', 'Referral', 'Lead Depot', 'Direct Mail', 'Agency Lead Import', 'Walk-In', 'Phone Inquiry', 'Manual Entry'];
export const LINES = ['Personal Lines', 'Commercial Lines'];

export const initialLeads = [
  {
    id: 'L001', name: 'Maya Bennett', type: 'Personal Lines', interest: 'Home', product: 'Home + Auto Bundle',
    status: 'New', priority: 'High', source: 'Website', phone: '(555) 219-1840', email: 'maya.bennett@example.com',
    city: 'Austin', state: 'TX', premium: 2450, owner: 'Jonas', createdDate: todayISO(),
    lastActivity: 'Quote request received from agency website',
    notes: [{ date: todayISO(), author: 'System', text: 'Web lead created. Needs bundle quote and document checklist.' }]
  },
  {
    id: 'L002', name: 'Harbor Craft Studio', type: 'Commercial Lines', interest: 'Commercial', product: 'Business Owner Policy',
    status: 'Contacted', priority: 'Medium', source: 'Referral', phone: '(555) 832-7651', email: 'ops@harborcraft.example',
    city: 'Seattle', state: 'WA', premium: 6800, owner: 'Commercial Team', createdDate: addDaysISO(-4),
    lastActivity: 'Producer requested a follow-up task',
    notes: [{ date: addDaysISO(-4), author: 'Priya Shah', text: 'VA may gather business info only; coverage review must be escalated to licensed staff.' }]
  },
  {
    id: 'L003', name: 'Noah Rivera', type: 'Personal Lines', interest: 'Auto', product: 'Personal Auto',
    status: 'Quoted', priority: 'High', source: 'Lead Depot', phone: '(555) 641-0899', email: 'noah.rivera@example.com',
    city: 'Phoenix', state: 'AZ', premium: 1320, owner: 'Jonas', createdDate: addDaysISO(-6),
    lastActivity: 'Waiting for driver details',
    notes: [{ date: addDaysISO(-2), author: 'Jonas', text: 'Send reminder and collect missing vehicle information.' }]
  },
  {
    id: 'L004', name: 'Bright Lane Rentals', type: 'Commercial Lines', interest: 'Commercial', product: 'Commercial Property',
    status: 'Follow-Up', priority: 'Low', source: 'Direct Mail', phone: '(555) 440-3205', email: 'admin@brightlane.example',
    city: 'Denver', state: 'CO', premium: 9100, owner: 'Agency Team', createdDate: addDaysISO(-12),
    lastActivity: 'Needs current renewal date before quoting',
    notes: [{ date: addDaysISO(-9), author: 'Marcus Lee', text: 'Do not discuss whether a loss is covered. Route coverage questions to a licensed team member.' }]
  },
  {
    id: 'L005', name: 'Amara Okafor', type: 'Personal Lines', interest: 'Renters', product: 'Renters',
    status: 'Follow-Up', priority: 'Medium', source: 'Phone Inquiry', phone: '(555) 318-7702', email: 'amara.okafor@example.com',
    city: 'Chicago', state: 'IL', premium: 280, owner: 'Jonas', createdDate: addDaysISO(-3),
    lastActivity: 'Left voicemail, awaiting callback',
    notes: [{ date: addDaysISO(-3), author: 'Jonas', text: 'Renter moving on the 1st. Wants quote before lease signing.' }]
  },
  {
    id: 'L006', name: 'Trevor Maldonado', type: 'Personal Lines', interest: 'Life', product: 'Term Life Referral',
    status: 'Contacted', priority: 'Medium', source: 'Referral', phone: '(555) 904-1167', email: 't.maldonado@example.com',
    city: 'Tampa', state: 'FL', premium: 940, owner: 'Priya Shah', createdDate: addDaysISO(-8),
    lastActivity: 'Life referral routed to licensed producer',
    notes: [{ date: addDaysISO(-8), author: 'System', text: 'Life products require a licensed producer. VA may schedule only.' }]
  },
  {
    id: 'L007', name: 'Grace Whitfield', type: 'Personal Lines', interest: 'Umbrella', product: 'Personal Umbrella',
    status: 'Lost', priority: 'Low', source: 'Website', phone: '(555) 226-9034', email: 'grace.w@example.com',
    city: 'Portland', state: 'OR', premium: 410, owner: 'Agency Team', createdDate: addDaysISO(-20),
    lastActivity: 'Chose to stay with current carrier',
    notes: [{ date: addDaysISO(-15), author: 'Marcus Lee', text: 'Closed lost. Add to win-back direct mail audience in 6 months.' }]
  }
];

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
