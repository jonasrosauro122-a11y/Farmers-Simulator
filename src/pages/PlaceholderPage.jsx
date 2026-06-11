import Panel from '../components/Panel.jsx';

const pageCopy = {
  opportunities: {
    eyebrow: 'Opportunities',
    title: 'Opportunities Workspace',
    description: 'Training-safe placeholder for opportunity pipeline work. Use Leads and Reports Hub for the functional simulator workflow in this phase.',
    actions: [{ label: 'Open Leads', target: 'leads' }, { label: 'Open Reports Hub', target: 'reports-hub' }]
  },
  'insurance-policies': {
    eyebrow: 'Insurance Policies',
    title: 'Insurance Policies Workspace',
    description: 'Training-safe placeholder for policy search and policy list navigation. Policy records are attached to dummy Accounts.',
    actions: [{ label: 'Open Accounts', target: 'accounts' }, { label: 'Policy Summary Report', target: 'report:policy-summary' }]
  },
  claims: {
    eyebrow: 'Claims',
    title: 'Claims Workspace',
    description: 'Claims items are routed through the Alerts and Account detail areas. Non-licensed VAs should document and escalate coverage questions.',
    actions: [{ label: 'Open Claims Alerts', target: 'alerts:Claims' }, { label: 'Open Training', target: 'training' }]
  },
  calendar: {
    eyebrow: 'Calendar',
    title: 'Calendar Workspace',
    description: 'Calendar-style work is represented by Tasks in this phase. Use Due Today and Overdue filters for daily workflow practice.',
    actions: [{ label: 'Due Today', target: 'tasks:today' }, { label: 'All Tasks', target: 'tasks' }]
  },
  'workable-lists': {
    eyebrow: 'Workable Lists',
    title: 'Workable Lists Workspace',
    description: 'Training-safe placeholder for saved lists and work queues. Reports Hub contains functional list and report navigation.',
    actions: [{ label: 'Open Reports Hub', target: 'reports-hub' }, { label: 'Open Tasks Report', target: 'report:open-tasks' }]
  },
  'account-tags': {
    eyebrow: 'Account Tags',
    title: 'Account Tags Workspace',
    description: 'Training-safe placeholder for account segmentation. Use Accounts to view dummy households, businesses, policies, billing, and activity.',
    actions: [{ label: 'Open Accounts', target: 'accounts' }]
  },
  'preference-center': {
    eyebrow: 'Preference Center',
    title: 'Preference Center',
    description: 'Simulator preferences and trainee profile settings are managed in Settings.',
    actions: [{ label: 'Open Settings', target: 'settings' }]
  }
};

export default function PlaceholderPage({ pageId, onNavigate }) {
  const copy = pageCopy[pageId] || {
    eyebrow: 'Simulator Workspace',
    title: 'Training Workspace',
    description: 'This dashboard tab is clickable and reserved for a future simulator workflow.',
    actions: [{ label: 'Back to Home', target: 'home' }]
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <span>{copy.description}</span>
        </div>
      </div>
      <Panel>
        <div className="placeholder-workspace-card">
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>
          <div className="button-row">
            {copy.actions.map((action) => (
              <button key={action.target} className="primary-button" onClick={() => onNavigate(action.target)}>{action.label}</button>
            ))}
          </div>
        </div>
      </Panel>
    </main>
  );
}
