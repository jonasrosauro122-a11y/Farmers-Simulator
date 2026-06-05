import { useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import LeadFormModal from '../components/LeadFormModal.jsx';
import { LEAD_STATUSES } from '../data/leads.js';
import { addDaysISO, todayISO } from '../utils/dates.js';

export default function LeadDetailPage({ lead, user, onBack, onUpdateLead, onConvertLead, onCreateTask }) {
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(false);

  if (!lead) {
    return (
      <main className="workspace page-bg">
        <div className="empty-state">
          Lead not found. It may have been converted or removed.
          <div><button className="outline-button" onClick={onBack}>Back to Leads</button></div>
        </div>
      </main>
    );
  }

  const addNote = () => {
    if (!note.trim()) return;
    const entry = { date: todayISO(), author: user.name, text: note.trim() };
    onUpdateLead(lead.id, { notes: [entry, ...(lead.notes || [])], lastActivity: note.trim() });
    setNote('');
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Lead Detail · {lead.id}</p>
          <h1>{lead.name}</h1>
          <span>{lead.type} · {lead.interest} · {lead.product} · Created {lead.createdDate}</span>
        </div>
        <div className="header-actions">
          <button className="outline-button" onClick={onBack}>Back to Leads</button>
          <button className="outline-button" onClick={() => setEditing(true)}>Edit Lead</button>
          <button className="outline-button" onClick={() => onCreateTask({ title: `Follow up with ${lead.name}`, relatedTo: lead.name, relatedType: 'Lead', dueDate: addDaysISO(1) })}>Assign Task</button>
          <button className="primary-button" onClick={() => onConvertLead(lead.id)} disabled={lead.status === 'Converted'}>
            {lead.status === 'Converted' ? 'Converted ✓' : 'Convert to Account'}
          </button>
        </div>
      </div>
      <div className="detail-grid">
        <Panel title="Lead Information" icon="👤" action={<InfoTip text="Update the status as you work the lead. Converting creates a Pending account with a starter policy record — licensed staff complete the bind/issue steps." />}>
          <div className="detail-list">
            <div>
              <span>Status</span>
              <select className="input" value={lead.status} onChange={(event) => onUpdateLead(lead.id, { status: event.target.value })}>
                {LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div><span>Priority</span><strong><em className={`priority ${lead.priority.toLowerCase()}`}>{lead.priority}</em></strong></div>
            <div><span>Insurance Interest</span><strong>{lead.interest}</strong></div>
            <div><span>Email</span><strong>{lead.email || '—'}</strong></div>
            <div><span>Phone</span><strong>{lead.phone || '—'}</strong></div>
            <div><span>Location</span><strong>{[lead.city, lead.state].filter(Boolean).join(', ') || '—'}</strong></div>
            <div><span>Estimated Premium</span><strong>${Number(lead.premium).toLocaleString()}</strong></div>
            <div><span>Lead Source</span><strong>{lead.source}</strong></div>
            <div><span>Owner</span><strong>{lead.owner}</strong></div>
            <div><span>Last Activity</span><strong>{lead.lastActivity}</strong></div>
          </div>
        </Panel>
        <Panel title="Activity Notes" icon="📝" action={<InfoTip text="Document every contact attempt. Notes here are the audit trail a producer relies on. Never record coverage advice." />}>
          <textarea className="input" rows="3" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add a note. Do not give coverage advice in notes." />
          <div className="button-row">
            <button className="primary-button" onClick={addNote} disabled={!note.trim()}>Save Note</button>
          </div>
          <div className="note-list">
            {(lead.notes || []).map((item, index) => (
              <div className="note-item" key={index}>
                <small>{item.date} · {item.author}</small>
                <p>{item.text}</p>
              </div>
            ))}
            {(lead.notes || []).length === 0 && <div className="empty-state compact">No notes yet.</div>}
          </div>
        </Panel>
      </div>

      {editing && (
        <LeadFormModal
          lead={lead}
          title={`Edit Lead — ${lead.name}`}
          submitLabel="Save Changes"
          onClose={() => setEditing(false)}
          onSave={(updates) => { onUpdateLead(lead.id, updates); setEditing(false); }}
        />
      )}
    </main>
  );
}
