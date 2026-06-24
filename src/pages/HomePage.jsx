import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import Modal from '../components/Modal.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { agencyNews } from '../data/content.js';
import { helpfulLinkSections } from '../data/helpfulLinks.js';
import { formatLongDate, isDueToday, isOverdue } from '../utils/dates.js';

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function MiniMetric({ value, label, tone = 'blue', onClick }) {
  return (
    <button className={`farmers-mini-metric ${tone}`} onClick={onClick}>
      <span>{value}</span>
      <b>{label}</b>
    </button>
  );
}

function NewsRows({ items, onOpen }) {
  return (
    <div className="farmers-news-list">
      {items.map((item) => (
        <button className="farmers-news-row" key={item.id} onClick={() => onOpen(item)}>
          <span>{item.date}</span>
          <strong>{item.title}</strong>
          <em>{item.minutes} min read</em>
        </button>
      ))}
    </div>
  );
}

function HelpfulLinks({ onOpenLink }) {
  const defaultOpen = helpfulLinkSections.reduce((acc, section) => {
    acc[section.id] = Boolean(section.defaultOpen);
    return acc;
  }, {});
  const [openSections, setOpenSections] = useState(defaultOpen);
  const [favorites, setFavorites] = useState(() => new Set(['LAVA Training University']));

  const toggleSection = (id) => setOpenSections((current) => ({ ...current, [id]: !current[id] }));
  const toggleFavorite = (event, label) => {
    event.stopPropagation();
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <div className="helpful-tree">
      {helpfulLinkSections.map((section) => (
        <div className="helpful-section" key={section.id}>
          <button className="helpful-section-title" onClick={() => toggleSection(section.id)}>
            <span className="helpful-arrow">{openSections[section.id] ? '⌄' : '›'}</span>
            <span className="helpful-section-icon">{section.icon}</span>
            <strong>{section.title}</strong>
          </button>
          {openSections[section.id] && (
            <div className="helpful-section-links">
              {section.links.map((link) => (
                <button className="helpful-link-row" key={`${section.id}-${link}`} onClick={() => onOpenLink(link, section.title)}>
                  <span
                    className={`helpful-star ${favorites.has(link) ? 'active' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={(event) => toggleFavorite(event, link)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') toggleFavorite(event, link);
                    }}
                    title={favorites.has(link) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    ★
                  </span>
                  <span>{link}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HomePage({ user, leads, accounts, tasks, alerts, depotLeads, onNavigate, onNewLead, stickyNote, onStickyNoteChange }) {
  const [newsTab, setNewsTab] = useState('Rates & Rules');
  const [taskTab, setTaskTab] = useState('High Priority Tasks');
  const [birthdayTab, setBirthdayTab] = useState('Active Customers');
  const [activeModal, setActiveModal] = useState(null);

  const visibleNews = useMemo(() => {
    const byTab = agencyNews.filter((item) => item.type === newsTab);
    if (byTab.length) return byTab;
    return agencyNews;
  }, [newsTab]);

  const stats = useMemo(() => {
    const quoted = leads.filter((lead) => lead.status === 'Quoted' || lead.status === 'Follow-Up').length;
    const retention = accounts.filter((account) => account.billing.status.includes('Past Due') || account.policies.some((policy) => policy.status.includes('Renewal'))).length;
    const crossSell = accounts.filter((account) => account.status === 'Active' && account.policies.length === 1).length;
    const winBack = accounts.filter((account) => account.status === 'Cancelled').length;
    return { quoted, retention, crossSell, winBack };
  }, [leads, accounts]);

  const unreadByCategory = (category) => alerts.filter((alert) => alert.category === category && !alert.read).length;
  const dueTodayTasks = tasks.filter((task) => task.status !== 'Completed' && isDueToday(task.dueDate));
  const overdueTasks = tasks.filter((task) => task.status !== 'Completed' && isOverdue(task.dueDate));
  const filteredTasks = useMemo(() => {
    if (taskTab === 'My Tasks') return tasks.filter((task) => task.status !== 'Completed' && task.owner === user.name);
    if (taskTab === 'Agency Tasks') return tasks.filter((task) => task.status !== 'Completed' && task.owner !== user.name);
    return tasks.filter((task) => task.status !== 'Completed' && task.priority === 'High');
  }, [taskTab, tasks, user.name]);

  const birthdayRows = [
    { name: 'TRAINING CUSTOMER 001', date: 'Jun 11, 2026' },
    { name: 'TRAINING CUSTOMER 002', date: 'Jun 11, 2026' },
    { name: 'TRAINING CUSTOMER 003', date: 'Jun 11, 2026' },
    { name: 'TRAINING CUSTOMER 004', date: 'Jun 11, 2026' },
    { name: 'TRAINING CUSTOMER 005', date: 'Jun 11, 2026' }
  ];

  const prospectBirthdayRows = accounts
    .filter((account) => account.status === 'Prospect' || account.status === 'Pending')
    .slice(0, 5)
    .map((account) => ({ name: account.primaryContact || account.household, date: 'Jun 11, 2026' }));

  const openTrainingModal = (title, subtitle, body) => setActiveModal({ title, subtitle, body });

  const serviceAlertMetrics = [
    { label: 'Critical', value: Math.max(4, unreadByCategory('Critical')), tone: 'red', route: 'alerts:Critical' },
    { label: 'Renewal', value: Math.max(19, unreadByCategory('Renewal')), route: 'alerts:Renewal' },
    { label: 'Claims', value: Math.max(1, unreadByCategory('Claims')), route: 'alerts:Claims' },
    { label: 'Pending', value: Math.max(11, unreadByCategory('Pending')), route: 'alerts:Pending' },
    { label: 'Policy Notifications', value: Math.max(6, unreadByCategory('Policy')), route: 'alerts:Policy' },
    { label: 'Manual Brokered', value: unreadByCategory('Manual Brokered'), route: 'alerts:Manual Brokered' },
    { label: 'Kraft Lake', value: 0, route: 'alerts' },
    { label: 'Undelivered Email', value: unreadByCategory('Undelivered Email'), route: 'alerts:Undelivered Email' },
    { label: 'Potential BI/PL Combines', value: '100+', route: 'report:cross-sell' },
    { label: 'New HH Members Role: Other', value: 0, route: 'alerts' }
  ];

  const birthdayList = birthdayTab === 'Active Customers' ? birthdayRows : prospectBirthdayRows;

  return (
    <main className="workspace apex-background farmers-workspace">
      <div className="farmers-dashboard-grid">
        <div className="farmers-dashboard-column farmers-left-column">
          <Panel className="farmers-greeting-card">
            <div className="farmers-date-text">{formatLongDate()}</div>
            <h1>{greetingForNow()}, {user.name}</h1>
            <button className="farmers-quote-button" onClick={onNewLead}>Quote New Account</button>
          </Panel>

          <div className="farmers-note-card">
            <textarea
              value={stickyNote}
              onChange={(event) => onStickyNoteChange(event.target.value)}
              placeholder="No notes to display"
              aria-label="APEX notes"
            />
          </div>

          <Panel title="Upcoming Birthdays" icon="▣" className="farmers-panel farmers-birthday-panel" action={<button className="farmers-mini-action" onClick={() => onNavigate('accounts')}>30 days ▾</button>}>
            <div className="farmers-tabs">
              {['Active Customers', 'Prospects'].map((tab) => (
                <button key={tab} className={birthdayTab === tab ? 'active' : ''} onClick={() => setBirthdayTab(tab)}>{tab}</button>
              ))}
            </div>
            <div className="farmers-row-list">
              {birthdayList.length === 0 ? (
                <p className="farmers-empty-line">No birthdays to display.</p>
              ) : birthdayList.map((person) => (
                <button className="farmers-list-row" key={person.name} onClick={() => onNavigate('accounts')}>
                  <span>{person.name}</span>
                  <em>{person.date}</em>
                </button>
              ))}
            </div>
            <button className="farmers-card-link" onClick={() => onNavigate('accounts')}>View All Active Customer Birthdays (110)</button>
          </Panel>

          <Panel title="Reports Hub" icon="▣" className="farmers-panel farmers-reports-card">
            <div className="farmers-report-search">
              <input placeholder="Search Lists, Reports, and Analytics..." onKeyDown={(event) => { if (event.key === 'Enter') onNavigate('reports-hub'); }} />
              <button onClick={() => onNavigate('reports-hub')} title="Open Reports Hub">ⓘ</button>
            </div>
            <div className="farmers-recent-box"><strong>Recent</strong></div>
          </Panel>
        </div>

        <div className="farmers-dashboard-column farmers-middle-column">
          <Panel title="Service Alerts & Notifications" icon="▣" className="farmers-panel farmers-service-panel">
            <div className="farmers-service-grid">
              {serviceAlertMetrics.map((metric) => (
                <MiniMetric key={metric.label} value={metric.value} label={metric.label} tone={metric.tone} onClick={() => onNavigate(metric.route)} />
              ))}
            </div>
            <button className="farmers-card-link" onClick={() => onNavigate('alerts-hub')}>View All Alerts</button>
          </Panel>

          <Panel title="Recommendation Engine" icon="▣" className="farmers-panel farmers-recommendation-panel">
            <div className="farmers-recommendation-grid">
              <MiniMetric value={stats.winBack} label="Win Back" onClick={() => onNavigate('direct-mail')} />
              <MiniMetric value={stats.crossSell} label="Cross-Sell" onClick={() => onNavigate('report:cross-sell')} />
              <MiniMetric value={Math.max(3, stats.retention)} label="Retention" onClick={() => onNavigate('report:renewal')} />
              <MiniMetric value={Math.max(31, stats.quoted)} label="Quotes Not Closed" onClick={() => onNavigate('leads')} />
            </div>
          </Panel>

          <Panel title="Sales & Marketing Notifications" icon="▣" className="farmers-panel farmers-marketing-panel">
            <div className="farmers-recommendation-grid">
              <MiniMetric value={0} label="Agency FastQuote" onClick={() => onNavigate('lead-depot')} />
              <MiniMetric value={0} label="BI Agency Web" onClick={() => onNavigate('lead-depot')} />
              <MiniMetric value={Math.max(13, depotLeads.length)} label="High Value FFRs" onClick={() => onNavigate('lead-depot')} />
            </div>
          </Panel>

          <Panel title="Tasks - Due Today" icon="▣" className="farmers-panel farmers-tasks-panel" action={<button className="farmers-mini-action" onClick={() => onNavigate('tasks:today')}>View All Tasks</button>}>
            <div className="farmers-tabs">
              {['High Priority Tasks', 'My Tasks', 'Agency Tasks'].map((tab) => (
                <button key={tab} className={taskTab === tab ? 'active' : ''} onClick={() => setTaskTab(tab)}>{tab}</button>
              ))}
            </div>
            {overdueTasks.length > 0 && <button className="farmers-warning-row" onClick={() => onNavigate('tasks:overdue')}>⚠ {overdueTasks.length} overdue task{overdueTasks.length === 1 ? '' : 's'} need attention</button>}
            {filteredTasks.length === 0 ? (
              <p className="farmers-task-empty">You don&apos;t have any tasks in this list. Look in a different list, or create a task.</p>
            ) : (
              <div className="farmers-task-list">
                {filteredTasks.slice(0, 3).map((task) => (
                  <button key={task.id} className="farmers-task-row" onClick={() => onNavigate('tasks')}>
                    <strong>{task.title}</strong>
                    <span>{task.relatedTo} · Due {task.dueDate}</span>
                  </button>
                ))}
              </div>
            )}
            <button className="farmers-card-link muted" onClick={() => onNavigate('tasks:today')}>View All High Priority Tasks</button>
          </Panel>
        </div>

        <div className="farmers-dashboard-column farmers-right-column">
          <Panel
            title="Agency News & Resources (ANR)"
            icon="▣"
            className="farmers-panel farmers-news-panel"
            action={<button className="farmers-mini-action" onClick={() => openTrainingModal('Launch ANR', 'Agency News & Resources', 'This simulator would open the Agency News & Resources workspace in the real portal.')}>Launch ANR</button>}
          >
            <div className="farmers-tabs farmers-news-tabs">
              {['Agency News', 'Rates & Rules', 'Product Resources'].map((tab) => (
                <button key={tab} className={newsTab === tab ? 'active' : ''} onClick={() => setNewsTab(tab)}>{tab}</button>
              ))}
            </div>
            <NewsRows items={visibleNews} onOpen={(item) => openTrainingModal(item.title, `Published ${item.date}`, 'Training simulator bulletin only. A real ANR item would open the full carrier/agency article, rate rule, or product resource.')} />
          </Panel>

          <Panel title="New to APEX" icon="▣" className="farmers-panel farmers-new-apex" action={<button className="farmers-edit-icon" onClick={() => onNavigate('custom-home')}>↗</button>}>
            <button className="farmers-new-link" onClick={() => onNavigate('custom-home')}>The Customizable APEX Home Page You&apos;ve Been Asking For!</button>
          </Panel>

          <Panel title="Helpful Links" icon="🔗" className="farmers-panel farmers-helpful-panel" action={<InfoTip text="Each row is clickable for simulator practice. Stars can be toggled to mimic favorite links." />}>
            <HelpfulLinks onOpenLink={(link, section) => openTrainingModal(link, section, `Training simulator: this would open ${link} from the ${section} section in the real portal.`)} />
          </Panel>
        </div>
      </div>

      {activeModal && (
        <Modal title={activeModal.title} onClose={() => setActiveModal(null)}>
          <div className="farmers-link-modal">
            <p className="eyebrow">{activeModal.subtitle}</p>
            <p>{activeModal.body}</p>
            <div className="button-row right">
              <button className="outline-button" onClick={() => setActiveModal(null)}>Close</button>
              <button className="primary-button" onClick={() => setActiveModal(null)}>Okay</button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}
