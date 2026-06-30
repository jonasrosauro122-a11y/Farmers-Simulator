import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import Modal from '../components/Modal.jsx';
import { ComplianceBanner } from '../components/ComplianceGuard.jsx';
import { endorsementTypes } from '../data/portalData.js';
import { todayISO } from '../utils/dates.js';

const PRODUCTS = [
  { id: 'home', name: 'Homeowners (HO-3)', icon: '🏠', summary: 'Owner-occupied home coverage on an open-perils dwelling basis.', coverages: ['Coverage A — Dwelling', 'Coverage B — Other structures', 'Coverage C — Personal property', 'Coverage D — Loss of use', 'Coverage E — Personal liability', 'Coverage F — Medical payments'], intake: ['Property address', 'Year built & square footage', 'Roof age & updates', 'Mortgagee/lender', 'Prior carrier & claims'], crossSell: 'Pair with Auto for a multi-policy household and add Umbrella for higher liability limits.' },
  { id: 'auto', name: 'Personal Auto', icon: '🚗', summary: 'Coverage for personal vehicles, drivers, and liability on the road.', coverages: ['Bodily injury & property damage liability', 'Collision & comprehensive', 'Uninsured/underinsured motorist', 'Medical payments / PIP', 'Roadside & rental reimbursement'], intake: ['Drivers (name, DOB, license)', 'Vehicles & VINs', 'Garaging address', 'Lienholder (if financed)', 'Prior coverage & claims'], crossSell: 'Bundle with Home or Renters; suggest Umbrella for households with assets to protect.' },
  { id: 'renters', name: 'Renters (HO-4)', icon: '🔑', summary: 'Personal property and liability protection for tenants.', coverages: ['Personal property', 'Personal liability', 'Loss of use', 'Medical payments'], intake: ['Rental address', 'Estimated contents value', 'Roommates / additional interests', 'Required by landlord?'], crossSell: 'Renters + Auto is a common first bundle for new customers.' },
  { id: 'condo', name: 'Condo (HO-6)', icon: '🏢', summary: 'Unit-owner coverage that fills gaps left by the master HOA policy.', coverages: ['Building/interior improvements', 'Personal property', 'Loss assessment', 'Personal liability', 'Loss of use'], intake: ['Unit address', 'HOA master policy type (bare walls vs all-in)', 'Improvements/betterments', 'Mortgagee'], crossSell: 'Add Auto and Umbrella; confirm loss assessment limit matches HOA exposure.' },
  { id: 'dwelling-fire', name: 'Dwelling Fire (DP-3)', icon: '🔥', summary: 'Coverage for rented or non-owner-occupied dwellings.', coverages: ['Dwelling', 'Other structures', 'Fair rental value', 'Personal liability (optional)'], intake: ['Property address', 'Occupancy (tenant/seasonal/vacant)', 'Lease term', 'Roof & systems age'], crossSell: 'Investors often need multiple Dwelling Fire policies plus an Umbrella.' },
  { id: 'umbrella', name: 'Personal Umbrella', icon: '☂️', summary: 'Extra liability limits above home and auto underlying policies.', coverages: ['Excess liability over auto/home', 'Broadened personal liability', 'Defense costs'], intake: ['Underlying auto/home limits', 'Number of vehicles & drivers', 'Rental properties', 'Watercraft / recreational exposure'], crossSell: 'Requires qualifying underlying limits — a natural add-on at quote and renewal.' }
];

function money(value) { return `$${Number(value || 0).toLocaleString()}`; }

function EndorseModal({ account, policy, onClose, onSave }) {
  const [draft, setDraft] = useState({ type: endorsementTypes[0], note: '', effectiveDate: todayISO() });
  return (
    <Modal title={`Personal Lines Endorsement — ${policy.number}`} onClose={onClose}>
      <p className="helper-text">Collect and route only. Licensed staff must review and approve policy changes.</p>
      <div className="form-stack">
        <label><span>Policy</span><input className="input" value={`${policy.number} · ${policy.line}`} disabled /></label>
        <label><span>Change Type</span><select className="input" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>{endorsementTypes.filter((x) => !x.includes('Additional insured') && !x.includes('Payroll')).map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>Effective Date</span><input className="input" type="date" value={draft.effectiveDate} onChange={(e) => setDraft({ ...draft, effectiveDate: e.target.value })} /></label>
        <label><span>Request Details</span><textarea className="input" rows="4" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} /></label>
        <div className="button-row right"><button className="outline-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => onSave(account, policy, draft)}>Route for Licensed Review</button></div>
      </div>
    </Modal>
  );
}

