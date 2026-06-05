import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ACCOUNT_STATUSES } from '../data/accounts.js';

const statusFilters = ['All', ...ACCOUNT_STATUSES];

export default function AccountsPage({ accounts, onSelectAccount, onNewAccount }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const visible = useMemo(() => {
    const value = search.trim().toLowerCase();
    return accounts.filter((account) => {
      if (status !== 'All' && account.status !== status) return false;
      const text = `${account.household} ${account.primaryContact} ${account.email} ${account.phone} ${account.policies.map((policy) => policy.number).join(' ')}`.toLowerCase();
      return !value || text.includes(value);
    });
  }, [accounts, search, status]);

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Customer Database</p>
          <h1>Accounts <InfoTip text="Each card is a household or business. Open one to see the full customer profile: household members, policies, billing, claims, documents, notes, and related tasks." /></h1>
          <span>Search by name, email, phone, or policy number.</span>
        </div>
        <button className="primary-button" onClick={onNewAccount}>+ New Account</button>
      </div>
      <Panel>
        <div className="toolbar">
          <input className="search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search account, contact, email, phone, or policy number..." />
        </div>
        <div className="segmented-control left">
          {statusFilters.map((item) => (
            <button key={item} className={status === item ? 'active' : ''} onClick={() => setStatus(item)}>
              {item}{item !== 'All' && ` (${accounts.filter((account) => account.status === item).length})`}
            </button>
          ))}
        </div>
        <div className="account-grid">
          {visible.length === 0 && <div className="empty-state">No accounts match. Try a partial name or a policy number like PA-100245.</div>}
          {visible.map((account) => (
            <button className="account-card" key={account.id} onClick={() => onSelectAccount(account.id)}>
              <div><h3>{account.household}</h3><p>{account.primaryContact}</p></div>
              <span className={`status-chip account-${account.status.toLowerCase()}`}>{account.status}</span>
              <small>{account.email} · {account.phone}</small>
              <div className="policy-strip">
                {account.policies.length === 0 && <b>No policies yet</b>}
                {account.policies.map((policy) => <b key={policy.number}>{policy.line}: {policy.number}</b>)}
              </div>
              <em>Billing: {account.billing.status}</em>
            </button>
          ))}
        </div>
      </Panel>
    </main>
  );
}
