import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { reportCatalog } from '../data/reports.js';

export default function ReportsHubPage({ recentReports = [], onNavigate }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return reportCatalog;
    return reportCatalog.filter((r) => `${r.title} ${r.description} ${r.category}`.toLowerCase().includes(term));
  }, [search]);

  const categories = useMemo(() => [...new Set(filtered.map((r) => r.category))], [filtered]);
  const recent = recentReports.map((id) => reportCatalog.find((r) => r.id === id)).filter(Boolean);

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Reports Hub</p>
          <h1>Lists, Reports, and Analytics <InfoTip text="Search the report catalog and open any report. Reports compute live from your simulator data, so changes you make to leads, accounts, and tasks show up here." /></h1>
          <span>Open report templates and practice reading agency performance data.</span>
        </div>
        <button className="outline-button" onClick={() => onNavigate('analytics')}>Open APEX Analytics</button>
      </div>

      <Panel>
        <div className="search-line large">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Lists, Reports, and Analytics..." />
        </div>
      </Panel>

      {recent.length > 0 && (
        <Panel title="Recently Viewed" icon="🕘">
          <div className="card-grid two">
            {recent.map((report) => (
              <button className="report-card" key={`recent-${report.id}`} onClick={() => onNavigate(`report:${report.id}`)}>
                <span>{report.category}</span>
                <h3>{report.title}</h3>
                <p>{report.description}</p>
                <em>Open report →</em>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {categories.map((category) => (
        <Panel title={category} icon="📊" key={category}>
          <div className="card-grid two">
            {filtered.filter((r) => r.category === category).map((report) => (
              <button className="report-card" key={report.id} onClick={() => onNavigate(`report:${report.id}`)}>
                <span>{report.category}</span>
                <h3>{report.title}</h3>
                <p>{report.description}</p>
                <em>Open report →</em>
              </button>
            ))}
          </div>
        </Panel>
      ))}

      {filtered.length === 0 && (
        <Panel><div className="empty-state compact">No reports match “{search}”. Clear the search to see the full catalog.</div></Panel>
      )}
    </main>
  );
}
