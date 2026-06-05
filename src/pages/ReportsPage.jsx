import { useMemo } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { reportCatalog } from '../data/reports.js';
import { LEAD_STATUSES } from '../data/leads.js';
import { exportToCsv } from '../utils/csv.js';
import { daysUntil, isDueToday, isOverdue, todayISO } from '../utils/dates.js';

function Bar({ label, value, max, suffix = '' }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="bar-row">
      <div><span>{label}</span><strong>{value.toLocaleString()}{suffix}</strong></div>
      <div className="bar-track"><i style={{ width: `${Math.min(percent, 100)}%` }} /></div>
    </div>
  );
}

function ReportTable({ headers, rows }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={headers.length}><span className="metric-caption">No records for this report yet.</span></td></tr>
            : rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

export default function ReportsPage({ reportId = '', leads, accounts, tasks, onNavigate, onToast }) {
  const allPolicies = useMemo(
    () => accounts.flatMap((a) => a.policies.map((p) => ({ ...p, household: a.household, accountStatus: a.status }))),
    [accounts]
  );
  const allClaims = useMemo(
    () => accounts.flatMap((a) => a.claims.map((c) => ({ ...c, household: a.household }))),
    [accounts]
  );

  const report = reportCatalog.find((r) => r.id === reportId);

  // No specific report selected: show the catalog list.
  if (!report) {
    return (
      <main className="workspace page-bg">
        <div className="page-header">
          <div>
            <p className="eyebrow">Reports</p>
            <h1>Agency Practice Reports</h1>
            <span>Pick a report. Each one computes live from the simulator data.</span>
          </div>
        </div>
        <Panel title="Report Catalog" icon="📊">
          <div className="card-grid two">
            {reportCatalog.map((r) => (
              <button className="report-card" key={r.id} onClick={() => onNavigate(`report:${r.id}`)}>
                <span>{r.category}</span><h3>{r.title}</h3><p>{r.description}</p><em>Open report →</em>
              </button>
            ))}
          </div>
        </Panel>
      </main>
    );
  }

  // ---- build the body of the selected report ----
  let headers = [];
  let rows = [];
  let chart = null;
  let summary = null;

  if (reportId === 'lead-conversion') {
    const byStatus = LEAD_STATUSES.map((status) => ({ status, count: leads.filter((l) => l.status === status).length }));
    const max = Math.max(...byStatus.map((b) => b.count), 1);
    const converted = byStatus.find((b) => b.status === 'Converted')?.count || 0;
    const lost = byStatus.find((b) => b.status === 'Lost')?.count || 0;
    const closed = converted + lost;
    chart = <>{byStatus.map((b) => <Bar key={b.status} label={b.status} value={b.count} max={max} />)}</>;
    summary = `Conversion rate among closed leads: ${closed ? Math.round((converted / closed) * 100) : 0}% (${converted} converted, ${lost} lost, ${leads.length} total leads).`;
    headers = ['Status', 'Leads', '% of Pipeline'];
    rows = byStatus.map((b) => [b.status, b.count, `${leads.length ? Math.round((b.count / leads.length) * 100) : 0}%`]);
  }

  if (reportId === 'quote-pipeline') {
    const open = leads.filter((l) => !['Converted', 'Lost'].includes(l.status));
    headers = ['Lead', 'Line', 'Status', 'Owner', 'Est. Premium', 'Last Activity'];
    rows = open.map((l) => [l.name, l.product || l.interest, l.status, l.owner, `$${Number(l.premium || 0).toLocaleString()}`, l.lastActivity]);
    summary = `Open pipeline premium: $${open.reduce((s, l) => s + Number(l.premium || 0), 0).toLocaleString()} across ${open.length} open leads.`;
  }

  if (reportId === 'open-tasks') {
    const open = tasks.filter((t) => t.status !== 'Completed');
    headers = ['Task', 'Related To', 'Owner', 'Priority', 'Due Date', 'State'];
    rows = open.map((t) => [t.title, `${t.relatedTo} (${t.relatedType})`, t.owner, t.priority,
      t.dueDate, isOverdue(t.dueDate) ? 'Overdue' : isDueToday(t.dueDate) ? 'Due Today' : 'Scheduled']);
    summary = `${open.length} open tasks · ${open.filter((t) => isOverdue(t.dueDate)).length} overdue · ${open.filter((t) => isDueToday(t.dueDate)).length} due today.`;
  }

  if (reportId === 'renewal') {
    const upcoming = allPolicies
      .map((p) => ({ ...p, days: daysUntil(p.expiration) }))
      .filter((p) => typeof p.days === 'number' && p.days >= 0 && p.days <= 90)
      .sort((a, b) => a.days - b.days);
    headers = ['Account', 'Policy #', 'Line', 'Status', 'Expiration', 'Days Left', 'Premium'];
    rows = upcoming.map((p) => [p.household, p.number, p.line, p.status, p.expiration, p.days, `$${p.premium.toLocaleString()}`]);
    summary = `${upcoming.length} policies expire within 90 days of ${todayISO()}.`;
  }

  if (reportId === 'policy-summary') {
    const byLine = {};
    allPolicies.forEach((p) => {
      byLine[p.line] = byLine[p.line] || { count: 0, premium: 0 };
      byLine[p.line].count += 1;
      byLine[p.line].premium += p.premium;
    });
    const entries = Object.entries(byLine).sort((a, b) => b[1].premium - a[1].premium);
    const max = Math.max(...entries.map(([, v]) => v.premium), 1);
    chart = <>{entries.map(([line, v]) => <Bar key={line} label={line} value={v.premium} max={max} suffix="" />)}</>;
    headers = ['Account', 'Policy #', 'Line', 'Status', 'Effective', 'Expiration', 'Premium'];
    rows = allPolicies.map((p) => [p.household, p.number, p.line, p.status, p.effective, p.expiration, `$${p.premium.toLocaleString()}`]);
    summary = `Total written premium in simulator: $${allPolicies.reduce((s, p) => s + p.premium, 0).toLocaleString()} across ${allPolicies.length} policies.`;
  }

  if (reportId === 'claims-activity') {
    headers = ['Claim #', 'Account', 'Policy', 'Type', 'Date', 'Status', 'Description'];
    rows = allClaims.map((c) => [c.id, c.household, c.policy, c.type, c.date, c.status, c.description]);
    summary = `${allClaims.filter((c) => c.status === 'Open').length} open and ${allClaims.filter((c) => c.status !== 'Open').length} closed claims.`;
  }

  if (reportId === 'agency-activity') {
    const activity = accounts
      .flatMap((a) => (a.activity || []).map((entry) => ({ ...entry, household: a.household })))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 25);
    headers = ['Date', 'Account', 'Author', 'Activity'];
    rows = activity.map((e) => [e.date, e.household, e.author, e.text]);
    summary = `Most recent ${rows.length} activity entries across all accounts, plus ${tasks.filter((t) => t.status === 'Completed').length} completed tasks agency-wide.`;
  }

  if (reportId === 'cross-sell') {
    const monoline = accounts.filter((a) => a.status === 'Active' && a.policies.length === 1);
    headers = ['Account', 'Current Line', 'Premium', 'Account Manager', 'Suggested Next Step'];
    rows = monoline.map((a) => [a.household, a.policies[0].line, `$${a.policies[0].premium.toLocaleString()}`, a.accountManager, 'Create a task for licensed staff to review bundle options.']);
    summary = `${monoline.length} active accounts hold a single policy line.`;
  }

  const handleExport = () => {
    exportToCsv(`${report.id}-${todayISO()}.csv`, headers, rows);
    onToast('CSV export downloaded (simulated report extract).');
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Reports · {report.category}</p>
          <h1>{report.title} <InfoTip text={report.description} /></h1>
          <span>{report.description}</span>
        </div>
        <div className="button-row">
          <button className="outline-button" onClick={() => onNavigate('reports-hub')}>← Reports Hub</button>
          <button className="primary-button" onClick={handleExport}>Export CSV</button>
        </div>
      </div>

      {summary && <Panel title="Summary" icon="🧮"><p className="report-summary">{summary}</p></Panel>}
      {chart && <Panel title="Chart" icon="📈">{chart}</Panel>}
      <Panel title="Detail" icon="📋"><ReportTable headers={headers} rows={rows} /></Panel>
    </main>
  );
}
