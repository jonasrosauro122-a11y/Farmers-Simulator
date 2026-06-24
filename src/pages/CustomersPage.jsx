import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ComplianceBanner } from '../components/ComplianceGuard.jsx';
import { seedCustomers, seedPolicies } from '../data/book.js';
import { loadLocal } from '../utils/storage.js';

const TYPES = ['All', 'Personal Lines Household', 'Commercial Business', 'Active Client', 'Prospect'];

function statusTone(status) {
  if (/active/i.test(status)) return 'green';
  if (/prospect/i.test(status)) return 'amber';
  return 'gray';
}

export default function CustomersPage({ onNavigate }) {
  const book = useMemo(() => loadLocal('apexCrm3.book', null), []);
  const customers = book?.customers || seedCustomers;
  const policies = book?.policies || seedPolicies;
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesType = type === 'All' || c.accountType === type || c.customerStatus === type;
      const matchesTerm = !term || `${c.household} ${c.primaryContact} ${c.city} ${c.state}`.toLowerCase().includes(term);
      return matchesType && matchesTerm;
    });
  }, [customers, search, type]);

  const policiesFor = (customer) => policies.filter((p) => customer.policyNumbers.includes(p.policyNumber));

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Customers</p>
          <h1>Customer Book <InfoTip text="Fictional households and businesses used for training. Click a row to view the customer and their dummy policies." /></h1>
          <span>Active clients, prospects, households, and commercial businesses — all dummy training records.</span>
        </div>
        <div className="header-actions">
          <button className="primary-button" onClick={() => onNavigate('accounts')}>Open Accounts</button>
        </div>
      </div>

      <ComplianceBanner compact />

      <Panel className="list-panel">
        <div className="list-toolbar">
          <input className="input list-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…" />
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <span className="list-count">{filtered.length} customers</span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Customer</th><th>Type</th><th>Contact</th><th>Location</th><th>Policies</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="clickable-row" onClick={() => setSelected(c)}>
                  <td className="link-cell">{c.household}</td>
                  <td>{c.accountType}</td>
                  <td>{c.primaryContact}</td>
                  <td>{c.city}, {c.state}</td>
                  <td>{c.policyNumbers.length}</td>
                  <td><span className={`status-badge ${statusTone(c.customerStatus)}`}>{c.customerStatus}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="empty-cell">No customers match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {selected && (
        <Panel title={selected.household} icon="👥" action={<button className="text-button" onClick={() => setSelected(null)}>Close ✕</button>}>
          <div className="detail-grid">
            <div><span className="detail-label">Primary contact</span><span>{selected.primaryContact}</span></div>
            <div><span className="detail-label">Type</span><span>{selected.accountType}</span></div>
            <div><span className="detail-label">Phone</span><span>{selected.phone}</span></div>
            <div><span className="detail-label">Email</span><span>{selected.email}</span></div>
            <div><span className="detail-label">Address</span><span>{selected.address}, {selected.city}, {selected.state} {selected.zip}</span></div>
            <div><span className="detail-label">Status</span><span className={`status-badge ${statusTone(selected.customerStatus)}`}>{selected.customerStatus}</span></div>
          </div>
          <h3 className="subhead">Policies</h3>
          {policiesFor(selected).length === 0 ? (
            <p className="empty-line">No policies on file (prospect).</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Policy #</th><th>LOB</th><th>Premium</th><th>Status</th></tr></thead>
                <tbody>
                  {policiesFor(selected).map((p) => (
                    <tr key={p.policyNumber}><td>{p.policyNumber}</td><td>{p.lob}</td><td>${p.premium.toLocaleString()}</td><td>{p.status}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="button-row">
            <button className="outline-button" onClick={() => onNavigate('policies')}>View all policies</button>
            <button className="outline-button" onClick={() => onNavigate('service-requests')}>New service request</button>
          </div>
        </Panel>
      )}
    </main>
  );
}
