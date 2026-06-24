// Alert records are fictional and are used only for simulator training.

import { todayISO } from '../utils/dates.js';

export const ALERT_CATEGORIES = ['Renewal Alerts', 'Policy Notifications', 'Claims Alerts', 'Critical & Pending Alerts', 'Manual Brokered Alerts'];

export const initialAlerts = [
  {
    id: 'AL209162039',
    alertName: 'Alert 209162039',
    category: 'Renewal Alerts',
    severity: 'High',
    date: todayISO(),
    read: false,
    account: 'JULIAN RIVERSTONE',
    title: 'Renewal alert requires follow-up',
    body: 'A dummy renewal alert is in process for a fictional training household. Review the account, document the action taken, and route licensed work properly.',
    relatedTo: 'Julian Riverstone Household',
    suggestedAction: 'Create a follow-up activity and assign it to the licensed service queue.'
  }
];
