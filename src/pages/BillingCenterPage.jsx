import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ComplianceBanner } from '../components/ComplianceGuard.jsx';
import { todayISO } from '../utils/dates.js';

function money(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

export default function BillingCenterPage({ accounts, onUpdateAccount, onCreateTask, onNavigate, onToast }) {
  const [selectedId, setSelectedId] = useState(accounts[0]?.id || '');
  const [note, setNote] = useState('');
  const selected = useMemo(() => accounts.find((account) => account.id === selectedId) || accounts[0], [accounts, selectedId]);

  const addBillingNote = () => {
    if (!selected || !note.trim()) return;
    onUpdateAccount(selected.id, {
      activity: [{ date: todayISO(), author: 'Trainee', text: `Billing note: ${note.trim()}` }, ...(selected.activity || [])]
    });
    setNote('');
    onToast?.('Billing note saved to account activity.');
  };

  const createPaymentTask = () => {
    if (!selected) return;
    onCreateTask?.({
      title: `Billing follow-up — ${selected.household}`,
      relatedTo: selected.household,
      relatedType: 'Account',
      priority: selected.billing?.status === 'Payment Due' ? 'High' : 'Medium',
      dueDate: todayISO(),
      notes: `Billing account ${selected.billing?.accountNumber}. Balance ${money(selected.billing?.balance)} due ${selected.billing?.nextDueDate}.`
    });
  };

  if (!selected) {
    return <main className="workspace page-bg"><div className="empty-state">No billing accounts available.</div></main>;
  }

  return (
    <main className="workspace page-bg portal-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Billing</p>
          <h1>Billing Center <InfoTip text="Billing is separated from policy servicing. VA can read status and payment history but cannot waive fees, promise reinstatement, or change payment terms." /></h1>
          <span>View billing accounts, payment history, open balances, and policy links for dummy customer records.</span>
        </div>
        <div className="header-actions">
          <button className="outline-button" onClick={() => onNavigate('customer-info')}>Customer Info</button>
          <button className="primary-button" onClick={createPaymentTask}>Create Payment Reminder</button>
        </div>
      </div>

      <ComplianceBanner compact />

      <div className="billing-layout">
        <Panel title="Billing Accounts" className="billing-rail">
          <div className="portal-account-list">
            {accounts.map((account) => (
              <button key={account.id} className={`portal-account-card ${selected.id === account.id ? 'active' : ''}`} onClick={() => setSelectedId(account.id)}>
                <span>{account.type}</span>
                <strong>{account.billing?.accountNumber || account.household}</strong>
                <small>{account.household}</small>
                <em>{account.billing?.status} · {money(account.billing?.balance)}</em>
              </button>
            ))}
          </div>
        </Panel>

        <section className="billing-record-area">
          <Panel title="Billing Summary" icon="💳">
            <div className="portal-blue-strip billing-strip">
              <div><span>Billing Account Number</span><strong>{selected.billing?.accountNumber}</strong></div>
              <div><span>Account Status</span><strong>{selected.billing?.status}</strong></div>
              <div><span>Current Balance</span><strong className={selected.billing?.balance > 0 ? 'danger-text' : ''}>{money(selected.billing?.balance)}</strong></div>
              <div><span>Next Due</span><strong>{selected.billing?.nextDueDate}</strong></div>
            </div>

            <div className="portal-two-col">
              <div className="detail-list compact-list">
                <div><span>Customer</span><strong>{selected.household}</strong></div>
                <div><span>Payor</span><strong>{selected.billing?.payor || selected.primaryContact}</strong></div>
                <div><span>Billing Method</span><strong>{selected.billing?.method}</strong></div>
                <div><span>Bill Plan</span><strong>{selected.billing?.billPlan}</strong></div>
                <div><span>Mailing Address</span><strong>{selected.billing?.mailingAddress || selected.address}</strong></div>
                <div><span>Next Amount Due</span><strong>{money(selected.billing?.nextDueAmount)}</strong></div>
              </div>
              <div className="portal-mini-panel">
                <h3>Billing guardrails</h3>
                <ul>
                  <li>Read only what appears on the billing screen.</li>
                  <li>Create a follow-up or payment reminder task.</li>
                  <li>Do not waive fees, change due dates, or promise coverage status.</li>
                  <li>Escalate reinstatement, cancellation, and payment arrangement questions.</li>
                </ul>
              </div>
            </div>
          </Panel>

          <Panel title="Open Policies on Billing Account" icon="📘">
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Policy #</th><th>Line</th><th>Status</th><th>Term</th><th>Premium</th></tr></thead>
                <tbody>
                  {selected.policies.map((policy) => (
                    <tr key={policy.number}><td><button className="table-text-link" onClick={() => onNavigate(selected.type === 'Commercial Lines' ? 'commercial-lines' : 'personal-lines')}>{policy.number}</button></td><td>{policy.line}</td><td>{policy.status}</td><td>{policy.effective} - {policy.expiration}</td><td>{money(policy.premium)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Payment / Installment History" icon="🧾">
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Date</th><th>Transaction Type</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {(selected.billing?.paymentHistory || []).map((row) => <tr key={`${row.date}-${row.type}`}><td>{row.date}</td><td>{row.type}</td><td>{money(row.amount)}</td><td>{row.status}</td></tr>)}
                </tbody>
              </table>
            </div>
            <div className="billing-note-box">
              <textarea className="input" rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a billing note. Do not promise reinstatement, fee waivers, or coverage status." />
              <button className="primary-button" disabled={!note.trim()} onClick={addBillingNote}>Save Billing Note</button>
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}
