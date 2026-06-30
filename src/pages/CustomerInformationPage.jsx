import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import Modal from '../components/Modal.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ComplianceBanner } from '../components/ComplianceGuard.jsx';
import { endorsementTypes } from '../data/portalData.js';
import { todayISO } from '../utils/dates.js';

function money(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function AccountCard({ account, active, onClick }) {
  const totalPremium = account.policies.reduce((sum, policy) => sum + Number(policy.premium || 0), 0);
  return (
    <button className={`portal-account-card ${active ? 'active' : ''}`} onClick={onClick}>
      <span>{account.type}</span>
      <strong>{account.household}</strong>
      <small>{account.customerCode || account.id} · {account.status}</small>
      <em>{account.policies.length} policies · {money(totalPremium)}</em>
    </button>
  );
}

function PolicyModal({ policy, account, onClose, onEndorse, onToast }) {
  if (!policy) return null;
  return (
    <Modal title={`Policy Portal — ${policy.number}`} onClose={onClose} size="large">
      <div className="portal-policy-modal">
        <div className="portal-blue-strip">
          <div><span>Policy Summary</span><strong>{policy.line}</strong></div>
          <div><span>Status</span><strong>{policy.status}</strong></div>
          <div><span>Term</span><strong>{policy.effective} to {policy.expiration}</strong></div>
        </div>
        <div className="portal-two-col">
          <div className="detail-list compact-list">
            <div><span>Named insured</span><strong>{account.primaryContact}</strong></div>
            <div><span>Customer</span><strong>{account.household}</strong></div>
            <div><span>Carrier</span><strong>{policy.carrier || 'LAVA Sim Carrier'}</strong></div>
            <div><span>Policy Type</span><strong>{policy.policyType || policy.line}</strong></div>
            <div><span>Billing Account</span><strong>{policy.billingAccount || account.billing?.accountNumber || '—'}</strong></div>
            <div><span>Annual Premium</span><strong>{money(policy.premium)}</strong></div>
          </div>
          <div className="portal-mini-panel">
            <h3>Coverage snapshot</h3>
            {(policy.coverages || []).map((item) => <p key={item.label}><b>{item.label}</b><span>{item.value}</span></p>)}
            {(!policy.coverages || policy.coverages.length === 0) && <p>No coverage snapshot on this demo policy.</p>}
          </div>
        </div>
        <div className="portal-two-col">
          <div className="portal-mini-panel">
            <h3>Policy details</h3>
            {policy.propertyAddress && <p><b>Property</b><span>{policy.propertyAddress}</span></p>}
            {policy.vehicles && <p><b>Vehicles</b><span>{policy.vehicles.join(', ')}</span></p>}
            {policy.locations && <p><b>Locations</b><span>{policy.locations.join(', ')}</span></p>}
            <p><b>Agent of record</b><span>{policy.agentOfRecord || account.accountManager}</span></p>
            <p><b>Underwriting company</b><span>{policy.underwritingCompany || 'LAVA Sim Underwriting'}</span></p>
          </div>
          <div className="portal-mini-panel">
            <h3>Available documents</h3>
            {(policy.documents || []).map((doc) => (
              <button className="doc-link-row" key={doc} onClick={() => onToast?.(`Opened ${doc} for ${policy.number} (simulated).`)}>📄 {doc}</button>
            ))}
          </div>
        </div>
        <div className="button-row right">
          <button className="outline-button" onClick={() => onToast?.(`Opened forms list for ${policy.number} (simulated).`)}>View Forms</button>
          <button className="outline-button" onClick={() => onToast?.(`Opened document viewer for ${policy.number} (simulated).`)}>View Docs</button>
          <button className="primary-button" onClick={() => onEndorse(policy)}>Request Endorsement</button>
        </div>
      </div>
    </Modal>
  );
}

function EndorsementModal({ account, policy, onClose, onSave }) {
  const [draft, setDraft] = useState({ type: endorsementTypes[0], effectiveDate: todayISO(), note: '' });
  const save = () => {
    onSave({
      id: `END-${Math.floor(1000 + Math.random() * 8999)}`,
      type: draft.type,
      policyNumber: policy?.number || account.policies[0]?.number || 'Account level',
      status: 'Licensed Review Required',
      requestedDate: todayISO(),
      effectiveDate: draft.effectiveDate,
      note: draft.note || 'No additional note entered.'
    });
  };
  return (
    <Modal title="Request Policy Change / Endorsement" onClose={onClose}>
      <p className="helper-text">Simulator workflow only. A VA can collect the change request and route it. Do not confirm coverage, premium, eligibility, or approval.</p>
      <div className="form-stack">
        <label><span>Policy</span><input className="input" value={policy?.number || account.policies[0]?.number || 'Account level'} disabled /></label>
        <label><span>Change Type</span><select className="input" value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })}>{endorsementTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>Requested Effective Date</span><input className="input" type="date" value={draft.effectiveDate} onChange={(e) => setDraft({ ...draft, effectiveDate: e.target.value })} /></label>
        <label><span>Customer Request / Details</span><textarea className="input" rows="4" value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} placeholder="Type the customer's request verbatim. Attachments are simulated." /></label>
        <div className="button-row right"><button className="outline-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={save}>Route for Licensed Review</button></div>
      </div>
    </Modal>
  );
}

