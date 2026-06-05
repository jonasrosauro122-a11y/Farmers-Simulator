// Direct mail campaigns, audience definitions, and letter templates.
// Sending is simulated only — nothing leaves the browser.

import { addDaysISO } from '../utils/dates.js';

export const CAMPAIGN_STATUSES = ['Draft', 'Scheduled', 'Sent'];

export const mailAudiences = [
  { id: 'AUD1', name: 'Lost auto policies (last 12 months)', size: 184 },
  { id: 'AUD2', name: 'Monoline customers (cross-sell)', size: 296 },
  { id: 'AUD3', name: 'Commercial renewals 90 days out', size: 72 },
  { id: 'AUD4', name: 'New homeowners in service area', size: 410 },
  { id: 'AUD5', name: 'Renters aging into auto shopping', size: 138 }
];

export const mailTemplates = [
  { id: 'TPL1', name: 'Win-Back Letter', preview: 'We noticed your policy with us ended last year. A lot can change in twelve months — including rates. If you would like a no-pressure review, our office is happy to take a fresh look.' },
  { id: 'TPL2', name: 'Bundle Savings Postcard', preview: 'Did you know combining your home and auto policies could simplify your billing and may qualify you for multi-policy savings? Call our office to ask about a bundle review.' },
  { id: 'TPL3', name: 'Renewal Check-In Letter', preview: 'Your policy renewal is coming up. Before it arrives, we would like to confirm your information is current so your renewal reflects your situation accurately.' },
  { id: 'TPL4', name: 'New Mover Welcome Card', preview: 'Welcome to the neighborhood! Our local office helps new homeowners review protection for their biggest investment. Stop by or call — we are right down the street.' }
];

export const initialCampaigns = [
  { id: 'DM001', name: 'Win Back Auto Customers', audienceId: 'AUD1', templateId: 'TPL1', status: 'Draft', recipients: 184, createdDate: addDaysISO(-6), scheduledDate: '' },
  { id: 'DM002', name: 'Home + Auto Bundle Offer', audienceId: 'AUD2', templateId: 'TPL2', status: 'Scheduled', recipients: 296, createdDate: addDaysISO(-4), scheduledDate: addDaysISO(5) },
  { id: 'DM003', name: 'Commercial Renewal Touchpoint', audienceId: 'AUD3', templateId: 'TPL3', status: 'Sent', recipients: 72, createdDate: addDaysISO(-20), scheduledDate: addDaysISO(-9) }
];
