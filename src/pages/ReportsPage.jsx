import { useMemo, useState } from 'react';
import { EmptyLightningGraphic } from '../components/SalesforceMock.jsx';

const sideGroups = [
  { title: 'REPORTS', items: ['Recent', 'Created by Me', 'Private Reports', 'Public Reports', 'All Reports'] },
  { title: 'FOLDERS', items: ['All Folders', 'Created by Me', 'Shared with Me'] },
  { title: 'FAVORITES', items: ['All Favorites'] }
];

export default function ReportsPage({ reportId = '', leads, accounts, tasks, onNavigate, onToast }) {
  const [active, setActive] = useState('Recent');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    if (!reportId) return [];
    const leadRows = leads.slice(0, 4).map((lead) => ({ name: lead.name, type: 'Lead', owner: lead.owner, status: lead.status }));
    const accountRows = accounts.slice(0, 4).map((account) => ({ name: account.household, type: 'Account', owner: account.accountManager || 'Training Team', status: account.status }));
    const taskRows = tasks.slice(0, 4).map((task) => ({ name: task.title, type: 'Task', owner: task.owner, status: task.status }));
    return [...leadRows, ...accountRows, ...taskRows];
  }, [reportId, leads, accounts, tasks]);

  if (reportId && rows.length > 0) {
    return (
      <main className="sf-reports-page">
        <aside className="sf-reports-sidebar">
          {sideGroups.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              {group.items.map((item) => <button key={item} className={active === item ? 'active' : ''} onClick={() => setActive(item)}>{item}</button>)}
            </div>
          ))}
        </aside>
        <section className="sf-report-content">
          <header className="sf-report-topbar">
            <div>
              <span>Reports</span>
              <h1>{reportId.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ')}</h1>
              <p>{rows.length} records • Training report preview</p>
            </div>
            <label className="sf-report-search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search report results..." /></label>
            <button onClick={() => { onToast?.('New Report opened in simulator mode.'); onNavigate('reports'); }}>New Report</button>
            <button>⚙⌄</button>
          </header>
          <div className="sf-table-wrap sf-report-table-preview">
            <table className="sf-data-table">
              <thead><tr><th>Name</th><th>Type</th><th>Owner</th><th>Status</th></tr></thead>
              <tbody>{rows.filter((r) => !search || `${r.name} ${r.type} ${r.owner} ${r.status}`.toLowerCase().includes(search.toLowerCase())).map((row) => <tr key={`${row.type}-${row.name}`}><td>{row.name}</td><td>{row.type}</td><td>{row.owner}</td><td>{row.status}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="sf-reports-page">
      <aside className="sf-reports-sidebar">
        {sideGroups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            {group.items.map((item) => <button key={item} className={active === item ? 'active' : ''} onClick={() => setActive(item)}>{item}</button>)}
          </div>
        ))}
      </aside>
      <section className="sf-report-content">
        <header className="sf-report-topbar">
          <div>
            <span>Reports</span>
            <h1>{active}</h1>
            <p>0 items</p>
          </div>
          <label className="sf-report-search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recent reports..." /></label>
          <button onClick={() => onNavigate('reports-hub')}>New Report</button>
          <button>⚙⌄</button>
        </header>

        <div className="sf-reports-empty-panel">
          <EmptyLightningGraphic variant="desert" />
          <h2>Recent reports appear here</h2>
          <p>Go to All Reports to see what's available.</p>
          <button onClick={() => onNavigate('reports-hub')}>View All Reports</button>
        </div>
      </section>
    </main>
  );
}
