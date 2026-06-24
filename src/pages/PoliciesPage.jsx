import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ComplianceBanner, RestrictedButton } from '../components/ComplianceGuard.jsx';
import { seedPolicies } from '../data/book.js';
import { loadLocal } from '../utils/storage.js';

function billingTone(status) {
  if (/non-pay|pending cancel/i.test(status)) return 'red';
  if (/current/i.test(status)) return 'green';
  return 'amber';
}
function statusTone(status) {
  if (/active/i.test(status)) return 'green';
  if (/cancel/i.test(status)) return 'red';
  return 'amber';
}

export default function PoliciesPage({ onNavigate, onToast }) {
  const policies = useMemo(() => loadLocal('apexCrm3.book', null)?.policies || seedPolicies, []);
  const [search, setSearch] = useState('');
  const [lob, setLob] = useState('All');
  const [selected, setSelected] = useState(null);

  const lobs = useMemo(() => ['All', ...Array.from(new Set(policies.map((p) => p.lob)))], [policies]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return policies.filter((p) => {
      const matchesLob = lob === 'All' || p.lob === lob;
      const matchesTerm = !term || `${p.policyNumber} ${p.household} ${p.lob} ${p.carrier}`.toLowerCase().includes(term);
      return matchesLob && matchesTerm;
    });
  }, [policies, search, lob]);

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Policies</p>
          <h1>Policy List <InfoTip text="Dummy policies attached to fictional households. Click a row to view detail. Endorsements and cancellations are licensed actions." /></h1>
          <span>Search the book of business, filter by line, and open a policy to review its details.</span>
        </div>
        <div className="header-actions">
          <button className="primary-button" onClick={() => onNavigate('service-requests')}>New service request</button>
        </div>
      </div>

      <ComplianceBanner compact />

      <Panel className="list-panel">
        <div className="list-toolbar">
          <input className="input list-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search policies, households, carriers…" />
          <select className="input" value={lob} onChange={(e) => setLob(e.target.value)}>
            {lobs.map((l) => <option key={l}>{l}</option>)}
          </select>
          <span className="list-count">{filtered.length} policies</span>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Policy #</th><th>Household</th><th>LOB</th><th>Carrier</th>
                <th>Premium</th><th>Status</th><th>Billing</th><th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.policyNumber} className="clickable-row" onClick={() => setSelected(p)}>
                  <td className="link-cell">{p.policyNumber}</td>
                  <td>{p.household}</td>
                  <td>{p.lob}</td>
                  <td>{p.carrier}</td>
                  <td>${p.premium.toLocaleString()}</td>
                  <td><span className={`status-badge ${statusTone(p.status)}`}>{p.status}</span></td>
                  <td><span className={`status-badge ${billingTone(p.billingStatus)}`}>{p.billingStatus}</span></td>
                  <td>{p.expirationDate}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="empty-cell">No policies match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {selected && (
        <Panel title={`Policy ${selected.policyNumber}`} icon="📄" action={<button className="text-button" onClick={() => setSelected(null)}>Close ✕</button>}>
          <div className="detail-grid">
            <div><span className="detail-label">Household</span><span>{selected.household}</span></div>
            <div><span className="detail-label">Line of business</span><span>{selected.lob}</span></div>
            <div><span className="detail-label">Carrier</span><span>{selected.carrier}</span></div>
            <div><span className="detail-label">Premium</span><span>${selected.premium.toLocaleString()}</span></div>
            <div><span className="detail-label">Effective</span><span>{selected.effectiveDate}</span></div>
            <div><span className="detail-label">Expires</span><span>{selected.expirationDate}</span></div>
            <div><span className="detail-label">Status</span><span className={`status-badge ${statusTone(selected.status)}`}>{selected.status}</span></div>
            <div><span className="detail-label">Billing</span><span className={`status-badge ${billingTone(selected.billingStatus)}`}>{selected.billingStatus}</span></div>
          </div>
          <div className="button-row">
            <button className="outline-button" onClick={() => onNavigate('service-requests')}>Open service request</button>
            <RestrictedButton label="Endorse / change policy" onBlocked={onToast} />
            <RestrictedButton label="Cancel policy" onBlocked={onToast} />
          </div>
        </Panel>
      )}
    </main>
  );
}
