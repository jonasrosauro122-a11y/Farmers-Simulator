import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import Modal from '../components/Modal.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ALERT_CATEGORIES } from '../data/alerts.js';
import { todayISO } from '../utils/dates.js';

export default function AlertsPage({ alerts, categoryFilter = 'All', onSetRead, onMarkAllRead, onCreateTask }) {
  const [filter, setFilter] = useState(ALERT_CATEGORIES.includes(categoryFilter) ? categoryFilter : 'All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [detailId, setDetailId] = useState(null);

  const visible = useMemo(() => {
    let list = alerts;
    if (filter !== 'All') list = list.filter((a) => a.category === filter);
    if (showUnreadOnly) list = list.filter((a) => !a.read);
    return list;
  }, [alerts, filter, showUnreadOnly]);

  const detail = alerts.find((a) => a.id === detailId);

  const openDetail = (alert) => {
    setDetailId(alert.id);
    if (!alert.read) onSetRead(alert.id, true);
  };

  const taskFromAlert = (alert) => {
    setDetailId(null);
    onCreateTask({
      title: alert.suggestedAction || `Follow up: ${alert.title}`,
      relatedTo: alert.relatedTo || 'Agency',
      relatedType: 'Account',
      priority: alert.severity === 'Critical' || alert.severity === 'High' ? 'High' : 'Medium',
      dueDate: todayISO(),
      notes: `Created from alert ${alert.id}: ${alert.title}`
    });
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Alerts</p>
          <h1>{filter === 'All' ? 'All Alerts' : `${filter} Alerts`} <InfoTip text="Click an alert to open its detail. Opening an alert marks it read. From the detail you can create a follow-up task with the suggested action pre-filled." /></h1>
          <span>Review service notifications, mark them read, and route items correctly.</span>
        </div>
        <button className="outline-button" onClick={onMarkAllRead}>Mark All Read</button>
      </div>

      <Panel>
        <div className="segmented-control left wrap">
          {['All', ...ALERT_CATEGORIES].map((item) => (
            <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>
              {item} ({item === 'All' ? alerts.length : alerts.filter((a) => a.category === item).length})
            </button>
          ))}
        </div>
        <label className="toggle-inline">
          <input type="checkbox" checked={showUnreadOnly} onChange={(e) => setShowUnreadOnly(e.target.checked)} />
          <span>Unread only</span>
        </label>

        {visible.length === 0 ? (
          <div className="empty-state compact">No alerts in this view. 🎉</div>
        ) : (
          <div className="tile-list">
            {visible.map((alert) => (
              <div className={`alert-card ${alert.read ? 'read' : ''}`} key={alert.id}>
                <button className="alert-main" onClick={() => openDetail(alert)}>
                  <span className={`severity ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                  <h3>{alert.title}</h3>
                  <p>{alert.body}</p>
                  <small>{alert.date} · {alert.category} · {alert.relatedTo}</small>
                </button>
                <div className="alert-actions">
                  <button className="outline-button compact" onClick={() => onSetRead(alert.id, !alert.read)}>
                    {alert.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button className="outline-button compact" onClick={() => taskFromAlert(alert)}>Create Task</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {detail && (
        <Modal title={`Alert ${detail.id} — ${detail.category}`} onClose={() => setDetailId(null)}>
          <div className="alert-detail">
            <span className={`severity ${detail.severity.toLowerCase()}`}>{detail.severity}</span>
            <h3>{detail.title}</h3>
            <p>{detail.body}</p>
            <dl className="info-list">
              <div><dt>Date</dt><dd>{detail.date}</dd></div>
              <div><dt>Related To</dt><dd>{detail.relatedTo}</dd></div>
              <div><dt>Suggested Action</dt><dd>{detail.suggestedAction}</dd></div>
            </dl>
          </div>
          <div className="button-row right">
            <button className="outline-button" onClick={() => setDetailId(null)}>Close</button>
            <button className="primary-button" onClick={() => taskFromAlert(detail)}>Create Task from Alert</button>
          </div>
        </Modal>
      )}
    </main>
  );
}
