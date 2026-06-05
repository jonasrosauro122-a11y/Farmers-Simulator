// Task records for the Tasks module.

import { addDaysISO, todayISO } from '../utils/dates.js';

export const TASK_PRIORITIES = ['High', 'Medium', 'Low'];

export const initialTasks = [
  { id: 'T001', title: 'Call Maya Bennett for missing vehicle VIN', relatedTo: 'Maya Bennett', relatedType: 'Lead', owner: 'Jonas', dueDate: todayISO(), priority: 'High', status: 'Open', notes: 'Quote cannot proceed without VIN and current mileage.' },
  { id: 'T002', title: 'Send document checklist to Summit Bakery LLC', relatedTo: 'Summit Bakery LLC', relatedType: 'Account', owner: 'Commercial Team', dueDate: todayISO(), priority: 'Medium', status: 'Open', notes: 'WC renewal needs payroll worksheet returned.' },
  { id: 'T003', title: 'Escalate Parker coverage question to licensed team', relatedTo: 'Parker Family', relatedType: 'Account', owner: 'Jonas', dueDate: addDaysISO(1), priority: 'High', status: 'Open', notes: 'Customer asked if the open claim is covered — VA must not answer; route to Priya.' },
  { id: 'T004', title: 'Payment reminder call — Parker Family past-due balance', relatedTo: 'Parker Family', relatedType: 'Account', owner: 'Jonas', dueDate: addDaysISO(-1), priority: 'High', status: 'Open', notes: 'Balance $165 past due. Read the approved reminder script only.' },
  { id: 'T005', title: 'Follow up on Noah Rivera auto quote', relatedTo: 'Noah Rivera', relatedType: 'Lead', owner: 'Jonas', dueDate: addDaysISO(-2), priority: 'Medium', status: 'Open', notes: 'Quote sent 5 days ago, no response yet.' },
  { id: 'T006', title: 'Request certificate for Cedar Ridge municipal contract', relatedTo: 'Cedar Ridge Landscaping', relatedType: 'Lead', owner: 'Commercial Team', dueDate: addDaysISO(2), priority: 'Medium', status: 'Open', notes: 'Certificate issuance is licensed work — prepare the request only.' },
  { id: 'T007', title: 'Review quoted leads not closed (weekly report)', relatedTo: 'Lead Queue', relatedType: 'Report', owner: 'Training Team', dueDate: addDaysISO(-3), priority: 'Low', status: 'Completed', notes: '' },
  { id: 'T008', title: 'Mail birthday card to Evelyn Kim', relatedTo: 'Kim Household', relatedType: 'Account', owner: 'Agency Team', dueDate: addDaysISO(3), priority: 'Low', status: 'Open', notes: 'Use the standard agency birthday template.' }
];
