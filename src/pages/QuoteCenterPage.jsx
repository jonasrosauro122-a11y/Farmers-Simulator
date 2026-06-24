import { useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ComplianceBanner, RestrictedButton } from '../components/ComplianceGuard.jsx';
import { loadLocal, saveLocal, nextId } from '../utils/storage.js';
import { todayISO } from '../utils/dates.js';

const LOBS = ['Homeowners', 'Personal Auto', 'Renters', 'Condo', 'Dwelling Fire', 'Personal Umbrella', 'General Liability', 'Business Auto', 'Business Owners Policy', 'Workers Compensation', 'Commercial Property'];

const blank = { prospect: '', lob: 'Homeowners', phone: '', email: '', xDate: '', notes: '' };

export default function QuoteCenterPage({ onNavigate, onToast, onNewTask }) {
  const [form, setForm] = useState(blank);
  const [intakes, setIntakes] = useState(() => loadLocal('apexCrm3.quoteIntakes', []));

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const saveIntake = () => {
    if (!form.prospect.trim()) { onToast('Add a prospect name before saving.'); return; }
    const record = { id: nextId('Q', intakes), ...form, createdDate: todayISO(), status: 'Intake Prepared' };
    const updated = [record, ...intakes];
    setIntakes(updated);
    saveLocal('apexCrm3.quoteIntakes', updated);
    setForm(blank);
    onToast('Quote intake notes saved for licensed review.');
  };

  const removeIntake = (id) => {
    const updated = intakes.filter((item) => item.id !== id);
    setIntakes(updated);
    saveLocal('apexCrm3.quoteIntakes', updated);
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Quote Center</p>
          <h1>Quote Intake Preparation <InfoTip text="A VA gathers intake details and saves them for a licensed agent. Preparing intake is allowed; preparing and presenting the actual quote and binding are licensed actions." /></h1>
          <span>Collect the details a licensed agent needs to prepare a quote. Saved intakes persist in this browser.</span>
        </div>
      </div>

      <ComplianceBanner compact />

      <div className="lob-layout">
        <Panel title="New Quote Intake" icon="📝" className="lob-detail">
          <div className="form-grid two">
            <label className="field">
              <span>Prospect / Business name</span>
              <input className="input" value={form.prospect} onChange={(e) => update('prospect', e.target.value)} placeholder="e.g., Jordan Miller" />
            </label>
            <label className="field">
              <span>Line of business</span>
              <select className="input" value={form.lob} onChange={(e) => update('lob', e.target.value)}>
                {LOBS.map((lob) => <option key={lob}>{lob}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Phone</span>
              <input className="input" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(555) 000-0000" />
            </label>
            <label className="field">
              <span>Email</span>
              <input className="input" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="name@example.com" />
            </label>
            <label className="field">
              <span>X-Date (current policy expiration)</span>
              <input className="input" type="date" value={form.xDate} onChange={(e) => update('xDate', e.target.value)} />
            </label>
          </div>
          <label className="field">
            <span>Intake notes (drivers, vehicles, property details, exposures…)</span>
            <textarea className="input" rows={4} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Capture everything a licensed agent needs to quote." />
          </label>
          <div className="button-row">
            <button className="primary-button" onClick={saveIntake}>Save quote intake</button>
            <RestrictedButton label="Present quote & bind" onBlocked={onToast} />
          </div>
          <p className="compliance-note">⚖️ Preparing intake notes is within a VA’s role. Presenting the priced quote and binding coverage require a licensed agent.</p>
        </Panel>

        <Panel title="Prepared Intakes" icon="📂" className="lob-rail">
          {intakes.length === 0 ? (
            <p className="empty-line">No saved intakes yet. Prepared quote intakes will appear here for licensed review.</p>
          ) : (
            <div className="intake-list">
              {intakes.map((item) => (
                <div className="intake-card" key={item.id}>
                  <div className="intake-card-top">
                    <strong>{item.prospect}</strong>
                    <span className="status-badge amber">{item.status}</span>
                  </div>
                  <p>{item.lob} · {item.createdDate}</p>
                  {item.notes && <p className="intake-notes">{item.notes}</p>}
                  <div className="button-row">
                    <button className="outline-button small" onClick={() => onNewTask && onNewTask({ title: `Follow up quote: ${item.prospect}`, category: 'Follow up quote', related: item.prospect })}>Create follow-up task</button>
                    <button className="text-button" onClick={() => removeIntake(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="button-row">
            <button className="text-button" onClick={() => onNavigate('leads')}>Go to Leads →</button>
          </div>
        </Panel>
      </div>
    </main>
  );
}
