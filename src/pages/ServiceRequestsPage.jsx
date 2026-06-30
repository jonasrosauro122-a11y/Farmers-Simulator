import { useMemo, useState } from 'react';
import Modal from '../components/Modal.jsx';

const columns = [
  { key: 'id', label: 'SR#', width: '120px' },
  { key: 'customer', label: 'Customer', width: '150px' },
  { key: 'household', label: 'Household', width: '150px' },
  { key: 'subStatus', label: 'Sub Status', width: '170px' },
  { key: 'owner', label: 'Owner', width: '150px' },
  { key: 'dateOpened', label: 'Date Opened', width: '140px' },
  { key: 'policyNumber', label: 'Policy Number', width: '150px' },
  { key: 'lob', label: 'LOB', width: '145px' },
  { key: 'inquiry', label: 'Inquiry/Type', width: '170px' }
];

const STATUS_TABS = ['Open', 'In Process', 'Closed'];
const LOB_OPTIONS = ['Personal Lines', 'Business Insurance', 'Auto', 'Home', 'Umbrella', 'RV'];
const INQUIRY_OPTIONS = ['Policy Change', 'Billing Question', 'Certificate Request', 'Document Request', 'Driver Update', 'Cancellation', 'Coverage Review', 'Miscellaneous Request'];

