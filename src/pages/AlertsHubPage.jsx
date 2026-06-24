import { useMemo, useState } from 'react';

const alertRows = [
  { id: 'A-1001', dueDate: '06/28/2026', createdDate: '06/18/2026', status: 'In Process', household: 'Montgomery Household', name: 'Jody Montgomery', category: 'Pending Cancellation for NonPay', subCategory: 'Billing Pending Cancellations', lob: 'Home', policy: '323683280', billingAccount: 'J827909905', billingPlan: '1-Pay-12 Months', balanceDue: '$1,410.24', paymentMade: '$0', agencyCode: '95-32-C1', phone: '(805) 260-8554', email: 'jodym72@example.com', priority: 'Critical' },
  { id: 'A-1002', dueDate: '06/28/2026', createdDate: '05/30/2026', status: 'In Process', household: 'Del Rosario Household', name: 'Maria Del Rosario', category: 'Underwriting', subCategory: 'Cancellation - Commercial', lob: 'Auto', policy: 'A10058821', billingAccount: 'B881204', billingPlan: 'Monthly', balanceDue: '$482.18', paymentMade: '$0', agencyCode: '95-32-C1', phone: '(555) 410-1928', email: 'maria.dr@example.com', priority: 'Critical' },
  { id: 'A-1003', dueDate: '06/29/2026', createdDate: '06/06/2026', status: 'In Process', household: 'Penamo Household', name: 'Berenice Penamo', category: 'Pending Cancellation for NonPay', subCategory: 'Billing Pending Cancellations', lob: 'Home', policy: 'H20091844', billingAccount: 'B778342', billingPlan: 'Monthly', balanceDue: '$296.41', paymentMade: '$0', agencyCode: '95-32-C1', phone: '(555) 784-7720', email: 'berenice.p@example.com', priority: 'Critical' },
  { id: 'A-1004', dueDate: '07/02/2026', createdDate: '06/10/2026', status: 'In Process', household: 'Villarreal Household', name: 'Anthony Villarreal', category: 'Pending Cancellation for NonPay', subCategory: 'Billing Pending Cancellations', lob: 'Home', policy: 'H77190828', billingAccount: 'B910471', billingPlan: 'Monthly', balanceDue: '$321.90', paymentMade: '$0', agencyCode: '95-32-C1', phone: '(555) 903-1181', email: 'anthony.v@example.com', priority: 'High' },
  { id: 'A-1005', dueDate: '07/03/2026', createdDate: '05/19/2026', status: 'In Process', household: 'Mathiesen Household', name: 'Christopher Mathiesen', category: 'Required Documents', subCategory: 'Missing Documents', lob: 'Home', policy: 'H88122901', billingAccount: 'B100293', billingPlan: 'Escrow', balanceDue: '$0', paymentMade: '$0', agencyCode: '95-32-C1', phone: '(555) 512-8324', email: 'cmathiesen@example.com', priority: 'High' },
  { id: 'A-1006', dueDate: '07/06/2026', createdDate: '06/16/2026', status: 'In Process', household: 'Provenzano Household', name: 'Rick Provenzano', category: 'Pending Cancellation for NonPay', subCategory: 'Billing Pending Cancellations', lob: 'Auto', policy: 'P99100210', billingAccount: 'B558201', billingPlan: 'Monthly', balanceDue: '$198.44', paymentMade: '$0', agencyCode: '95-32-C1', phone: '(555) 390-2112', email: 'rick.p@example.com', priority: 'High' },
  { id: 'A-1007', dueDate: '07/07/2026', createdDate: '06/13/2026', status: 'In Process', household: 'Huckaby Household', name: 'Sue Huckaby', category: 'Pending Cancellation for NonPay', subCategory: 'Billing Pending Cancellations', lob: 'Home', policy: 'H88011900', billingAccount: 'B779205', billingPlan: 'Monthly', balanceDue: '$602.81', paymentMade: '$0', agencyCode: '95-32-C1', phone: '(555) 870-9321', email: 'sue.h@example.com', priority: 'High' },
  { id: 'A-1008', dueDate: '07/08/2026', createdDate: '06/08/2026', status: 'In Process', household: 'Ginyard Household', name: 'Kiana Ginyard', category: 'Underwriting', subCategory: 'Unrated Driver - Disclosure', lob: 'Auto', policy: 'A55190200', billingAccount: 'B124588', billingPlan: 'Monthly', balanceDue: '$0', paymentMade: '$0', agencyCode: '95-32-C1', phone: '(555) 601-2221', email: 'kiana.g@example.com', priority: 'High' },
  { id: 'A-1009', dueDate: '07/13/2026', createdDate: '06/19/2026', status: 'In Process', household: 'Salon & Spa Household', name: 'Valley Green Salon', category: 'Pending Cancellation for NonPay', subCategory: 'Billing Pending Cancellations', lob: 'Business', policy: 'B55001820', billingAccount: 'B663210', billingPlan: 'Monthly', balanceDue: '$740.14', paymentMade: '$0', agencyCode: '95-32-C1', phone: '(555) 823-1100', email: 'admin@valleygreen.example', priority: 'High' },
  { id: 'A-1010', dueDate: '07/15/2026', createdDate: '06/23/2026', status: 'New', household: 'Mendez Household', name: 'Maria Mendez', category: 'Pending Cancellation for NonPay', subCategory: 'Billing Pending Cancellations', lob: 'Auto', policy: 'A66218840', billingAccount: 'B981882', billingPlan: 'Monthly', balanceDue: '$211.31', paymentMade: '$0', agencyCode: '95-32-C1', phone: '(555) 822-9011', email: 'maria.m@example.com', priority: 'High' }
];

