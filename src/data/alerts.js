// Service alerts and notifications across all hub categories.

import { addDaysISO, todayISO } from '../utils/dates.js';

export const ALERT_CATEGORIES = ['Critical', 'Renewal', 'Claims', 'Pending', 'Policy', 'Manual Brokered', 'Undelivered Email'];

export const initialAlerts = [
  { id: 'AL001', category: 'Critical', severity: 'Critical', date: todayISO(), read: false,
    title: 'Compliance reminder: protect customer information',
    body: 'Never enter real customer data into this simulator. Non-licensed staff must not give coverage advice, bind coverage, quote without approval, or interpret policy language.',
    relatedTo: 'Agency', suggestedAction: 'Acknowledge and review the Training Center compliance checklist.' },
  { id: 'AL002', category: 'Critical', severity: 'Critical', date: todayISO(), read: false,
    title: 'Past-due payment may trigger cancellation notice',
    body: 'Parker Family auto policy PA-681004 has a payment 2 days past due. A cancellation notice will generate if unpaid.',
    relatedTo: 'Parker Family', suggestedAction: 'Create a payment reminder task. Do not promise reinstatement terms.' },
  { id: 'AL003', category: 'Renewal', severity: 'High', date: todayISO(), read: false,
    title: 'Workers Comp renewal — payroll worksheet outstanding',
    body: 'Summit Bakery LLC policy WC-440182 expires soon and the payroll worksheet has not been returned.',
    relatedTo: 'Summit Bakery LLC', suggestedAction: 'Follow up for the worksheet and route to the Commercial Team.' },
  { id: 'AL004', category: 'Renewal', severity: 'Medium', date: addDaysISO(-1), read: false,
    title: 'Renewal review queue needs attention',
    body: 'Several accounts have upcoming expiration dates. Review tasks and route licensed items properly.',
    relatedTo: 'Renewal Queue', suggestedAction: 'Open the Renewal Report and confirm each item has an owner.' },
  { id: 'AL005', category: 'Claims', severity: 'High', date: addDaysISO(-2), read: true,
    title: 'Open claim follow-up needed',
    body: 'Parker Family has an open liability claim (C118). A VA may document and route updates, but must not interpret coverage.',
    relatedTo: 'Parker Family', suggestedAction: 'Log the customer contact and notify the assigned licensed staff.' },
  { id: 'AL006', category: 'Pending', severity: 'Medium', date: addDaysISO(-1), read: false,
    title: 'Policy pending issue — inspection scheduled',
    body: 'Ramos Household homeowners HO-339875 is pending underwriting inspection before issue.',
    relatedTo: 'Ramos Household', suggestedAction: 'Confirm the inspection date with the customer and document it.' },
  { id: 'AL007', category: 'Pending', severity: 'Low', date: addDaysISO(-2), read: false,
    title: 'Lead import completed',
    body: 'Imported leads are available for review in the Lead Depot.',
    relatedTo: 'Lead Depot', suggestedAction: 'Open Lead Depot and assign owners to high-priority records.' },
  { id: 'AL008', category: 'Policy', severity: 'Medium', date: addDaysISO(-1), read: false,
    title: 'Endorsement processed — add vehicle',
    body: 'Parker Family endorsement to add a vehicle was processed. Updated ID cards are available.',
    relatedTo: 'Parker Family', suggestedAction: 'Send the updated ID cards and note the account.' },
  { id: 'AL009', category: 'Manual Brokered', severity: 'Medium', date: addDaysISO(-3), read: false,
    title: 'Brokered policy requires manual record update',
    body: 'A brokered umbrella policy was issued outside the core system and must be recorded manually.',
    relatedTo: 'Brokered Desk', suggestedAction: 'Create a task for the licensed desk to enter the brokered policy.' },
  { id: 'AL010', category: 'Undelivered Email', severity: 'Low', date: addDaysISO(-1), read: false,
    title: 'Renewal email bounced',
    body: 'The renewal notice sent to dana@summitbakery.example bounced (mailbox full).',
    relatedTo: 'Summit Bakery LLC', suggestedAction: 'Verify the email address by phone and resend the notice.' }
];