export default function PersonalLinesPage({ onNavigate, accounts = [], onSelectAccount, onUpdateAccount, onToast }) {
  const [activeId, setActiveId] = useState('home');
  const [docPolicy, setDocPolicy] = useState(null);
  const [endorse, setEndorse] = useState(null);
  const product = PRODUCTS.find((item) => item.id === activeId);
  const personalAccounts = useMemo(() => accounts.filter((account) => account.type === 'Personal Lines'), [accounts]);

  const saveEndorsement = (account, policy, draft) => {
    const endorsement = { id: `END-PL-${Math.floor(1000 + Math.random() * 8999)}`, type: draft.type, status: 'Licensed Review Required', requestedDate: todayISO(), effectiveDate: draft.effectiveDate, note: draft.note || 'No note entered.' };
    onUpdateAccount?.(account.id, {
      policies: account.policies.map((item) => item.number === policy.number ? { ...item, endorsementQueue: [endorsement, ...(item.endorsementQueue || [])] } : item),
      documents: [{ id: `DOC-${endorsement.id}`, name: `${draft.type} Request`, type: 'Endorsement', date: todayISO() }, ...(account.documents || [])],
      activity: [{ date: todayISO(), author: 'Trainee', text: `Personal Lines endorsement request collected for ${policy.number}: ${draft.type}.` }, ...(account.activity || [])]
    });
    setEndorse(null);
    onToast?.('Personal Lines endorsement routed for licensed review.');
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Personal Lines</p>
          <h1>Personal Lines Portal & Product Training <InfoTip text="The portal section lets trainees open policies, view documents, and request changes without giving coverage advice." /></h1>
          <span>Homeowners, Auto, Renters, Condo, Dwelling Fire, and Umbrella — plus policy/document/endorsement practice.</span>
        </div>
        <div className="header-actions"><button className="outline-button" onClick={() => onNavigate('customer-info')}>Customer Info</button><button className="primary-button" onClick={() => onNavigate('quote-center')}>Open Quote Center</button></div>
      </div>
      <ComplianceBanner compact />

      <div className="portal-section-card">
        <div><p className="eyebrow">Personal Lines Portal</p><h2>Policies, Documents & Endorsements</h2><span>Click policy numbers to view documents or request a change for licensed review.</span></div>
        {personalAccounts.map((account) => (
          <Panel key={account.id} title={account.household} icon="👤" action={<button className="outline-button" onClick={() => onSelectAccount?.(account.id)}>Open Account</button>}>
            <div className="table-wrap"><table className="data-table"><thead><tr><th>Policy #</th><th>Line</th><th>Status</th><th>Billing</th><th>Premium</th><th>Actions</th></tr></thead><tbody>{account.policies.map((policy) => <tr key={policy.number}><td><button className="table-text-link" onClick={() => setDocPolicy({ account, policy })}>{policy.number}</button></td><td>{policy.line}</td><td>{policy.status}</td><td>{policy.billingAccount || account.billing?.accountNumber}</td><td>{money(policy.premium)}</td><td><button className="outline-button mini" onClick={() => setEndorse({ account, policy })}>Endorse Change</button></td></tr>)}</tbody></table></div>
          </Panel>
        ))}
      </div>

      <div className="lob-layout">
        <Panel title="Products" className="lob-rail"><div className="lob-rail-list">{PRODUCTS.map((item) => <button key={item.id} className={`lob-rail-item ${item.id === activeId ? 'active' : ''}`} onClick={() => setActiveId(item.id)}><span className="lob-icon">{item.icon}</span><span>{item.name}</span></button>)}</div></Panel>
        <Panel title={`${product.icon} ${product.name}`} className="lob-detail"><p className="helper-text">{product.summary}</p><div className="lob-grid"><div className="lob-card"><h3>What it covers</h3><ul>{product.coverages.map((c) => <li key={c}>{c}</li>)}</ul></div><div className="lob-card"><h3>Intake to collect</h3><ul>{product.intake.map((c) => <li key={c}>{c}</li>)}</ul></div></div><div className="lob-cross-sell"><strong>Cross-sell:</strong> {product.crossSell}</div><div className="button-row"><button className="primary-button" onClick={() => onNavigate('leads')}>Create a {product.name} lead</button><button className="outline-button" onClick={() => onNavigate('quote-center')}>Prepare quote intake</button><button className="outline-button" onClick={() => onNavigate('product-learning')}>Sales product learning</button></div></Panel>
      </div>

      {docPolicy && <Modal title={`Documents — ${docPolicy.policy.number}`} onClose={() => setDocPolicy(null)}><div className="tile-list">{(docPolicy.policy.documents || []).map((doc) => <div className="lead-tile" key={doc}><div><h3>📄 {doc}</h3><p>{docPolicy.policy.line} · {docPolicy.account.household}</p></div><div className="row-actions"><button onClick={() => onToast?.(`Viewed ${doc} (simulated).`)}>View</button></div></div>)}</div></Modal>}
      {endorse && <EndorseModal account={endorse.account} policy={endorse.policy} onClose={() => setEndorse(null)} onSave={saveEndorsement} />}
    </main>
  );
}
