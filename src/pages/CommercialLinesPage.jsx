import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import Modal from '../components/Modal.jsx';
import { ComplianceBanner } from '../components/ComplianceGuard.jsx';
import { endorsementTypes } from '../data/portalData.js';
import { todayISO } from '../utils/dates.js';

const PRODUCTS = [
  { id: 'gl', name: 'General Liability', icon: '⚖️', summary: 'Third-party bodily injury, property damage, and personal/advertising injury for a business.', coverages: ['Premises & operations liability', 'Products & completed operations', 'Personal & advertising injury', 'Medical payments'], intake: ['Legal business name & FEIN', 'Operations description', 'Annual revenue & payroll', 'Subcontractor use', 'Loss history'], service: 'COI requests, additional insured, and waiver of subrogation are common GL service items.' },
  { id: 'business-auto', name: 'Business Auto', icon: '🚚', summary: 'Liability and physical damage for vehicles owned, hired, or used by the business.', coverages: ['Liability (owned/hired/non-owned)', 'Collision & comprehensive', 'Uninsured motorist', 'Medical payments'], intake: ['Vehicles & VINs', 'Drivers & MVR consent', 'Radius of operation', 'Cargo / use', 'Lienholders'], service: 'Driver adds/removes and vehicle changes are frequent business-auto service requests.' },
  { id: 'bop', name: 'Business Owners Policy (BOP)', icon: '🏬', summary: 'Packaged property + liability coverage for eligible small businesses.', coverages: ['Building & business personal property', 'Business income / extra expense', 'General liability', 'Equipment breakdown (optional)'], intake: ['Location(s) & square footage', 'Building vs tenant', 'Annual sales', 'Protection class / alarms', 'Prior losses'], service: 'Endorsements, location changes, and renewal reviews are common BOP service items.' },
  { id: 'workers-comp', name: 'Workers Compensation', icon: '👷', summary: 'Statutory coverage for work-related employee injuries and lost wages.', coverages: ['Statutory workers compensation', "Employer's liability", 'Medical & indemnity benefits'], intake: ['Payroll by class code', 'Number of employees', 'Owner inclusion/exclusion', 'States of operation', 'Prior experience mod'], service: 'Payroll updates and annual audits are the core workers-comp service tasks.' },
  { id: 'commercial-property', name: 'Commercial Property', icon: '🏭', summary: 'Coverage for buildings, contents, and business income at insured locations.', coverages: ['Building', 'Business personal property', 'Business income', 'Inland marine (optional)'], intake: ['Location details & construction', 'Building value / replacement cost', 'Contents value', 'Protective safeguards', 'Lender/mortgagee'], service: 'Evidence of insurance and lender updates are frequent commercial-property requests.' },
  { id: 'coi', name: 'Certificates of Insurance', icon: '📜', summary: 'Proof-of-coverage documents issued to certificate holders.', coverages: ['Evidence of GL / Auto / WC / Property', 'Additional insured (when endorsed)', 'Waiver of subrogation (when endorsed)'], intake: ['Certificate holder name & address', 'Required wording / contract reference', 'Which policies to list', 'Deadline'], service: 'A VA can prepare and route COI drafts; issuance is licensed work in most states.' }
];

function money(value) { return `$${Number(value || 0).toLocaleString()}`; }

