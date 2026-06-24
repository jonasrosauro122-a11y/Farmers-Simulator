// Customer account records: household, policies, billing, claims, documents, and activity.
// All data is fictional and exists only for navigation training.

import { addDaysISO, todayISO } from '../utils/dates.js';

export const ACCOUNT_STATUSES = ['Active', 'Prospect', 'Pending', 'Cancelled'];
export const POLICY_LINES = ['Personal Auto', 'Homeowners', 'Renters', 'Term Life', 'Personal Umbrella', 'Business Owner Policy', 'General Liability', 'Workers Compensation', 'Commercial Property', 'Commercial Auto'];

export const initialAccounts = [];