const tabs = ['Critical & Pending Alerts', 'Renewal Alerts', 'Policy Notifications', 'Claims Alerts', 'Manual Brokered Alerts', 'Kraft Lake Alerts', 'More'];

function trunc(value, length = 20) {
  return value.length > length ? `${value.slice(0, length - 3)}...` : value;
}

export default function AlertsHubPage({ onNavigate }) {
  const [selectedId, setSelectedId] = useState(alertRows[0].id);
  const [tab, setTab] = useState(tabs[0]);
  const [worked, setWorked] = useState('Unworked');
  const selected = alertRows.find((row) => row.id === selectedId) || alertRows[0];

  const filtered = useMemo(() => {
    if (tab === 'Claims Alerts') return alertRows.filter((row) => row.category.includes('Claim'));
    if (tab === 'Renewal Alerts') return alertRows.filter((row) => row.category.includes('Renewal'));
    return alertRows;
  }, [tab]);

  return (
    <main className="sf-alerts-hub-page">
      <div className="sf-alerts-hub-header">
        <span className="sf-object-icon red">📣</span>
        <strong>Alerts Hub</strong>
        <button>Hide panel details</button>
      </div>

      <nav className="sf-alert-tabs">
        {tabs.map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}{item === 'More' ? '⌄' : ''}</button>)}
      </nav>

      <section className="sf-alerts-layout">
        <div className="sf-alerts-main-panel">
          <div className="sf-alerts-action-row">
            <div className="sf-alerts-title-box">
              <span className="sf-object-icon red">📣</span>
              <div><span>Alerts & Notifications</span><strong>{tab}</strong></div>
            </div>
            <button disabled>Mark as Completed</button>
            <button disabled>Mark as in Process</button>
            <button disabled>Assign To</button>
            <button>Filter Alerts</button>
            <button>Download⌄</button>
            <button>Select Fields</button>
          </div>

          <div className="sf-alert-subtabs">
            {['Unworked', 'Worked+Expired'].map((item) => <button key={item} className={worked === item ? 'active' : ''} onClick={() => setWorked(item)}>{item}</button>)}
          </div>

          <div className="sf-alert-table-wrap">
            <table className="sf-alert-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Due Date ↑</th>
                  <th>Created Date</th>
                  <th>Status</th>
                  <th>Household</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Sub-Category</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className={selectedId === row.id ? 'selected' : ''} onClick={() => setSelectedId(row.id)}>
                    <td><input type="checkbox" /></td>
                    <td><span className={row.priority === 'Critical' ? 'critical-due' : ''}>🔔 {row.dueDate}</span></td>
                    <td>{row.createdDate}</td>
                    <td><span className={row.status === 'New' ? 'sf-status-new' : 'sf-status-process'} /> {row.status}</td>
                    <td><button>{trunc(row.household)}</button></td>
                    <td><button>{trunc(row.name)}</button></td>
                    <td>{trunc(row.category, 26)}</td>
                    <td>{trunc(row.subCategory, 26)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="sf-alert-detail-panel">
          <div className="sf-path">
            <span className="done">✓</span><span className="active">In Process</span><span>Completed</span>
          </div>
          <button className="sf-create-activity">Create Activity</button>
          <div className="sf-customer-summary">
            <h2>{selected.name.toUpperCase()}</h2>
            <p><strong>Preferred Phone:</strong> {selected.phone} Cell</p>
            <p><strong>Preferred Email:</strong> {selected.email} <span>●</span></p>
          </div>
          <div className="sf-detail-tabs"><button className="active">Details</button></div>
          <dl className="sf-alert-detail-list">
            <div><dt>Assigned To</dt><dd>✎</dd></div>
            <div><dt>Alert Classification</dt><dd>🔔{selected.priority}</dd></div>
            <div><dt>Due Date</dt><dd>{selected.dueDate}</dd></div>
            <div><dt>Created Date</dt><dd>{selected.createdDate}</dd></div>
            <div><dt>Alert Category</dt><dd>{selected.category}</dd></div>
            <div><dt>Alert Sub-Category</dt><dd>{selected.subCategory}</dd></div>
            <div><dt>LOB</dt><dd>{selected.lob}</dd></div>
            <div><dt>Policy</dt><dd><button>{selected.policy}</button></dd></div>
            <div><dt>Billing Account</dt><dd><button>{selected.billingAccount}</button></dd></div>
            <div><dt>Billing Plan</dt><dd>{selected.billingPlan}</dd></div>
            <div><dt>Balance Due</dt><dd>{selected.balanceDue}</dd></div>
            <div><dt>Payment Made</dt><dd>{selected.paymentMade}</dd></div>
            <div><dt>Agency Code</dt><dd>{selected.agencyCode}</dd></div>
            <div><dt>Security Classification</dt><dd>Confidential Training Information</dd></div>
          </dl>
          <div className="sf-activities-footer"><strong>Activities</strong><button onClick={() => onNavigate('tasks')}>Create Activity</button></div>
        </aside>
      </section>
    </main>
  );
}
