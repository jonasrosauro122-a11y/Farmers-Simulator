import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import LeadFormModal from '../components/LeadFormModal.jsx';
import { LEAD_INTERESTS, LEAD_SOURCES, LEAD_STATUSES } from '../data/leads.js';
import { exportToCsv } from '../utils/csv.js';

const statusFilters = ['All', ...LEAD_STATUSES];

export default function LeadsPage({ leads, onSelectLead, onUpdateLead, onConvertLead, onNewLead }) {
  const [status, setStatus] = useState('All');
  const [interest, setInterest] = useState('All');
  const [source, setSource] = useState('All');
  const [search, setSearch] = useState('');
  const [editingLead, setEditingLead] = useState(null);

  const visibleLeads = useMemo(() => {
    const value = search.trim().toLowerCase();
    return leads.filter((lead) => {
      if (status !== 'All' && lead.status !== status) return false;
      if (interest !== 'All' && lead.interest !== interest) return false;
      if (source !== 'All' && lead.source !== source) return false;
      return !value || `${lead.name} ${lead.email} ${lead.phone} ${lead.product} ${lead.type} ${lead.city} ${lead.state} ${lead.owner}`.toLowerCase().includes(value);
    });
  }, [leads, status, interest, source, search]);

  const exportCsv = () => exportToCsv('leads-export', ['ID', 'Name', 'Line', 'Interest', 'Product', 'Status', 'Priority', 'Source', 'Owner', 'State', 'Premium'],
    visibleLeads.map((lead) => [lead.id, lead.name, lead.type, lead.interest, lead.product, lead.status, lead.priority, lead.source, lead.owner, lead.state, lead.premium]));

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Lead Management</p>
          <h1>Leads <InfoTip text="Track prospects from first contact to converted account. Statuses: New → Contacted → Quoted → Follow-Up → Converted (or Lost). Use Convert when the prospect buys." /></h1>
          <span>Track prospects, quote follow-ups, and conversion readiness.</span>
        </div>
        <div className="header-actions">
          <button className="outline-button" onClick={exportCsv}>Export CSV</button>
          <button className="primary-button" onClick={onNewLead}>+ New Lead / Quote</button>
        </div>
      </div>
      <Panel>
        <div className="toolbar">
          <input className="search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone, product, owner..." />
          <select className="input small" value={interest} onChange={(event) => setInterest(event.target.value)} aria-label="Filter by insurance interest">
            <option value="All">All Interests</option>
            {LEAD_INTERESTS.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="input small" value={source} onChange={(event) => setSource(event.target.value)} aria-label="Filter by lead source">
            <option value="All">All Sources</option>
            {LEAD_SOURCES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="segmented-control left wrap">
          {statusFilters.map((item) => (
            <button key={item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>
              {item}{item !== 'All' && ` (${leads.filter((lead) => lead.status === item).length})`}
            </button>
          ))}
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Interest</th><th>Product</th><th>Status</th><th>Priority</th><th>Source</th><th>Owner</th><th>Premium</th><th>Actions</th></tr></thead>
            <tbody>
              {visibleLeads.length === 0 && (
                <tr><td colSpan="9"><div className="empty-state compact">No leads match these filters.</div></td></tr>
              )}
              {visibleLeads.map((lead) => (
                <tr key={lead.id}>
                  <td><button className="table-link" onClick={() => onSelectLead(lead.id)}>{lead.name}</button><small>{lead.email}</small></td>
                  <td>{lead.interest}</td>
                  <td>{lead.product}</td>
                  <td>
                    <select className="mini-select" value={lead.status} onChange={(event) => onUpdateLead(lead.id, { status: event.target.value })} aria-label={`Status for ${lead.name}`}>
                      {LEAD_STATUSES.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </td>
                  <td><span className={`priority ${lead.priority.toLowerCase()}`}>{lead.priority}</span></td>
                  <td>{lead.source}</td>
                  <td>{lead.owner}</td>
                  <td>${Number(lead.premium).toLocaleString()}</td>
                  <td>
                    <div className="row-actions">
                      <button onClick={() => onSelectLead(lead.id)}>Open</button>
                      <button onClick={() => setEditingLead(lead)}>Edit</button>
                      <button onClick={() => onConvertLead(lead.id)} disabled={lead.status === 'Converted'}>Convert</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {editingLead && (
        <LeadFormModal
          lead={editingLead}
          title={`Edit Lead — ${editingLead.name}`}
          submitLabel="Save Changes"
          onClose={() => setEditingLead(null)}
          onSave={(updates) => { onUpdateLead(editingLead.id, updates); setEditingLead(null); }}
        />
      )}
    </main>
  );
}
