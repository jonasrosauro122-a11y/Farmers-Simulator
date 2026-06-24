import { useMemo, useState } from 'react';
import { SfButton, SfEmptyState, SfListHeader, SfListToolbar } from '../components/SalesforceMock.jsx';

function LeadRows({ rows, onSelectLead, onUpdateLead, onConvertLead }) {
  return (
    <div className="sf-table-wrap">
      <table className="sf-data-table">
        <thead>
          <tr>
            <th><input type="checkbox" aria-label="Select all leads" /></th>
            <th>Lead Name</th>
            <th>Company/Household</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
            <th>Line</th>
            <th>Owner</th>
            <th>Premium</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((lead) => (
            <tr key={lead.id}>
              <td><input type="checkbox" aria-label={`Select ${lead.name}`} /></td>
              <td><button className="sf-table-link" onClick={() => onSelectLead(lead.id)}>{lead.name}</button></td>
              <td>{lead.company || lead.household || lead.name}</td>
              <td>{lead.phone || '—'}</td>
              <td>{lead.email || '—'}</td>
              <td>
                <select value={lead.status} onChange={(event) => onUpdateLead(lead.id, { status: event.target.value })}>
                  {['New', 'Contacted', 'Quoted', 'Follow-Up', 'Converted', 'Lost'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </td>
              <td>{lead.type || lead.interest || '—'}</td>
              <td>{lead.owner || 'Training Team'}</td>
              <td>${Number(lead.premium || 0).toLocaleString()}</td>
              <td>
                <button className="sf-row-menu" onClick={() => onConvertLead(lead.id)} disabled={lead.status === 'Converted'}>▾</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LeadsPage({ leads, onSelectLead, onUpdateLead, onConvertLead, onNewLead }) {
  const [search, setSearch] = useState('');
  const visibleLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return leads;
    return leads.filter((lead) => `${lead.name} ${lead.email} ${lead.phone} ${lead.status} ${lead.type} ${lead.owner}`.toLowerCase().includes(term));
  }, [leads, search]);

  return (
    <main className="sf-page sf-page-white">
      <SfListHeader objectName="Leads" icon="★" iconTone="teal" itemCount={visibleLeads.length}>
        <SfButton onClick={onNewLead}>New</SfButton>
        <SfButton>Bulk Actions</SfButton>
        <SfButton>Quick Send Email</SfButton>
        <SfButton>Share</SfButton>
        <SfButton>Delete Shared List View</SfButton>
      </SfListHeader>

      <SfListToolbar search={search} onSearch={setSearch} />

      {visibleLeads.length === 0 ? (
        <SfEmptyState title="Nothing to see here" text="There's nothing in your list yet. Try adding a new record." />
      ) : (
        <LeadRows rows={visibleLeads} onSelectLead={onSelectLead} onUpdateLead={onUpdateLead} onConvertLead={onConvertLead} />
      )}
    </main>
  );
}