function EndorseModal({ account, policy, onClose, onSave }) {
  const [draft, setDraft] = useState({ type: 'Additional insured request', note: '', effectiveDate: todayISO() });
  const commercialTypes = endorsementTypes.filter((x) => x.includes('Additional insured') || x.includes('Waiver') || x.includes('Certificate') || x.includes('Payroll') || x.includes('Business') || x.includes('Add or remove vehicle'));
  return (
    <Modal title={`Commercial Lines Endorsement — ${policy.number}`} onClose={onClose}>
      <p className="helper-text">Commercial changes often require contracts, schedules, payroll, or underwriting review. Collect details only and route for licensed handling.</p>
      <div className="form-stack">
        <label><span>Policy</span><input className="input" value={`${policy.number} · ${policy.line}`} disabled /></label>
        <label><span>Change Type</span><select className="input" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>{commercialTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>Requested Effective Date</span><input className="input" type="date" value={draft.effectiveDate} onChange={(e) => setDraft({ ...draft, effectiveDate: e.target.value })} /></label>
        <label><span>Contract / Customer Instructions</span><textarea className="input" rows="4" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="Paste certificate wording, contract requirement, vehicle/driver detail, payroll note, etc." /></label>
        <div className="button-row right"><button className="outline-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => onSave(account, policy, draft)}>Route for Licensed Review</button></div>
      </div>
    </Modal>
  );
}

export default function CommercialLinesPage({ onNavigate, accounts = [], onSelectAccount, onUpdateAccount, onToast }) {
  const [activeId, setActiveId] = useState('gl');
  const [docPolicy, setDocPolicy] = useState(null);
  const [endorse, setEndorse] = useState(null);
  const product = PRODUCTS.find((item) => item.id === activeId);
  const commercialAccounts = useMemo(() => accounts.filter((account) => account.type === 'Commercial Lines'), [accounts]);

  const saveEndorsement = (account, policy, draft) => {
    const endorsement = { id: `END-CL-${Math.floor(1000 + Math.random() * 8999)}`, type: draft.type, status: 'Licensed Review Required', requestedDate: todayISO(), effectiveDate: draft.effectiveDate, note: draft.note || 'No note entered.' };
    onUpdateAccount?.(account.id, {
      policies: account.policies.map((item) => item.number === policy.number ? { ...item, endorsementQueue: [endorsement, ...(item.endorsementQueue || [])] } : item),
      documents: [{ id: `DOC-${endorsement.id}`, name: `${draft.type} Request`, type: 'Commercial Endorsement', date: todayISO() }, ...(account.documents || [])],
      activity: [{ date: todayISO(), author: 'Trainee', text: `Commercial Lines endorsement request collected for ${policy.number}: ${draft.type}.` }, ...(account.activity || [])]
    });
    setEndorse(null);
    onToast?.('Commercial Lines endorsement routed for licensed review.');
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Commercial Lines</p>
          <h1>Commercial Lines Portal & Product Training <InfoTip text="Open commercial policies, view documents, and route certificate or endorsement requests. Issuance and coverage decisions remain licensed work." /></h1>
          <span>General Liability, Business Auto, BOP, Workers Comp, Commercial Property, COI, plus service portal practice.</span>
        </div>
        <div className="header-actions"><button className="outline-button" onClick={() => onNavigate('service-ops')}>Open Service Ops</button><button className="primary-button" onClick={() => onNavigate('service-requests')}>Service Requests</button></div>
      </div>
      <ComplianceBanner compact />

      <div className="portal-section-card">
        <div><p className="eyebrow">Commercial Lines Portal</p><h2>Policies, Docs, COI & Endorsements</h2><span>Open policy records, view dummy forms/docs, and route commercial changes for licensed review.</span></div>
        {commercialAccounts.map((account) => (
          <Panel key={account.id} title={account.household} icon="🏢" action={<button className="outline-button" onClick={() => onSelectAccount?.(account.id)}>Open Account</button>}>
            <div className="table-wrap"><table className="data-table"><thead><tr><th>Policy #</th><th>Line</th><th>Status</th><th>Billing</th><th>Premium</th><th>Actions</th></tr></thead><tbody>{account.policies.map((policy) => <tr key={policy.number}><td><button className="table-text-link" onClick={() => setDocPolicy({ account, policy })}>{policy.number}</button></td><td>{policy.line}</td><td>{policy.status}</td><td>{policy.billingAccount || account.billing?.accountNumber}</td><td>{money(policy.premium)}</td><td><button className="outline-button mini" onClick={() => setEndorse({ account, policy })}>Endorse / COI</button></td></tr>)}</tbody></table></div>
          </Panel>
        ))}
      </div>

      <div className="lob-layout">
        <Panel title="Coverages" className="lob-rail"><div className="lob-rail-list">{PRODUCTS.map((item) => <button key={item.id} className={`lob-rail-item ${item.id === activeId ? 'active' : ''}`} onClick={() => setActiveId(item.id)}><span className="lob-icon">{item.icon}</span><span>{item.name}</span></button>)}</div></Panel>
        <Panel title={`${product.icon} ${product.name}`} className="lob-detail"><p className="helper-text">{product.summary}</p><div className="lob-grid"><div className="lob-card"><h3>What it covers</h3><ul>{product.coverages.map((c) => <li key={c}>{c}</li>)}</ul></div><div className="lob-card"><h3>Intake to collect</h3><ul>{product.intake.map((c) => <li key={c}>{c}</li>)}</ul></div></div><div className="lob-cross-sell"><strong>Common service work:</strong> {product.service}</div><div className="button-row"><button className="primary-button" onClick={() => onNavigate('accounts')}>Create commercial account</button><button className="outline-button" onClick={() => onNavigate('leads')}>Create commercial lead</button><button className="outline-button" onClick={() => onNavigate('service-ops')}>Ask Service Ops</button></div></Panel>
      </div>

      {docPolicy && <Modal title={`Commercial Documents — ${docPolicy.policy.number}`} onClose={() => setDocPolicy(null)}><div className="tile-list">{(docPolicy.policy.documents || []).map((doc) => <div className="lead-tile" key={doc}><div><h3>📄 {doc}</h3><p>{docPolicy.policy.line} · {docPolicy.account.household}</p></div><div className="row-actions"><button onClick={() => onToast?.(`Viewed ${doc} (simulated).`)}>View</button></div></div>)}</div><div className="button-row right"><button className="outline-button" onClick={() => onToast?.('Certificate draft opened (simulated).')}>Prepare COI Draft</button></div></Modal>}
      {endorse && <EndorseModal account={endorse.account} policy={endorse.policy} onClose={() => setEndorse(null)} onSave={saveEndorsement} />}
    </main>
  );
}