export default function CustomerInformationPage({ accounts, onSelectAccount, onUpdateAccount, onNavigate, onToast }) {
  const [selectedId, setSelectedId] = useState(accounts[0]?.id || '');
  const [policyModal, setPolicyModal] = useState(null);
  const [endorsePolicy, setEndorsePolicy] = useState(null);
  const [tab, setTab] = useState('Policies');

  const selected = useMemo(() => accounts.find((account) => account.id === selectedId) || accounts[0], [accounts, selectedId]);

  const saveEndorsement = (endorsement) => {
    if (!selected) return;
    const policyNumber = endorsement.policyNumber;
    const nextPolicies = selected.policies.map((policy) => (
      policy.number === policyNumber
        ? { ...policy, endorsementQueue: [endorsement, ...(policy.endorsementQueue || [])] }
        : policy
    ));
    const doc = { id: `DOC-END-${Math.floor(100 + Math.random() * 899)}`, name: `${endorsement.type} Request`, type: 'Endorsement Request', date: todayISO() };
    onUpdateAccount(selected.id, {
      policies: nextPolicies,
      documents: [doc, ...(selected.documents || [])],
      activity: [
        { date: todayISO(), author: 'Trainee', text: `Endorsement request collected for ${policyNumber}: ${endorsement.type}. Routed to licensed review.` },
        ...(selected.activity || [])
      ]
    });
    setEndorsePolicy(null);
    onToast?.('Endorsement request routed to licensed review.');
  };

  if (!selected) {
    return (
      <main className="workspace page-bg">
        <div className="empty-state">No accounts available. Create an account first.</div>
      </main>
    );
  }

  return (
    <main className="workspace page-bg portal-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Customer Information</p>
          <h1>Customer, Policy & Billing Portal <InfoTip text="This page mirrors the customer info flow in the reference file: customer record first, then clickable policy and billing portals." /></h1>
          <span>Practice customer lookup, policy access, billing access, document viewing, and endorsement routing using dummy data.</span>
        </div>
        <div className="header-actions">
          <button className="outline-button" onClick={() => onNavigate('billing')}>Open Billing Center</button>
          <button className="primary-button" onClick={() => onSelectAccount(selected.id)}>Open Account Record</button>
        </div>
      </div>

      <ComplianceBanner compact />

      <div className="portal-customer-layout">
        <Panel title="Customer Search Results" className="portal-customer-rail">
          <div className="portal-account-list">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} active={selected.id === account.id} onClick={() => setSelectedId(account.id)} />
            ))}
          </div>
        </Panel>

        <section className="portal-record-area">
          <Panel>
            <div className="portal-record-header">
              <div>
                <p className="eyebrow">{selected.type} · {selected.customerCode || selected.id}</p>
                <h2>{selected.household}</h2>
                <span>{selected.primaryContact} · {selected.phone} · {selected.email}</span>
              </div>
              <div className="portal-contact-card">
                <strong>Contact Card</strong>
                <span>Preferred: {selected.communicationPreference || 'Phone'}</span>
                <span>Language: {selected.preferredLanguage || 'English'}</span>
                <button onClick={() => onToast?.('Customer contact verified (simulated).')}>Validate</button>
              </div>
            </div>
            <div className="tabs-row account-tabs">
              {['Details', 'Policies', 'Billing', 'Documents', 'Activities'].map((item) => <button key={item} className={`tab ${tab === item ? 'active' : ''}`} onClick={() => setTab(item)}>{item}</button>)}
            </div>

            {tab === 'Details' && (
              <div className="detail-grid in-panel">
                <div className="detail-list">
                  <div><span>Customer Type</span><strong>{selected.type}</strong></div>
                  <div><span>Status</span><strong>{selected.status}</strong></div>
                  <div><span>Address</span><strong>{selected.address}</strong></div>
                  <div><span>Customer Since</span><strong>{selected.customerSince}</strong></div>
                  <div><span>Account Manager</span><strong>{selected.accountManager}</strong></div>
                </div>
                <div className="portal-mini-panel">
                  <h3>Allowed VA actions</h3>
                  <ul>
                    <li>Verify customer contact information.</li>
                    <li>Open policy and billing pages.</li>
                    <li>Collect service request details.</li>
                    <li>Route changes to licensed staff.</li>
                  </ul>
                </div>
              </div>
            )}

            {tab === 'Policies' && (
              <div className="table-wrap in-panel">
                <table className="data-table">
                  <thead><tr><th>Policy Number</th><th>Line</th><th>Status</th><th>Effective</th><th>Expiration</th><th>Premium</th><th>Actions</th></tr></thead>
                  <tbody>
                    {selected.policies.map((policy) => (
                      <tr key={policy.number}>
                        <td><button className="table-text-link" onClick={() => setPolicyModal(policy)}>{policy.number}</button></td>
                        <td>{policy.line}</td>
                        <td><span className="status-chip">{policy.status}</span></td>
                        <td>{policy.effective}</td>
                        <td>{policy.expiration}</td>
                        <td>{money(policy.premium)}</td>
                        <td><button className="outline-button mini" onClick={() => setEndorsePolicy(policy)}>Endorse Change</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="helper-text">Click a policy number to access the Personal Lines or Commercial Lines policy portal.</p>
              </div>
            )}

            {tab === 'Billing' && (
              <div className="portal-billing-summary in-panel">
                <div className="portal-blue-strip">
                  <div><span>Billing Account</span><button onClick={() => onNavigate('billing')}>{selected.billing?.accountNumber}</button></div>
                  <div><span>Status</span><strong>{selected.billing?.status}</strong></div>
                  <div><span>Balance</span><strong>{money(selected.billing?.balance)}</strong></div>
                  <div><span>Next Due</span><strong>{selected.billing?.nextDueDate}</strong></div>
                </div>
                <div className="table-wrap">
                  <table className="data-table"><thead><tr><th>Date</th><th>Transaction Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>{(selected.billing?.paymentHistory || []).map((row) => <tr key={`${row.date}-${row.type}`}><td>{row.date}</td><td>{row.type}</td><td>{money(row.amount)}</td><td>{row.status}</td></tr>)}</tbody></table>
                </div>
              </div>
            )}

            {tab === 'Documents' && (
              <div className="tile-list in-panel">
                {(selected.documents || []).map((doc) => (
                  <div className="lead-tile" key={doc.id}>
                    <div><h3>📄 {doc.name}</h3><p>{doc.type} · {doc.date}</p></div>
                    <div className="row-actions"><button onClick={() => onToast?.(`Viewed ${doc.name} (simulated).`)}>View</button></div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Activities' && (
              <div className="note-list timeline in-panel">
                {(selected.activity || []).map((item, index) => <div className="note-item" key={index}><small>{item.date} · {item.author}</small><p>{item.text}</p></div>)}
              </div>
            )}
          </Panel>
        </section>
      </div>

      {policyModal && <PolicyModal policy={policyModal} account={selected} onClose={() => setPolicyModal(null)} onEndorse={(policy) => { setPolicyModal(null); setEndorsePolicy(policy); }} onToast={onToast} />}
      {endorsePolicy && <EndorsementModal account={selected} policy={endorsePolicy} onClose={() => setEndorsePolicy(null)} onSave={saveEndorsement} />}
    </main>
  );
}
