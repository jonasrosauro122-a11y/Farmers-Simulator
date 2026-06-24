import { useMemo, useState } from 'react';
import Modal from '../components/Modal.jsx';
import { SfButton, SfListHeader, SfListToolbar } from '../components/SalesforceMock.jsx';
import { todayISO } from '../utils/dates.js';

export default function AlertsPage({ alerts, categoryFilter = 'All', onSetRead, onMarkAllRead, onCreateTask }) {
  const [search, setSearch] = useState('');
  const [detailId, setDetailId] = useState(null);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return alerts
      .filter((alert) => categoryFilter === 'All' || !categoryFilter || alert.category === categoryFilter)
      .filter((alert) => !term || `${alert.title} ${alert.relatedTo} ${alert.category} ${alert.status || ''}`.toLowerCase().includes(term));
  }, [alerts, categoryFilter, search]);

  const detail = alerts.find((alert) => alert.id === detailId);

  const createTask = (alert) => {
    onCreateTask({
      title: alert.suggestedAction || `Follow up on ${alert.title}`,
      relatedTo: alert.relatedTo || 'Training Household',
      relatedType: 'Alert',
      priority: alert.severity === 'Critical' || alert.severity === 'High' ? 'High' : 'Medium',
      dueDate: todayISO(),
      notes: `Created from simulator alert ${alert.id}.`
    });
  };

  return (
    <main className="sf-page sf-page-white">
      <SfListHeader objectName="Alerts" icon="🔔" iconTone="pink" itemCount={visible.length}>
        <SfButton onClick={() => createTask(visible[0] || {})}>New</SfButton>
      </SfListHeader>

      <SfListToolbar search={search} onSearch={setSearch} />

      <div className="sf-table-wrap">
        <table className="sf-data-table sf-alerts-simple-table">
          <thead>
            <tr>
              <th></th>
              <th>Alert Name</th>
              <th>Alert</th>
              <th>Account</th>
              <th>Household</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Alert Tab</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((alert, index) => (
              <tr key={alert.id}>
                <td>{index + 1}</td>
                <td><button className="sf-table-link" onClick={() => setDetailId(alert.id)}>{alert.alertName || `Alert ${alert.id.replace(/\D/g, '')}`}</button></td>
                <td><button className="sf-table-link" onClick={() => setDetailId(alert.id)}>View Alert</button></td>
                <td><button className="sf-table-link">{alert.account || 'Riverstone Household'}</button></td>
                <td><button className="sf-table-link">{alert.relatedTo || 'Riverstone Household'}</button></td>
                <td>{alert.date}</td>
                <td><span className={alert.read ? 'sf-status-complete' : 'sf-status-process'} /> {alert.read ? 'Completed' : 'In Process'}</td>
                <td>{alert.category || 'Renewal Alerts'}</td>
                <td><button className="sf-row-menu" onClick={() => onSetRead(alert.id, !alert.read)}>▾</button></td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan="9"><div className="sf-inline-empty">No alerts found.</div></td></tr>}
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
              <div><dt>Related To</dt><dd>{detail.relatedTo}</dd></div>
              <div><dt>Category</dt><dd>{detail.category}</dd></div>
              <div><dt>Suggested Action</dt><dd>{detail.suggestedAction}</dd></div>
            </dl>
          </div>
          <div className="button-row right">
            <button className="outline-button" onClick={() => onSetRead(detail.id, true)}>Mark Completed</button>
            <button className="primary-button" onClick={() => createTask(detail)}>Create Task</button>
          </div>
        </Modal>
      )}
    </main>
  );
}
