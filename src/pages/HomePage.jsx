import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { agencyNews } from '../data/content.js';
import { formatLongDate, isDueToday, isOverdue } from '../utils/dates.js';

function CountPill({ value, label, tone = 'blue', onClick }) {
  return (
    <button className={`count-pill ${tone}`} onClick={onClick}>
      <span>{value}</span>
      <b>{label}</b>
    </button>
  );
}

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomePage({ user, leads, accounts, tasks, alerts, depotLeads, onNavigate, onNewLead, widgetLayout, stickyNote, onStickyNoteChange }) {
  const [newsTab, setNewsTab] = useState('Rates & Rules');
  const [taskTab, setTaskTab] = useState('High Priority');
  const [birthdayTab, setBirthdayTab] = useState('Active Customers');
  const visibleNews = agencyNews.filter((item) => item.type === newsTab);

  const stats = useMemo(() => {
    const quoted = leads.filter((lead) => lead.status === 'Quoted').length;
    const followUp = leads.filter((lead) => lead.status === 'Follow-Up').length;
    const retention = accounts.filter((account) => account.billing.status.includes('Past Due') || account.policies.some((policy) => policy.status.includes('Renewal'))).length;
    const crossSell = accounts.filter((account) => account.status === 'Active' && account.policies.length === 1).length;
    const winBack = accounts.filter((account) => account.status === 'Cancelled').length;
    return { quoted, followUp, retention, crossSell, winBack };
  }, [leads, accounts]);

  const alertCount = (category) => alerts.filter((alert) => alert.category === category && !alert.read).length;

  const dueTodayTasks = tasks.filter((task) => task.status !== 'Completed' && isDueToday(task.dueDate));
  const overdueTasks = tasks.filter((task) => task.status !== 'Completed' && isOverdue(task.dueDate));
  const visibleTasks = (taskTab === 'High Priority'
    ? tasks.filter((task) => task.status !== 'Completed' && task.priority === 'High')
    : taskTab === 'My Tasks'
      ? tasks.filter((task) => task.status !== 'Completed' && task.owner === user.name)
      : tasks.filter((task) => task.status !== 'Completed' && task.owner !== user.name)
  ).slice(0, 4);

  const birthdayPeople = (birthdayTab === 'Active Customers'
    ? accounts.filter((account) => account.status === 'Active')
    : accounts.filter((account) => account.status === 'Prospect' || account.status === 'Pending')
  ).flatMap((account) => account.members.slice(0, 1).map((member) => ({ id: `${account.id}-${member.name}`, accountId: account.id, name: member.name })));

  // Widget renderers keyed to the customizable layout.
  const widgets = {
    notes: (
      <div className="sticky-note" key="notes">
        <textarea
          value={stickyNote}
          onChange={(event) => onStickyNoteChange(event.target.value)}
          placeholder="No notes to display — click to add a personal note..."
          aria-label="Personal notes"
        />
      </div>
    ),
    birthdays: (
      <Panel key="birthdays" title="Upcoming Birthdays" icon="🎂" action={<InfoTip text="In a real CRM this card surfaces customer birthdays so the agency can send cards or make a quick call. Click a name to open the account." />}>
        <div className="tabs-row">
          {['Active Customers', 'Prospects'].map((tab) => (
            <button key={tab} className={`tab ${birthdayTab === tab ? 'active' : ''}`} onClick={() => setBirthdayTab(tab)}>{tab}</button>
          ))}
        </div>
        {birthdayPeople.length === 0 && <div className="empty-state compact">No upcoming birthdays in this view.</div>}
        {birthdayPeople.map((person) => (
          <div className="mini-list-row" key={person.id}>
            <button className="table-link" onClick={() => onNavigate('accounts')}>{person.name}</button>
            <span>{formatLongDate().split(',').slice(1).join(',').trim()}</span>
          </div>
        ))}
        <button className="link-button wide" onClick={() => onNavigate('accounts')}>View All Customer Birthdays</button>
      </Panel>
    ),
    reports: (
      <Panel key="reports" title="Reports Hub" icon="📊" action={<InfoTip text="Shortcut into Lists, Reports, and Analytics. Use the search to find a saved report quickly." />}>
        <div className="search-line">
          <input placeholder="Search Lists, Reports, and Analytics..." onKeyDown={(event) => { if (event.key === 'Enter') onNavigate('reports-hub'); }} />
          <button onClick={() => onNavigate('reports-hub')} title="Open Reports Hub">→</button>
        </div>
        <div className="report-shortcuts">
          <button onClick={() => onNavigate('report:quote-pipeline')}>Quote Pipeline</button>
          <button onClick={() => onNavigate('report:renewal')}>Renewals</button>
          <button onClick={() => onNavigate('analytics')}>Analytics</button>
        </div>
      </Panel>
    ),
    serviceAlerts: (
      <Panel key="serviceAlerts" title="Service Alerts & Notifications" icon="📣" action={<InfoTip text="Unread alert counts by category. Clicking a pill opens that alert queue. A VA reads, documents, and routes — licensed questions get escalated." />}>
        <div className="metric-grid alerts-grid">
          <CountPill value={alertCount('Critical')} label="Critical" tone="red" onClick={() => onNavigate('alerts:Critical')} />
          <CountPill value={alertCount('Renewal')} label="Renewal" onClick={() => onNavigate('alerts:Renewal')} />
          <CountPill value={alertCount('Claims')} label="Claims" onClick={() => onNavigate('alerts:Claims')} />
          <CountPill value={alertCount('Pending')} label="Pending" onClick={() => onNavigate('alerts:Pending')} />
          <CountPill value={alertCount('Policy')} label="Policy Notifications" onClick={() => onNavigate('alerts:Policy')} />
          <CountPill value={alertCount('Manual Brokered')} label="Manual Brokered" onClick={() => onNavigate('alerts:Manual Brokered')} />
          <CountPill value={alertCount('Undelivered Email')} label="Undelivered Email" onClick={() => onNavigate('alerts:Undelivered Email')} />
        </div>
        <button className="link-button wide" onClick={() => onNavigate('alerts-hub')}>View All Alerts</button>
      </Panel>
    ),
    recommendations: (
      <Panel key="recommendations" title="Recommendation Engine" icon="👑" action={<InfoTip text="Suggested follow-up queues computed from live simulator data: win-back candidates, cross-sell accounts, retention risks, and quotes that never closed." />}>
        <div className="metric-grid two-col">
          <CountPill value={stats.winBack} label="Win Back" onClick={() => onNavigate('direct-mail')} />
          <CountPill value={stats.crossSell} label="Cross-Sell" onClick={() => onNavigate('report:cross-sell')} />
          <CountPill value={stats.retention} label="Retention" onClick={() => onNavigate('report:renewal')} />
          <CountPill value={stats.quoted + stats.followUp} label="Quotes Not Closed" onClick={() => onNavigate('leads')} />
        </div>
      </Panel>
    ),
    marketing: (
      <Panel key="marketing" title="Sales & Marketing Notifications" icon="📢" action={<InfoTip text="Marketing-driven opportunity counts. The Lead Depot pill shows unclaimed leads waiting for an owner." />}>
        <div className="metric-grid two-col">
          <CountPill value={depotLeads.length} label="Lead Depot Unclaimed" onClick={() => onNavigate('lead-depot')} />
          <CountPill value={leads.filter((lead) => lead.source === 'Website' && lead.status === 'New').length} label="New Web Leads" onClick={() => onNavigate('leads')} />
          <CountPill value={depotLeads.filter((lead) => lead.priority === 'High').length} label="High Value Opportunities" onClick={() => onNavigate('lead-depot')} />
          <CountPill value={leads.filter((lead) => lead.source === 'Direct Mail').length} label="Direct Mail Responses" onClick={() => onNavigate('direct-mail')} />
        </div>
      </Panel>
    ),
    tasks: (
      <Panel key="tasks" title={`Tasks - Due Today (${dueTodayTasks.length})`} icon="✅" action={<button className="outline-button" onClick={() => onNavigate('tasks:today')}>View All Tasks</button>}>
        <div className="tabs-row">
          {['High Priority', 'My Tasks', 'Agency Tasks'].map((tab) => (
            <button key={tab} className={`tab ${taskTab === tab ? 'active' : ''}`} onClick={() => setTaskTab(tab)}>{tab}</button>
          ))}
        </div>
        {overdueTasks.length > 0 && (
          <button className="overdue-banner" onClick={() => onNavigate('tasks:overdue')}>⚠ {overdueTasks.length} overdue task{overdueTasks.length === 1 ? '' : 's'} need attention</button>
        )}
        {visibleTasks.length === 0 && <div className="empty-state compact">No tasks in this view. Nice work!</div>}
        {visibleTasks.map((task) => (
          <div className="task-row" key={task.id}>
            <div><strong>{task.title}</strong><span>{task.relatedTo} · {task.owner} · Due {task.dueDate}</span></div>
            <em className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</em>
          </div>
        ))}
      </Panel>
    ),
    news: (
      <Panel key="news" title="Agency News & Resources (ANR)" icon="📰" action={<InfoTip text="Simulated carrier and agency bulletins. In a live CRM these link to rate changes, underwriting updates, and product resources." />}>
        <div className="tabs-row three-tabs">
          {['Agency News', 'Rates & Rules', 'Product Resources'].map((tab) => (
            <button key={tab} className={`tab ${newsTab === tab ? 'active' : ''}`} onClick={() => setNewsTab(tab)}>{tab}</button>
          ))}
        </div>
        {visibleNews.map((item) => (
          <button className="news-row" key={item.id} onClick={() => onNavigate('reports-hub')}>
            <span>{item.date}</span>
            <strong>{item.title}</strong>
            <em>{item.minutes} min read</em>
          </button>
        ))}
      </Panel>
    ),
    whatsNew: (
      <Panel key="whatsNew" title="New to APEX" icon="🧭" action={<InfoTip text="Help resources for new users. Start with the Training Center walkthrough." />}>
        <article className="resource-card">
          <h3>New here? Start with the Training Center.</h3>
          <p>Guided scenarios walk through prospect intake, quote follow-up, renewals, payment reminders, claims routing, and escalation — with a short knowledge check at the end.</p>
          <button className="link-button" onClick={() => onNavigate('training')}>👉 Open the Training Center</button>
        </article>
        <article className="resource-card border-top">
          <h3 className="blue-link" onClick={() => onNavigate('custom-home')} role="button">The Customizable APEX Home Page You&rsquo;ve Been Asking For!</h3>
          <p>Toggle and reorder every card on this dashboard from the Custom Home Page.</p>
        </article>
        <article className="resource-card border-top">
          <h3>Compliance corner</h3>
          <p>Non-licensed VAs must not give coverage advice, bind coverage, quote without approval, or interpret policy coverage. When in doubt, create a task for licensed staff.</p>
        </article>
      </Panel>
    )
  };

  // Distribute the ordered, visible widgets across the three dashboard columns.
  const visibleWidgets = widgetLayout.filter((widget) => widget.visible && widgets[widget.key]);
  const columns = [[], [], []];
  visibleWidgets.forEach((widget, index) => columns[index % 3].push(widgets[widget.key]));

  return (
    <main className="workspace apex-background">
      <div className="dashboard-grid">
        <div className="column left-column">
          <Panel className="greeting-panel">
            <div className="date-text">{formatLongDate()}</div>
            <h1>{greetingForNow()}, {user.name}</h1>
            <button className="quote-button" onClick={onNewLead}>Quote New Account</button>
          </Panel>
          {columns[0]}
        </div>
        <div className="column middle-column">{columns[1]}</div>
        <div className="column right-column">{columns[2]}</div>
      </div>
    </main>
  );
}
