import { useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import Modal from '../components/Modal.jsx';
import { ACCOUNT_STATUSES, POLICY_LINES } from '../data/accounts.js';
import { addDaysISO, todayISO } from '../utils/dates.js';

const TABS = ['Overview', 'Household', 'Policies', 'Billing', 'Claims', 'Documents', 'Activity', 'Tasks'];

function AddPolicyModal({ account, onClose, onSave }) {
  const [draft, setDraft] = useState({ line: POLICY_LINES[0], premium: '', effective: todayISO() });
  const submit = () => {
    const policy = {
      number: `SIM-${Math.floor(10000 + Math.random() * 89999)}`,
      line: draft.line,
      status: 'Pending Issue',
      effective: draft.effective,
      expiration: `${Number(draft.effective.slice(0, 4)) + 1}${draft.effective.slice(4)}`,
      premium: Number(draft.premium) || 0
    };
    onSave(policy);
  };
  return (
    <Modal title={`Add Policy — ${account.household}`} onClose={onClose}>
      <p className="helper-text">Mock workflow: this creates a Pending Issue policy record. In real life, only licensed staff bind and issue coverage.</p>
      <div className="form-stack">
        <label className="field-label">Line of Business</label>
        <select className="input" value={draft.line} onChange={(event) => setDraft({ ...draft, line: event.target.value })}>
          {POLICY_LINES.map((line) => <option key={line}>{line}</option>)}
        </select>
        <div className="form-grid tight">
          <label><span>Annual Premium ($)</span><input className="input" type="number" min="0" value={draft.premium} onChange={(event) => setDraft({ ...draft, premium: event.target.value })} /></label>
          <label><span>Effective Date</span><input className="input" type="date" value={draft.effective} onChange={(event) => setDraft({ ...draft, effective: event.target.value })} /></label>
        </div>
        <div className="button-row right">
          <button className="outline-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" onClick={submit}>Add Pending Policy</button>
        </div>
      </div>
    </Modal>
  );
}

export default function AccountDetailPage({ account, user, tasks, onBack, onUpdateAccount, onUpdateTask, onCreateTask, onToast }) {
  const [tab, setTab] = useState('Overview');
  const [note, setNote] = useState('');
  const [addPolicyOpen, setAddPolicyOpen] = useState(false);

  if (!account) {
    return (
      <main className="workspace page-bg">
        <div className="empty-state">
          Account not found.
          <div><button className="outline-button" onClick={onBack}>Back to Accounts</button></div>
        </div>
      </main>
    );
  }

  const relatedTasks = tasks.filter((task) => task.relatedTo === account.household || task.relatedTo === account.primaryContact);
  const totalPremium = account.policies.reduce((sum, policy) => sum + policy.premium, 0);

  const addActivity = (text) => {
    onUpdateAccount(account.id, { activity: [{ date: todayISO(), author: user.name, text }, ...account.activity] });
  };

  const saveNote = () => {
    if (!note.trim()) return;
    addActivity(note.trim());
    setNote('');
  };

  const savePolicy = (policy) => {
    onUpdateAccount(account.id, {
      policies: [...account.policies, policy],
      activity: [{ date: todayISO(), author: user.name, text: `Added pending ${policy.line} policy ${policy.number}. Routed to licensed staff for issue.` }, ...account.activity]
    });
    setAddPolicyOpen(false);
    onToast(`Pending ${policy.line} policy added.`);
  };

  const requestDocument = (name) => {
    const doc = { id: `DOC-${Math.floor(100 + Math.random() * 899)}`, name, type: 'Generated', date: todayISO() };
    onUpdateAccount(account.id, {
      documents: [doc, ...account.documents],
      activity: [{ date: todayISO(), author: user.name, text: `Generated document: ${name} (simulated).` }, ...account.activity]
    });
    onToast(`${name} added to Documents (simulated).`);
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Account Detail · {account.id}</p>
          <h1>{account.household} <InfoTip text="The account record holds everything for this customer: household members, policies, billing, claims, documents, the activity timeline, and related tasks. Use the tabs to move between sections." /></h1>
          <span>{account.primaryContact} · {account.type} · Customer since {account.customerSince}</span>
        </div>
        <div className="header-actions">
          <button className="outline-button" onClick={onBack}>Back to Accounts</button>
          <button className="outline-button" onClick={() => setAddPolicyOpen(true)}>Add Policy</button>
          <button className="primary-button" onClick={() => onCreateTask({ title: `Follow up with ${account.household}`, relatedTo: account.household, relatedType: 'Account', dueDate: addDaysISO(1) })}>Create Task</button>
        </div>
      </div>

      <Panel className="account-tabs-panel">
        <div className="tabs-row account-tabs">
          {TABS.map((item) => (
            <button key={item} className={`tab ${tab === item ? 'active' : ''}`} onClick={() => setTab(item)}>
              {item}
              {item === 'Tasks' && relatedTasks.filter((task) => task.status !== 'Completed').length > 0 && ` (${relatedTasks.filter((task) => task.status !== 'Completed').length})`}
            </button>
          ))}
        </div>

        {tab === 'Overview' && (
          <div className="detail-grid in-panel">
            <div className="detail-list">
              <div>
                <span>Account Status</span>
                <select className="input" value={account.status} onChange={(event) => { onUpdateAccount(account.id, { status: event.target.value }); addActivity(`Account status changed to ${event.target.value}.`); }}>
                  {ACCOUNT_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
              <div><span>Primary Contact</span><strong>{account.primaryContact}</strong></div>
              <div><span>Email</span><strong>{account.email}</strong></div>
              <div><span>Phone</span><strong>{account.phone}</strong></div>
              <div><span>Address</span><strong>{account.address}</strong></div>
              <div><span>Account Manager</span><strong>{account.accountManager}</strong></div>
            </div>
            <div className="overview-stats">
              <div className="overview-stat"><b>{account.policies.length}</b><span>Policies</span></div>
              <div className="overview-stat"><b>${totalPremium.toLocaleString()}</b><span>Annual Premium</span></div>
              <div className="overview-stat"><b>{account.claims.filter((claim) => claim.status === 'Open').length}</b><span>Open Claims</span></div>
              <div className="overview-stat"><b>{relatedTasks.filter((task) => task.status !== 'Completed').length}</b><span>Open Tasks</span></div>
            </div>
          </div>
        )}

        {tab === 'Household' && (
          <div className="table-wrap in-panel">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Relation / Role</th><th>Date of Birth</th></tr></thead>
              <tbody>
                {account.members.map((member) => (
                  <tr key={member.name}><td>{member.name}</td><td>{member.relation}</td><td>{member.dob}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="helper-text">Household changes (adding drivers, removing members) are policy changes — document the request and route to licensed staff.</p>
          </div>
        )}

        {tab === 'Policies' && (
          <div className="table-wrap in-panel">
            <table className="data-table">
              <thead><tr><th>Policy #</th><th>Line</th><th>Status</th><th>Effective</th><th>Expiration</th><th>Premium</th></tr></thead>
              <tbody>
                {account.policies.length === 0 && <tr><td colSpan="6"><div className="empty-state compact">No policies on this account yet. Use Add Policy to practice the workflow.</div></td></tr>}
                {account.policies.map((policy) => (
                  <tr key={policy.number}>
                    <td><strong>{policy.number}</strong></td><td>{policy.line}</td>
                    <td><span className="status-chip">{policy.status}</span></td>
                    <td>{policy.effective}</td><td>{policy.expiration}</td><td>${policy.premium.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="button-row"><button className="outline-button" onClick={() => setAddPolicyOpen(true)}>+ Add Policy (mock workflow)</button></div>
          </div>
        )}

        {tab === 'Billing' && (
          <div className="detail-grid in-panel">
            <div className="detail-list">
              <div><span>Billing Status</span><strong>{account.billing.status}</strong></div>
              <div><span>Payment Method</span><strong>{account.billing.method}</strong></div>
              <div><span>Current Balance</span><strong className={account.billing.balance > 0 ? 'danger-text' : ''}>${account.billing.balance.toLocaleString()}</strong></div>
              <div><span>Next Due Date</span><strong>{account.billing.nextDueDate}</strong></div>
              <div><span>Next Amount Due</span><strong>${Number(account.billing.nextDueAmount).toLocaleString()}</strong></div>
            </div>
            <div className="guidance-grid one-col">
              <div>
                <h3>VA billing guardrails</h3>
                <p>You may read billing status to the customer and take a payment promise note. You may NOT waive fees, change due dates, or promise the policy won&rsquo;t cancel. If the balance is past due, use the payment reminder script and create a task.</p>
                <button className="outline-button" onClick={() => onCreateTask({ title: `Payment reminder — ${account.household}`, relatedTo: account.household, relatedType: 'Account', priority: 'High' })}>Create Payment Reminder Task</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'Claims' && (
          <div className="in-panel">
            {account.claims.length === 0 && <div className="empty-state compact">No claims on file.</div>}
            {account.claims.map((claim) => (
              <div className="alert-card" key={claim.id}>
                <div>
                  <span className={`severity ${claim.status === 'Open' ? 'high' : 'low'}`}>{claim.status}</span>
                  <h3>{claim.type} — {claim.id}</h3>
                  <p>{claim.description}</p>
                  <small>Reported {claim.date} · Policy {claim.policy}</small>
                </div>
                {claim.status === 'Open' && (
                  <button className="outline-button" onClick={() => onCreateTask({ title: `Claims follow-up: ${claim.id} (${account.household})`, relatedTo: account.household, relatedType: 'Account', priority: 'High' })}>Create Follow-up Task</button>
                )}
              </div>
            ))}
            <p className="helper-text">Share only the documented claim status. Never state whether a loss is covered — that is coverage interpretation.</p>
          </div>
        )}

        {tab === 'Documents' && (
          <div className="in-panel">
            <div className="tile-list">
              {account.documents.length === 0 && <div className="empty-state compact">No documents on file.</div>}
              {account.documents.map((doc) => (
                <div className="lead-tile" key={doc.id}>
                  <div><h3>📄 {doc.name}</h3><p>{doc.type} · Added {doc.date}</p></div>
                  <div className="row-actions"><button onClick={() => onToast(`Opened ${doc.name} (simulated viewer).`)}>View</button></div>
                </div>
              ))}
            </div>
            <div className="button-row">
              <button className="outline-button" onClick={() => requestDocument('Auto ID Cards (reissued)')}>Generate ID Cards</button>
              <button className="outline-button" onClick={() => requestDocument('Evidence of Insurance (draft for licensed review)')}>Request Evidence of Insurance</button>
              <button className="outline-button" onClick={() => requestDocument('Certificate Request Packet (for licensed desk)')}>Certificate Request</button>
            </div>
            <p className="helper-text">Certificates and evidence of insurance are prepared here as drafts only — issuing them is licensed work.</p>
          </div>
        )}

        {tab === 'Activity' && (
          <div className="in-panel">
            <textarea className="input" rows="3" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a service note. Route licensed questions to licensed staff." />
            <div className="button-row"><button className="primary-button" onClick={saveNote} disabled={!note.trim()}>Save Note</button></div>
            <div className="note-list timeline">
              {account.activity.map((item, index) => (
                <div className="note-item" key={index}>
                  <small>{item.date} · {item.author}</small>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Tasks' && (
          <div className="in-panel">
            {relatedTasks.length === 0 && <div className="empty-state compact">No tasks reference this account yet.</div>}
            {relatedTasks.map((task) => (
              <div className="task-card" key={task.id}>
                <input type="checkbox" checked={task.status === 'Completed'} onChange={(event) => onUpdateTask(task.id, { status: event.target.checked ? 'Completed' : 'Open' })} aria-label={`Complete ${task.title}`} />
                <div><h3>{task.title}</h3><p>Due {task.dueDate} · {task.owner}</p>{task.notes && <span>{task.notes}</span>}</div>
                <em className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</em>
              </div>
            ))}
            <div className="button-row">
              <button className="outline-button" onClick={() => onCreateTask({ relatedTo: account.household, relatedType: 'Account' })}>+ New Task for this Account</button>
            </div>
          </div>
        )}
      </Panel>

      {addPolicyOpen && <AddPolicyModal account={account} onClose={() => setAddPolicyOpen(false)} onSave={savePolicy} />}
    </main>
  );
}
