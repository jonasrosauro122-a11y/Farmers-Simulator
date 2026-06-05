import Panel from '../components/Panel.jsx';

export default function SettingsPage({ user, setUser, onResetData }) {
  return (
    <main className="workspace page-bg">
      <div className="page-header"><div><p className="eyebrow">Settings</p><h1>Simulator Settings</h1><span>Update display user and reset the local practice data.</span></div></div>
      <div className="detail-grid">
        <Panel title="User Profile" icon="👤">
          <div className="form-stack">
            <label className="field-label">Display Name</label><input className="input" value={user.name} onChange={(event) => setUser({ ...user, name: event.target.value })} />
            <label className="field-label">Role</label><input className="input" value={user.role} onChange={(event) => setUser({ ...user, role: event.target.value })} />
          </div>
        </Panel>
        <Panel title="Demo Data" icon="🔄">
          <p>Reset all local simulator records back to the default training dataset.</p>
          <button className="danger-button" onClick={onResetData}>Reset Demo Data</button>
        </Panel>
      </div>
    </main>
  );
}
