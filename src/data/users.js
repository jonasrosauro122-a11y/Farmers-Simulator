// Simulator users. The first record is the default signed-in trainee profile.

export const defaultUser = { name: 'Jonas', role: 'Training Manager' };

export const agencyStaff = [
  { id: 'U001', name: 'Jonas', role: 'Training Manager', licensed: false },
  { id: 'U002', name: 'Priya Shah', role: 'Licensed Producer', licensed: true },
  { id: 'U003', name: 'Marcus Lee', role: 'CSR / Account Manager', licensed: true },
  { id: 'U004', name: 'Training Team', role: 'Shared Queue', licensed: false },
  { id: 'U005', name: 'Commercial Team', role: 'Commercial Desk', licensed: true },
  { id: 'U006', name: 'Agency Team', role: 'Shared Queue', licensed: false }
];

export const taskOwners = agencyStaff.map((person) => person.name);
