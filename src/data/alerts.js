// Alert records are fictional and are used only for simulator training.

import { todayISO } from '../utils/dates.js';

export const ALERT_CATEGORIES = ['Renewal Alerts', 'Policy Notifications', 'Claims Alerts', 'Critical & Pending Alerts', 'Billing Alerts', 'Manual Brokered Alerts'];
export const ALERT_STATUSES = ['New', 'In Process', 'Completed'];

export const initialAlerts = [
  {
    id: 'AL209162039',
    alertName: 'Alert 209162039',
    category: 'Renewal Alerts',
    line: 'Personal Lines',
    severity: 'High',
    status: 'New',
    date: todayISO(),
    read: false,
    account: 'Julian Riverstone',
    assignedTo: 'Unassigned',
    linkedTo: 'Julian Riverstone Household',
    title: 'Renewal alert requires follow-up',
    body: 'A dummy renewal alert is in process for a fictional training household. Review the account, document the action taken, and route licensed work properly.',
    relatedTo: 'Julian Riverstone Household',
    suggestedAction: 'Create a follow-up activity and assign it to the licensed service queue.'
  },
  {
    id: 'AL209150114',
    alertName: 'Alert 209150114',
    category: 'Billing Alerts',
    line: 'Personal Lines',
    severity: 'Medium',
    status: 'In Process',
    date: todayISO(),
    read: false,
    account: 'Mia Carter',
    assignedTo: 'Billing Queue',
    linkedTo: 'Mia Carter Household',
    title: 'Payment due reminder',
    body: 'A fictional billing reminder shows a balance approaching its due date. A VA may explain portal navigation and document the inquiry, but cannot promise reinstatement or waive fees.',
    relatedTo: 'Mia Carter Household',
    suggestedAction: 'Document the billing question and create a payment reminder task.'
  },
  {
    id: 'AL209141887',
    alertName: 'Alert 209141887',
    category: 'Critical & Pending Alerts',
    line: 'Commercial Lines',
    severity: 'Critical',
    status: 'New',
    date: todayISO(),
    read: false,
    account: 'Riverstone Bakery LLC',
    assignedTo: 'Commercial Service',
    linkedTo: 'Riverstone Bakery LLC Account',
    title: 'Pending underwriting issue',
    body: 'A simulated underwriting condition is pending on a commercial account. Coverage interpretation must be escalated to licensed staff.',
    relatedTo: 'Riverstone Bakery LLC Account',
    suggestedAction: 'Escalate the underwriting condition to a licensed commercial agent.'
  },
  {
    id: 'AL209130442',
    alertName: 'Alert 209130442',
    category: 'Claims Alerts',
    line: 'Personal Lines',
    severity: 'High',
    status: 'Completed',
    date: todayISO(),
    read: true,
    account: 'Noah Bennett',
    assignedTo: 'Claims Liaison',
    linkedTo: 'Noah Bennett Household',
    title: 'Claim status follow-up logged',
    body: 'A fictional claims follow-up alert has been documented and routed. Claim outcomes and coverage answers must come from licensed claims staff.',
    relatedTo: 'Noah Bennett Household',
    suggestedAction: 'Confirm the claim follow-up was routed to the licensed claims contact.'
  }
];
