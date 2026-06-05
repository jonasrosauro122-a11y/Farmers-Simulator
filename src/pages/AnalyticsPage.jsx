import { useMemo } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { LEAD_STATUSES } from '../data/leads.js';
import { daysUntil } from '../utils/dates.js';

function Bar({ label, value, max, money = false }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="bar-row">
      <div><span>{label}</span><strong>{money ? `$${value.toLocaleString()}` : value.toLocaleString()}</strong></div>
      <div className="bar-track"><i style={{ width: `${Math.min(percent, 100)}%` }} /></div>
    </div>
  );
}

export default function AnalyticsPage({ leads, accounts, tasks, claimedHistory = [] }) {
  const policies = useMemo(() => accounts.flatMap((a) => a.policies.map((p) => ({ ...p, household: a.household }))), [accounts]);

  // KPI numbers
  const openQuotes = leads.filter((l) => l.status === 'Quoted').length;
  const converted = leads.filter((l) => l.status === 'Converted').length;
  const lost = leads.filter((l) => l.status === 'Lost').length;
  const conversionRate = converted + lost ? Math.round((converted / (converted + lost)) * 100) : 0;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const taskRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const totalPremium = policies.reduce((s, p) => s + p.premium, 0);
  const renewals90 = policies.filter((p) => { const d = daysUntil(p.expiration); return typeof d === 'number' && d >= 0 && d <= 90; });

  // Charts
  const funnel = LEAD_STATUSES.map((status) => ({ status, count: leads.filter((l) => l.status === status).length }));
  const funnelMax = Math.max(...funnel.map((f) => f.count), 1);

  const byLine = {};
  policies.forEach((p) => { byLine[p.line] = (byLine[p.line] || 0) + 1; });
  const lineEntries = Object.entries(byLine).sort((a, b) => b[1] - a[1]);
  const lineMax = Math.max(...lineEntries.map(([, v]) => v), 1);

  const renewalBuckets = [
    { label: '0–30 days', count: renewals90.filter((p) => daysUntil(p.expiration) <= 30).length },
    { label: '31–60 days', count: renewals90.filter((p) => { const d = daysUntil(p.expiration); return d > 30 && d <= 60; }).length },
    { label: '61–90 days', count: renewals90.filter((p) => { const d = daysUntil(p.expiration); return d > 60; }).length }
  ];
  const renewalMax = Math.max(...renewalBuckets.map((b) => b.count), 1);

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">APEX Analytics</p>
          <h1>Performance Analytics <InfoTip text="Every metric here is computed live from your simulator data — claim leads, convert them, and complete tasks to watch the numbers move." /></h1>
          <span>Visual summary of pipeline, service work, and book of business.</span>
        </div>
      </div>

      <div className="card-grid four">
        <Panel title="Lead Conversion" icon="🎯">
          <strong className="big-number">{conversionRate}%</strong>
          <span className="metric-caption">{converted} converted · {lost} lost · {leads.length} total leads</span>
        </Panel>
        <Panel title="Open Quotes" icon="📝">
          <strong className="big-number">{openQuotes}</strong>
          <span className="metric-caption">leads in Quoted status awaiting decision</span>
        </Panel>
        <Panel title="Task Completion" icon="✅">
          <strong className="big-number">{taskRate}%</strong>
          <span className="metric-caption">{completedTasks} of {tasks.length} tasks completed</span>
        </Panel>
        <Panel title="Written Premium" icon="💵">
          <strong className="big-number">${totalPremium.toLocaleString()}</strong>
          <span className="metric-caption">{policies.length} policies · {claimedHistory.length} depot leads claimed</span>
        </Panel>
      </div>

      <Panel title="Lead Conversion Funnel" icon="📊">
        {funnel.map((f) => <Bar key={f.status} label={f.status} value={f.count} max={funnelMax} />)}
      </Panel>

      <div className="detail-grid">
        <Panel title="Policies by Line of Business" icon="📑">
          {lineEntries.map(([line, count]) => <Bar key={line} label={line} value={count} max={lineMax} />)}
        </Panel>
        <Panel title="Renewal Pipeline (next 90 days)" icon="🔄">
          {renewalBuckets.map((b) => <Bar key={b.label} label={b.label} value={b.count} max={renewalMax} />)}
          <p className="metric-caption">{renewals90.length} policies total. Open the Renewal Report for the full list.</p>
        </Panel>
      </div>

      <Panel title="Service Workflow Insights" icon="💡">
        <div className="guidance-grid three-cols">
          <div><h3>Quote follow-up</h3><p>High-priority quoted leads should get a same-day task and a clear owner.</p></div>
          <div><h3>Retention</h3><p>Policies inside the 0–30 day renewal bucket need contact before expiration.</p></div>
          <div><h3>Compliance</h3><p>Anything requiring coverage interpretation gets a task routed to licensed staff.</p></div>
        </div>
      </Panel>
    </main>
  );
}
