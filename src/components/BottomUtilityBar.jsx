import { useMemo, useState } from 'react';
import Modal from './Modal.jsx';

// Bottom utility bar: Account Lookup, Report Suspicious Activity, Quick Links,
// Training Center shortcut, and the Privacy Notice.
export default function BottomUtilityBar({ accounts, leads, onOpenAccount, onOpenLead, onNavigate, onToast }) {
  const [lookupOpen, setLookupOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suspiciousOpen, setSuspiciousOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [suspicious, setSuspicious] = useState({ type: 'Potential phishing email', summary: '' });

  const trimmed = query.trim().toLowerCase();

  const accountResults = useMemo(() => {
    if (!trimmed) return accounts.slice(0, 5);
    return accounts.filter((account) => {
      const policyNumbers = account.policies.map((policy) => policy.number).join(' ');
      return `${account.household} ${account.primaryContact} ${account.email} ${account.phone} ${policyNumbers}`.toLowerCase().includes(trimmed);
    });
  }, [accounts, trimmed]);

  const leadResults = useMemo(() => {
    if (!trimmed) return [];
    return leads.filter((lead) => `${lead.name} ${lead.email} ${lead.phone} ${lead.product}`.toLowerCase().includes(trimmed));
  }, [leads, trimmed]);

  const noMatches = trimmed && accountResults.length === 0 && leadResults.length === 0;

  const submitSuspicious = () => {
    if (!suspicious.summary.trim()) {
      onToast('Add a short summary before submitting.');
      return;
    }
    setSuspiciousOpen(false);
    setSuspicious({ type: 'Potential phishing email', summary: '' });
    onToast('Suspicious activity report logged for training review.');
  };

  return (
    <>
      <footer className="bottom-utility">
        <button onClick={() => { setQuery(''); setLookupOpen(true); }}>⌕ <span>Account<br />Lookup</span></button>
        <button onClick={() => setSuspiciousOpen(true)}>♟ <span>Report Suspicious<br />Activity</span></button>
        <button onClick={() => setQuickOpen(true)}>🔗 <span>Quick<br />Links</span></button>
        <button onClick={() => onNavigate('training')}>⚡ <span>Training<br />Center</span></button>
        <button onClick={() => setPrivacyOpen(true)}>🔒 <span>Privacy<br />Notice</span></button>
        <p>Simulator only — use fictional training data. Never enter real client information.</p>
      </footer>

      {lookupOpen && (
        <Modal title="Account Lookup" onClose={() => setLookupOpen(false)} size="large">
          <div className="lookup-layout">
            <div>
              <label className="field-label">Search by customer name, phone, email, or policy number</label>
              <input className="search-input large" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: Kim, PA-100245, (555) 771-3040, bakery..." autoFocus />
              <div className="helper-text">This lookup searches local simulator accounts and lead records only.</div>
            </div>
            <div className="lookup-results">
              {noMatches && (
                <div className="empty-state compact">
                  No matches for “{query.trim()}”. Try a partial name or a policy number like PA-100245.
                </div>
              )}
              {accountResults.length > 0 && <h3>Accounts</h3>}
              {accountResults.map((account) => (
                <button className="result-card" key={account.id} onClick={() => { onOpenAccount(account.id); setLookupOpen(false); }}>
                  <strong>{account.household}</strong>
                  <span>{account.primaryContact} · {account.email}</span>
                  <small>{account.policies.length ? account.policies.map((policy) => policy.number).join(' · ') : 'No policies yet'} · {account.status}</small>
                </button>
              ))}
              {leadResults.length > 0 && <h3>Lead Matches</h3>}
              {leadResults.map((lead) => (
                <button className="result-card" key={lead.id} onClick={() => { onOpenLead(lead.id); setLookupOpen(false); }}>
                  <strong>{lead.name}</strong>
                  <span>{lead.product} · {lead.status}</span>
                  <small>{lead.email}</small>
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {suspiciousOpen && (
        <Modal title="Report Suspicious Activity" onClose={() => setSuspiciousOpen(false)}>
          <div className="form-stack">
            <label className="field-label">Activity Type</label>
            <select className="input" value={suspicious.type} onChange={(event) => setSuspicious({ ...suspicious, type: event.target.value })}>
              <option>Potential phishing email</option>
              <option>Unusual login behavior</option>
              <option>Incorrect customer data access</option>
              <option>Suspected fraud on an account</option>
              <option>Other</option>
            </select>
            <label className="field-label">Summary</label>
            <textarea className="input" rows="5" value={suspicious.summary} onChange={(event) => setSuspicious({ ...suspicious, summary: event.target.value })} placeholder="Describe what happened. Do not enter real sensitive data." />
            <button className="primary-button" onClick={submitSuspicious}>Submit Training Report</button>
          </div>
        </Modal>
      )}

      {quickOpen && (
        <Modal title="Quick Links" onClose={() => setQuickOpen(false)}>
          <div className="quick-link-grid">
            {[
              ['accounts', 'Accounts'], ['leads', 'Leads'], ['lead-depot', 'Lead Depot'],
              ['tasks:today', 'Tasks Due Today'], ['alerts-hub', 'Alerts Hub'], ['reports-hub', 'Reports Hub'],
              ['analytics', 'APEX Analytics'], ['direct-mail', 'Direct Mail'], ['training', 'Training Center']
            ].map(([page, label]) => (
              <button key={page} onClick={() => { onNavigate(page); setQuickOpen(false); }}>{label}</button>
            ))}
          </div>
        </Modal>
      )}

      {privacyOpen && (
        <Modal title="Privacy Notice — Training Simulator" onClose={() => setPrivacyOpen(false)}>
          <div className="privacy-copy">
            <p><strong>This is a training simulator.</strong> It is not connected to any insurance carrier, agency management system, or customer database.</p>
            <p>All names, businesses, policies, claims, and contact details shown here are fictional sample data created for navigation practice. Records you create are stored only in this browser (localStorage) and never leave your device.</p>
            <p>Do not enter real customer information, real policy numbers, health information, payment card data, or any other personal data into this tool.</p>
            <p>Reminder for non-licensed staff: do not give coverage advice, bind coverage, quote without approval, or interpret policy coverage — in this simulator or in real systems.</p>
          </div>
        </Modal>
      )}
    </>
  );
}
