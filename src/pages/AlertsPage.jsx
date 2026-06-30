import { useMemo, useState } from 'react';
import Modal from '../components/Modal.jsx';
import { SfButton, SfListHeader, SfListToolbar } from '../components/SalesforceMock.jsx';
import { ALERT_STATUSES } from '../data/alerts.js';
import { todayISO } from '../utils/dates.js';

const QUICK_FILTERS = ['All', 'Unread', 'New', 'In Process', 'Completed', 'Critical', 'Personal Lines', 'Commercial Lines', 'Billing'];

function statusOf(alert) {
  return alert.status || (alert.read ? 'Completed' : 'New');
}

export default function AlertsPage({ alerts, categoryFilter = 'All', assignees = [], onSetRead, onUpdateAlert, onMarkAllRead, onCreateTask, onNavigate }) {
  const [search, setSearch] = useState('');
  const [quick, setQuick] = useState('All');
  const [detailId, setDetailId] = useState(null);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return alerts
      .filter((alert) => categoryFilter === 'All' || !categoryFilter || alert.category === categoryFilter)
      .filter((alert) => {
        switch (quick) {
          case 'Unread': return !alert.read;
          case 'New': return statusOf(alert) === 'New';
          case 'In Process': return statusOf(alert) === 'In Process';
          case 'Completed': return statusOf(alert) === 'Completed';
          case 'Critical': return alert.severity === 'Critical' || alert.category === 'Critical & Pending Alerts';
          case 'Personal Lines': return alert.line === 'Personal Lines';
          case 'Commercial Lines': return alert.line === 'Commercial Lines';
          case 'Billing': return alert.category === 'Billing Alerts';
          default: return true;
        }
      })
      .filter((alert) => !term || `${alert.title} ${alert.relatedTo} ${alert.category} ${statusOf(alert)} ${alert.account || ''}`.toLowerCase().includes(term));
  }, [alerts, categoryFilter, quick, search]);

  const detail = alerts.find((alert) => alert.id === detailId);

  const createTask = (alert) => {
    if (!alert || !alert.id) return;
    onCreateTask({
      title: alert.suggestedAction || `Follow up on ${alert.title}`,
      relatedTo: alert.relatedTo || 'Training Household',
      relatedType: 'Alert',
      priority: alert.severity === 'Critical' || alert.severity === 'High' ? 'High' : 'Medium',
      dueDate: todayISO(),
      notes: `Created from simulator alert ${alert.id}.`
    });
  };

  const statusClass = (alert) => {
    const s = statusOf(alert);
    if (s === 'Completed') return 'sf-status-complete';
    if (s === 'In Process') return 'sf-status-process';
    return 'sf-status-new';
  };

  return (
    <main className="sf-page sf-page-white">
      <SfListHeader objectName="Alerts" icon="🔔" iconTone="pink" itemCount={visible.length}>
        <SfButton onClick={() => detail ? createTask(detail) : createTask(visible[0])}>New Task</SfButton>
      </SfListHeader>

      <SfListToolbar search={search} onSearch={setSearch} />

      <div className="filter-row" style={{ padding: '10px 16px' }}>
        {QUICK_FILTERS.map((f) => (
          <button key={f} className={quick === f ? 'filter-chip active' : 'filter-chip'} onClick={() => setQuick(f)}>{f}</button>
        ))}
      </div>

      <div className="sf-table-wrap">
        <table className="sf-data-table sf-alerts-simple-table">
          <thead>
            <tr>
              <th></th>
              <th>Alert Name</th>
              <th>Account</th>
              <th>Linked To</th>
              <th>Assigned</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((alert, index) => (
              <tr key={alert.id} className={alert.read ? '' : 'sf-row-unread'}>
                <td>{index + 1}</td>
                <td><button className="sf-table-link" onClick={() => setDetailId(alert.id)}>{alert.alertName || `Alert ${alert.id.replace(/\D/g, '')}`}</button></td>
                <td>{alert.account || '—'}</td>
                <td>{alert.linkedTo || alert.relatedTo || '—'}</td>
                <td>{alert.assignedTo || 'Unassigned'}</td>
                <td>{alert.date}</td>
                <td><span className={statusClass(alert)} /> {statusOf(alert)}</td>
                <td>{alert.category}</td>
                <td><button className="sf-row-menu" title="Toggle read" onClick={() => onSetRead(alert.id, !alert.read)}>▾</button></td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan="9"><div className="sf-inline-empty">No alerts match this filter.</div></td></tr>}
          </tbody>
        </table>
      </div>

      <div className="sf-alerts-footer-actions">
        <button onClick={onMarkAllRead}>Mark All Read</button>
      </div>

      {detail && (
        <Modal title={detail.alertName || `Alert ${detail.id}`} onClose={() => setDetailId(null)}>
          <div className="sf-modal-detail-copy">
            <h3>{detail.title}</h3>
            <p>{detail.body}</p>
            <dl>
              <div><dt>Account</dt><dd>{detail.account || '—'}</dd></div>
              <div><dt>Linked To</dt><dd>{detail.linkedTo || detail.relatedTo}</dd></div>
              <div><dt>Category</dt><dd>{detail.category}</dd></div>
              <div><dt>Suggested Action</dt><dd>{detail.suggestedAction}</dd></div>
            </dl>
          </div>

          <div className="form-grid">
            <label className="field"><span>Status</span>
              <select className="input" value={statusOf(detail)} onChange={(e) => onUpdateAlert?.(detail.id, { status: e.target.value })}>
                {ALERT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="field"><span>Assign To</span>
              <select className="input" value={detail.assignedTo || 'Unassigned'} onChange={(e) => onUpdateAlert?.(detail.id, { assignedTo: e.target.value })}>
                {[...new Set([detail.assignedTo || 'Unassigned', ...assignees])].map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          </div>

          <div className="button-row right">
            <button className="outline-button" onClick={() => onNavigate?.('customer-info')}>Link to Customer</button>
            <button className="outline-button" onClick={() => onNavigate?.('billing')}>Link to Billing</button>
            <button className="primary-button" onClick={() => { createTask(detail); }}>Create Task</button>
          </div>
        </Modal>
      )}
    </main>
  );
}
