import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { LEAD_SOURCES, LINES } from '../data/leads.js';

// Lead Depot: a shared pool of unclaimed leads. Claiming moves a record into "My Leads".
export default function LeadDepotPage({ depotLeads, claimedHistory, onClaim, onNavigate }) {
  const [line, setLine] = useState('All');
  const [state, setState] = useState('All');
  const [priority, setPriority] = useState('All');
  const [source, setSource] = useState('All');
  const [tab, setTab] = useState('available');

  const states = useMemo(() => ['All', ...new Set(depotLeads.map((lead) => lead.state))].sort(), [depotLeads]);

  const visible = depotLeads.filter((lead) => (
    (line === 'All' || lead.type === line) &&
    (state === 'All' || lead.state === state) &&
    (priority === 'All' || lead.priority === priority) &&
    (source === 'All' || lead.source === source)
  ));

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Lead Depot</p>
          <h1>Lead Depot Queue <InfoTip text="Inbound leads land here before anyone owns them. Filter to the work you handle, then Claim — the lead moves to the Leads page assigned to you, and the claim is logged in history." /></h1>
          <span>Practice claiming, reviewing, and assigning inbound opportunities.</span>
        </div>
        <button className="outline-button" onClick={() => onNavigate('leads')}>Go to My Leads</button>
      </div>

      <div className="card-grid three">
        <Panel title="Available Leads" icon="📥"><strong className="big-number">{depotLeads.length}</strong><span className="metric-caption">waiting to be claimed</span></Panel>
        <Panel title="High Priority" icon="💎"><strong className="big-number">{depotLeads.filter((lead) => lead.priority === 'High').length}</strong><span className="metric-caption">claim these first</span></Panel>
        <Panel title="Claimed (History)" icon="✅"><strong className="big-number">{claimedHistory.length}</strong><span className="metric-caption">moved to My Leads</span></Panel>
      </div>

      <Panel
        title={tab === 'available' ? 'Available Lead Depot Records' : 'Claimed History'}
        icon={tab === 'available' ? '📥' : '🕘'}
        action={(
          <div className="segmented-control">
            <button className={tab === 'available' ? 'active' : ''} onClick={() => setTab('available')}>Available ({depotLeads.length})</button>
            <button className={tab === 'claimed' ? 'active' : ''} onClick={() => setTab('claimed')}>Claimed History ({claimedHistory.length})</button>
          </div>
        )}
      >
        {tab === 'available' && (
          <>
            <div className="toolbar">
              <select className="input small" value={line} onChange={(event) => setLine(event.target.value)} aria-label="Line of business">
                <option value="All">All Lines</option>
                {LINES.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select className="input small" value={state} onChange={(event) => setState(event.target.value)} aria-label="State">
                {states.map((item) => <option key={item}>{item === 'All' ? 'All States' : item}</option>)}
              </select>
              <select className="input small" value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Priority">
                <option value="All">All Priorities</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
              <select className="input small" value={source} onChange={(event) => setSource(event.target.value)} aria-label="Source">
                <option value="All">All Sources</option>
                {LEAD_SOURCES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="tile-list">
              {visible.length === 0 && <div className="empty-state compact">No depot leads match these filters — or the queue has been fully claimed. Import more from Agency Lead Import or reset demo data.</div>}
              {visible.map((lead) => (
                <div className="lead-tile" key={lead.id}>
                  <div>
                    <h3>{lead.name} <em className={`priority ${lead.priority.toLowerCase()}`}>{lead.priority}</em></h3>
                    <p>{lead.type} · {lead.interest} · {lead.product} · {lead.city}, {lead.state} · est. ${Number(lead.premium).toLocaleString()}</p>
                    <span>{lead.summary}</span>
                    <small className="tile-meta">Received {lead.receivedDate} · Source: {lead.source}</small>
                  </div>
                  <div className="row-actions">
                    <button className="primary-button compact" onClick={() => onClaim(lead.id)}>Claim Lead</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'claimed' && (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Lead</th><th>Line</th><th>State</th><th>Priority</th><th>Claimed By</th><th>Claimed On</th><th>Lead ID</th></tr></thead>
              <tbody>
                {claimedHistory.length === 0 && <tr><td colSpan="7"><div className="empty-state compact">Nothing claimed yet. Claim a lead from the Available tab.</div></td></tr>}
                {claimedHistory.map((record) => (
                  <tr key={`${record.id}-${record.claimedOn}`}>
                    <td>{record.name}</td>
                    <td>{record.type}</td>
                    <td>{record.state}</td>
                    <td><span className={`priority ${record.priority.toLowerCase()}`}>{record.priority}</span></td>
                    <td>{record.claimedBy}</td>
                    <td>{record.claimedOn}</td>
                    <td><button className="table-link" onClick={() => onNavigate('leads')}>{record.leadId}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </main>
  );
}
