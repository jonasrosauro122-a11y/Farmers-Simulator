import { useMemo, useState } from 'react';
import { serviceRequestRows } from '../data/serviceRequests.js';

const columns = [
  { key: 'id', label: 'SR#', width: '120px' },
  { key: 'customer', label: 'Customer', width: '150px' },
  { key: 'household', label: 'Household', width: '150px' },
  { key: 'subStatus', label: 'Sub Status', width: '170px' },
  { key: 'alertStatus', label: 'Alert Status', width: '150px' },
  { key: 'dateOpened', label: 'Date Opened', width: '140px' },
  { key: 'estimatedCompletion', label: 'Estimated Com...', width: '150px' },
  { key: 'policyNumber', label: 'Policy Number', width: '150px' },
  { key: 'lob', label: 'LOB', width: '145px' },
  { key: 'inquiry', label: 'Inquiry/Tra...', width: '170px' }
];

const dateRangeLabels = {
  all: 'All',
  last30: 'Last 30 Days',
  thisYear: 'This Year'
};

function parseDate(value) {
  const [month, day, year] = value.split('/').map(Number);
  return new Date(year, month - 1, day).getTime();
}

function compareValues(a, b, key) {
  const aValue = a[key] || '';
  const bValue = b[key] || '';
  if (key === 'dateOpened' || key === 'estimatedCompletion') {
    if (aValue === '—' && bValue !== '—') return 1;
    if (bValue === '—' && aValue !== '—') return -1;
    if (aValue === '—' && bValue === '—') return 0;
    return parseDate(aValue) - parseDate(bValue);
  }
  return String(aValue).localeCompare(String(bValue), undefined, { numeric: true, sensitivity: 'base' });
}

function shorten(value, max = 20) {
  if (!value) return '—';
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

export default function ServiceRequestsPage({ onToast }) {
  const [status, setStatus] = useState('Open');
  const [dateRange, setDateRange] = useState('all');
  const [sort, setSort] = useState({ key: 'dateOpened', direction: 'desc' });
  const [selectedRequest, setSelectedRequest] = useState(null);

  const counts = useMemo(() => ({
    Open: serviceRequestRows.filter((row) => row.status === 'Open').length,
    Closed: serviceRequestRows.filter((row) => row.status === 'Closed').length
  }), []);

  const filteredRows = useMemo(() => {
    const newestDate = Math.max(...serviceRequestRows.map((row) => parseDate(row.dateOpened)));
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return serviceRequestRows
      .filter((row) => row.status === status)
      .filter((row) => {
        if (dateRange === 'last30') return newestDate - parseDate(row.dateOpened) <= thirtyDays;
        if (dateRange === 'thisYear') return row.dateOpened.endsWith('/2026');
        return true;
      })
      .sort((a, b) => {
        const result = compareValues(a, b, sort.key);
        return sort.direction === 'asc' ? result : -result;
      });
  }, [status, dateRange, sort]);

  const handleSort = (key) => {
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const openRequest = (request) => {
    setSelectedRequest(request);
    onToast?.(`Opened simulator service request ${request.id}.`);
  };

  return (
    <main className="farmers-service-requests-shell">
      <section className="service-requests-card" aria-label="Service Requests simulator list view">
        <header className="service-requests-header">
          <div className="service-requests-title">
            <span className="service-requests-icon">↘</span>
            <strong>Service Requests</strong>
          </div>
          <label className="service-date-filter">
            <span>Date Range</span>
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
              <option value="all">All</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisYear">This Year</option>
            </select>
          </label>
        </header>

        <div className="service-request-tabs" role="tablist" aria-label="Service request status filters">
          <button className={status === 'Open' ? 'active' : ''} onClick={() => setStatus('Open')}>
            Open (20+)
          </button>
          <button className={status === 'Closed' ? 'active' : ''} onClick={() => setStatus('Closed')}>
            Closed
          </button>
        </div>

        <div className="service-table-wrap">
          <table className="service-requests-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key} style={{ width: column.width }}>
                    <button onClick={() => handleSort(column.key)}>
                      <span>{column.label}</span>
                      <span className="service-column-caret">⌄</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((request) => (
                <tr key={request.id} className={selectedRequest?.id === request.id ? 'selected' : ''} onDoubleClick={() => openRequest(request)}>
                  <td><button className="service-link" onClick={() => openRequest(request)}>{request.id.replace('SR-', '')}</button></td>
                  <td><button className="service-link" onClick={() => openRequest(request)} title={request.customer}>{shorten(request.customer, 21)}</button></td>
                  <td><button className="service-link" onClick={() => openRequest(request)} title={request.household}>{shorten(request.household, 21)}</button></td>
                  <td title={request.subStatus}>{shorten(request.subStatus, 21)}</td>
                  <td>{request.alertStatus}</td>
                  <td>{request.dateOpened}</td>
                  <td>{request.estimatedCompletion}</td>
                  <td><button className="service-link" onClick={() => openRequest(request)}>{request.policyNumber}</button></td>
                  <td title={request.lob}>{shorten(request.lob, 19)}</td>
                  <td title={request.inquiry}>{shorten(request.inquiry, 19)}</td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length}>
                    <div className="service-empty-state">No {status.toLowerCase()} service requests found for {dateRangeLabels[dateRange]}.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedRequest && (
        <aside className="service-request-preview" aria-live="polite">
          <div>
            <p>Training Simulator Detail</p>
            <h2>{selectedRequest.id} · {selectedRequest.inquiry}</h2>
            <span>{selectedRequest.summary}</span>
          </div>
          <dl>
            <div><dt>Customer</dt><dd>{selectedRequest.customer}</dd></div>
            <div><dt>Household</dt><dd>{selectedRequest.household}</dd></div>
            <div><dt>Policy</dt><dd>{selectedRequest.policyNumber}</dd></div>
            <div><dt>LOB</dt><dd>{selectedRequest.lob}</dd></div>
            <div><dt>Owner</dt><dd>{selectedRequest.owner}</dd></div>
            <div><dt>Priority</dt><dd>{selectedRequest.priority}</dd></div>
            <div><dt>Status</dt><dd>{selectedRequest.subStatus}</dd></div>
          </dl>
          <button onClick={() => setSelectedRequest(null)}>Close Details</button>
        </aside>
      )}
    </main>
  );
}
