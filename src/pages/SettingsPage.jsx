import Panel from '../components/Panel.jsx';

function formatLoginTime(value) {
  if (!value) return 'Not recorded';
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function SettingsPage({ user, setUser, trainee, setTrainee, onResetData, onLogout }) {
  const updateTrainee = (field, value) => {
    const next = { ...(trainee || {}), [field]: value };
    next.displayName = `${next.firstName || ''} ${next.lastName || ''}`.trim();
    next.initials = `${next.firstName?.[0] || ''}${next.lastName?.[0] || ''}`.toUpperCase() || 'TR';
    setTrainee(next);
    setUser({
      ...user,
      name: next.firstName || user.name,
      fullName: next.displayName || user.fullName,
      firstName: next.firstName || '',
      lastName: next.lastName || '',
      batch: next.batch || '',
      role: user.role || 'Insurance CRM Trainee'
    });
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Simulator Settings</h1>
          <span>Update trainee profile, batch information, and reset local practice data.</span>
        </div>
      </div>
      <div className="detail-grid">
        <Panel title="Trainee Login Profile" icon="👤">
          <div className="form-stack">
            <label className="field-label">First Name</label>
            <input className="input" value={trainee?.firstName || ''} onChange={(event) => updateTrainee('firstName', event.target.value)} />

            <label className="field-label">Last Name</label>
            <input className="input" value={trainee?.lastName || ''} onChange={(event) => updateTrainee('lastName', event.target.value)} />

            <label className="field-label">Batch of Trainees</label>
            <input className="input" value={trainee?.batch || ''} onChange={(event) => updateTrainee('batch', event.target.value)} />

            <label className="field-label">Role</label>
            <input className="input" value={user.role} onChange={(event) => setUser({ ...user, role: event.target.value })} />
          </div>
        </Panel>

        <Panel title="Current Login Session" icon="🪪">
          <div className="detail-list single-column">
            <div><span>Trainee Name</span><strong>{trainee?.displayName || user.fullName || user.name}</strong></div>
            <div><span>Batch</span><strong>{trainee?.batch || 'Not assigned'}</strong></div>
            <div><span>Login Time</span><strong>{formatLoginTime(trainee?.loginAt)}</strong></div>
            <div><span>Simulator Mode</span><strong>LocalStorage Training Session</strong></div>
          </div>
          <div className="button-row top-space">
            <button className="outline-button" onClick={onLogout}>Log Out / Change Trainee</button>
          </div>
        </Panel>

        <Panel title="Demo Data" icon="🔄">
          <p>Reset all local simulator records back to the default training dataset. This keeps the login page available but clears practice leads, accounts, tasks, alerts, campaigns, and dashboard notes.</p>
          <button className="danger-button" onClick={onResetData}>Reset Demo Data</button>
        </Panel>
      </div>
    </main>
  );
}