function parseDate(value) {
  if (!value || value === '—') return 0;
  const [month, day, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
}

function shorten(value, max = 20) {
  if (!value) return '—';
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

export default function ServiceRequestsPage({ serviceRequests = [], assignees = [], onCreateRequest, onUpdateRequest, onAddNote, onCreateTask, onNavigate, onToast }) {
  const [status, setStatus] = useState('Open');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState({ key: 'dateOpened', direction: 'desc' });
  const [selectedId, setSelectedId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [draft, setDraft] = useState({ customer: '', household: '', policyNumber: '', lob: 'Personal Lines', inquiry: 'Policy Change', priority: 'Normal', owner: 'Unassigned', summary: '' });

  const counts = useMemo(() => ({
    Open: serviceRequests.filter((r) => r.status === 'Open').length,
    'In Process': serviceRequests.filter((r) => r.status === 'In Process').length,
    Closed: serviceRequests.filter((r) => r.status === 'Closed').length
  }), [serviceRequests]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return serviceRequests
      .filter((row) => row.status === status)
      .filter((row) => !term || `${row.id} ${row.customer} ${row.household} ${row.policyNumber} ${row.inquiry} ${row.owner}`.toLowerCase().includes(term))
      .slice()
      .sort((a, b) => {
        let result;
        if (sort.key === 'dateOpened') result = parseDate(a.dateOpened) - parseDate(b.dateOpened);
        else result = String(a[sort.key] || '').localeCompare(String(b[sort.key] || ''), undefined, { numeric: true });
        return sort.direction === 'asc' ? result : -result;
      });
  }, [serviceRequests, status, search, sort]);

  const selected = serviceRequests.find((r) => r.id === selectedId) || null;

  const handleSort = (key) => setSort((c) => ({ key, direction: c.key === key && c.direction === 'asc' ? 'desc' : 'asc' }));

  const submitCreate = () => {
    if (!draft.customer.trim()) { onToast?.('Enter a customer or business name.'); return; }
    const created = onCreateRequest?.({
      customer: draft.customer.trim(),
      household: draft.household.trim() || `${draft.customer.trim()} Account`,
      policyNumber: draft.policyNumber.trim() || '—',
      lob: draft.lob,
      inquiry: draft.inquiry,
      priority: draft.priority,
      owner: draft.owner,
      summary: draft.summary.trim() || 'Created in the training simulator. Gather details and route licensed work appropriately.'
    });
    setShowCreate(false);
    setDraft({ customer: '', household: '', policyNumber: '', lob: 'Personal Lines', inquiry: 'Policy Change', priority: 'Normal', owner: 'Unassigned', summary: '' });
    if (created) { setStatus('Open'); setSelectedId(created.id); }
  };

  const saveNote = () => {
    if (!noteText.trim() || !selected) return;
    onAddNote?.(selected.id, noteText.trim());
    setNoteText('');
    onToast?.('Note added to service request.');
  };

  const makeTask = () => {
    if (!selected) return;
    onCreateTask?.({
      title: `Follow up on ${selected.inquiry} — ${selected.customer}`,
      relatedTo: selected.household || selected.customer,
      relatedType: 'Service Request',
      priority: selected.priority === 'High' ? 'High' : 'Medium',
      notes: `Created from service request ${selected.id}.`
    });
    onToast?.('Follow-up task created from service request.');
  };

  return (
    <main className="farmers-service-requests-shell">
      <section className="service-requests-card" aria-label="Service Requests simulator list view">
        <header className="service-requests-header">
          <div className="service-requests-title">
            <span className="service-requests-icon">↘</span>
            <strong>Service Requests</strong>
          </div>
          <div className="header-actions">
            <input className="input" placeholder="Search requests…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 200 }} />
            <button className="primary-button" onClick={() => setShowCreate(true)}>+ New Request</button>
          </div>
        </header>

        <div className="service-request-tabs" role="tablist" aria-label="Service request status filters">
          {STATUS_TABS.map((tab) => (
            <button key={tab} className={status === tab ? 'active' : ''} onClick={() => setStatus(tab)}>
              {tab} ({counts[tab] || 0})
            </button>
          ))}
        </div>

        <div className="service-table-wrap">
          <table className="service-requests-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} style={{ width: column.width }}>
                    <button onClick={() => handleSort(column.key)}>
                      <span>{column.label}</span>
                      <span className="service-column-caret">⌄</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((request) => (
                <tr key={request.id} className={selectedId === request.id ? 'selected' : ''} onClick={() => setSelectedId(request.id)}>
                  <td><button className="service-link" onClick={() => setSelectedId(request.id)}>{request.id.replace('SR-', '')}</button></td>
                  <td title={request.customer}>{shorten(request.customer, 21)}</td>
                  <td title={request.household}>{shorten(request.household, 21)}</td>
                  <td title={request.subStatus}>{shorten(request.subStatus, 21)}</td>
                  <td title={request.owner}>{shorten(request.owner, 19)}</td>
                  <td>{request.dateOpened}</td>
                  <td>{request.policyNumber}</td>
                  <td title={request.lob}>{shorten(request.lob, 19)}</td>
                  <td title={request.inquiry}>{shorten(request.inquiry, 19)}</td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr><td colSpan={columns.length}><div className="service-empty-state">No {status.toLowerCase()} service requests found.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selected && (
        <aside className="service-request-preview" aria-live="polite">
          <div>
            <p>Training Simulator Detail</p>
            <h2>{selected.id} · {selected.inquiry}</h2>
            <span>{selected.summary}</span>
          </div>

          <dl>
            <div><dt>Customer</dt><dd>{selected.customer}</dd></div>
            <div><dt>Household</dt><dd>{selected.household}</dd></div>
            <div><dt>Policy</dt><dd>{selected.policyNumber}</dd></div>
            <div><dt>LOB</dt><dd>{selected.lob}</dd></div>
            <div><dt>Priority</dt><dd>{selected.priority}</dd></div>
          </dl>

          <label className="field"><span>Status</span>
            <select className="input" value={selected.status} onChange={(e) => onUpdateRequest?.(selected.id, { status: e.target.value, subStatus: e.target.value === 'Closed' ? 'Completed' : selected.subStatus })}>
              {STATUS_TABS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label className="field"><span>Assigned Owner</span>
            <select className="input" value={selected.owner} onChange={(e) => onUpdateRequest?.(selected.id, { owner: e.target.value })}>
              {[...new Set([selected.owner, ...assignees])].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>

          <div className="sr-notes">
            <strong>Notes</strong>
            <div className="sr-note-add">
              <textarea className="input" rows="2" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Document what you gathered. Do not give coverage advice." />
              <button className="outline-button" onClick={saveNote}>Add Note</button>
            </div>
            <ul className="sr-note-list">
              {(selected.notes || []).map((n, i) => <li key={i}><span>{n.date} · {n.author}</span>{n.text}</li>)}
              {(!selected.notes || selected.notes.length === 0) && <li className="empty-line">No notes yet.</li>}
            </ul>
          </div>

          <div className="button-row">
            <button className="primary-button" onClick={makeTask}>Create Task</button>
            <button className="outline-button" onClick={() => { onNavigate?.('customer-info'); onToast?.(`Linked to ${selected.customer} (open in Customer Info).`); }}>Link Customer</button>
            <button className="outline-button" onClick={() => onNavigate?.('policies')}>Open Policy</button>
            <button className="text-button" onClick={() => setSelectedId(null)}>Close</button>
          </div>
          <p className="compliance-note">Non-licensed VAs gather information and document requests only. Coverage decisions, binding, and approvals must be escalated to licensed staff.</p>
        </aside>
      )}

      {showCreate && (
        <Modal title="Create Service Request" onClose={() => setShowCreate(false)}>
          <div className="form-grid">
            <label className="field"><span>Customer / Business Name *</span><input className="input" value={draft.customer} onChange={(e) => setDraft({ ...draft, customer: e.target.value })} placeholder="e.g. Riverstone Bakery LLC" /></label>
            <label className="field"><span>Household / Account</span><input className="input" value={draft.household} onChange={(e) => setDraft({ ...draft, household: e.target.value })} placeholder="Auto-filled if blank" /></label>
            <label className="field"><span>Policy Number</span><input className="input" value={draft.policyNumber} onChange={(e) => setDraft({ ...draft, policyNumber: e.target.value })} placeholder="Dummy policy #" /></label>
            <label className="field"><span>Line of Business</span><select className="input" value={draft.lob} onChange={(e) => setDraft({ ...draft, lob: e.target.value })}>{LOB_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></label>
            <label className="field"><span>Inquiry Type</span><select className="input" value={draft.inquiry} onChange={(e) => setDraft({ ...draft, inquiry: e.target.value })}>{INQUIRY_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></label>
            <label className="field"><span>Priority</span><select className="input" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}><option>Low</option><option>Normal</option><option>High</option></select></label>
            <label className="field"><span>Assign Owner</span><select className="input" value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })}>{assignees.map((o) => <option key={o}>{o}</option>)}</select></label>
          </div>
          <label className="field"><span>Summary / Customer Request</span><textarea className="input" rows="3" value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} placeholder="Capture the request verbatim." /></label>
          <div className="button-row right">
            <button className="outline-button" onClick={() => setShowCreate(false)}>Cancel</button>
            <button className="primary-button" onClick={submitCreate}>Create Request</button>
          </div>
        </Modal>
      )}
    </main>
  );
}
