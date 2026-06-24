import { useMemo, useState } from 'react';
import { SfButton, SfEmptyState, SfListHeader, SfListToolbar } from '../components/SalesforceMock.jsx';

export default function AccountsPage({ accounts, onSelectAccount, onNewAccount }) {
  const [search, setSearch] = useState('');
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return accounts;
    return accounts.filter((account) => `${account.household} ${account.primaryContact} ${account.email} ${account.phone}`.toLowerCase().includes(term));
  }, [accounts, search]);

  return (
    <main className="sf-page sf-page-white">
      <SfListHeader objectName="Accounts" icon="▦" iconTone="blue" itemCount={visible.length}>
        <SfButton onClick={onNewAccount}>New</SfButton>
        <SfButton>Bulk Actions</SfButton>
        <SfButton>Quick Send Email</SfButton>
        <SfButton>Share</SfButton>
        <SfButton>Delete Shared List View</SfButton>
      </SfListHeader>

      <SfListToolbar search={search} onSearch={setSearch} />

      {visible.length === 0 ? (
        <SfEmptyState title="Nothing to see here" text="There's nothing in your list yet. Try adding a new record." />
      ) : (
        <div className="sf-table-wrap">
          <table className="sf-data-table">
            <thead>
              <tr>
                <th><input type="checkbox" aria-label="Select all accounts" /></th>
                <th>Account Name</th>
                <th>Primary Contact</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Type</th>
                <th>Billing</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((account) => (
                <tr key={account.id}>
                  <td><input type="checkbox" aria-label={`Select ${account.household}`} /></td>
                  <td><button className="sf-table-link" onClick={() => onSelectAccount(account.id)}>{account.household}</button></td>
                  <td>{account.primaryContact}</td>
                  <td>{account.phone || '—'}</td>
                  <td>{account.email || '—'}</td>
                  <td>{account.status}</td>
                  <td>{account.type || 'Personal Lines'}</td>
                  <td>{account.billing?.status || '—'}</td>
                  <td><button className="sf-row-menu">▾</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
