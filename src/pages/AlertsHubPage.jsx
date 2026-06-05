import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ALERT_CATEGORIES } from '../data/alerts.js';

const ICONS = {
  Critical: '🚨', Renewal: '🔄', Claims: '🛠️', Pending: '⏳',
  Policy: '📑', 'Manual Brokered': '🤝', 'Undelivered Email': '📭'
};

export default function AlertsHubPage({ alerts, onNavigate }) {
  const unreadTotal = alerts.filter((a) => !a.read).length;

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Alerts Hub</p>
          <h1>Service Alerts & Notifications <InfoTip text="The Alerts Hub groups every service notification by category. Open a category to review, mark items read, and create follow-up tasks." /></h1>
          <span>{unreadTotal} unread alert{unreadTotal === 1 ? '' : 's'} across all categories.</span>
        </div>
        <button className="primary-button" onClick={() => onNavigate('alerts')}>Open All Alerts</button>
      </div>

      <div className="card-grid four">
        {ALERT_CATEGORIES.map((category) => {
          const unread = alerts.filter((a) => a.category === category && !a.read).length;
          const total = alerts.filter((a) => a.category === category).length;
          return (
            <Panel key={category} title={category} icon={ICONS[category] || '📣'}>
              <strong className="big-number">{unread}</strong>
              <span className="metric-caption">unread of {total} total</span>
              <button className="link-button" onClick={() => onNavigate(`alerts:${category}`)}>Open {category} →</button>
            </Panel>
          );
        })}
      </div>

      <Panel title="Routing Guide" icon="🧭">
        <div className="guidance-grid">
          <div>
            <h3>A non-licensed VA can</h3>
            <p>Read the alert, document the item, gather missing information, create a task with the right owner, and notify agency staff.</p>
          </div>
          <div>
            <h3>Must escalate to licensed staff</h3>
            <p>Coverage interpretation, underwriting decisions, binding or cancelling coverage, quoting without approval, and claim coverage statements.</p>
          </div>
        </div>
      </Panel>
    </main>
  );
}
