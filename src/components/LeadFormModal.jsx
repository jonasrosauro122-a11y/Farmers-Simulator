import { useState } from 'react';
import Modal from './Modal.jsx';
import { LEAD_INTERESTS, LEAD_SOURCES, LEAD_STATUSES, LINES } from '../data/leads.js';
import { taskOwners } from '../data/users.js';
import { todayISO } from '../utils/dates.js';

const emptyLead = {
  name: '', email: '', phone: '', type: 'Personal Lines', interest: 'Auto', product: '',
  city: '', state: '', premium: 0, status: 'New', priority: 'Medium', source: 'Manual Entry', owner: 'Jonas'
};

// Create or edit a lead. Pass `lead` to edit; omit to create.
export default function LeadFormModal({ lead, title, submitLabel, onClose, onSave }) {
  const [draft, setDraft] = useState(lead ? { ...lead } : { ...emptyLead });
  const [error, setError] = useState('');
  const set = (key) => (event) => setDraft((value) => ({ ...value, [key]: event.target.value }));

  const submit = () => {
    if (!draft.name.trim()) return setError('Name is required.');
    if (draft.email && !draft.email.includes('@')) return setError('Email looks invalid.');
    const clean = {
      ...draft,
      name: draft.name.trim(),
      product: draft.product.trim() || draft.interest,
      premium: Number(draft.premium) || 0,
      state: draft.state.toUpperCase().slice(0, 2)
    };
    if (!lead) {
      clean.createdDate = todayISO();
      clean.lastActivity = 'Lead created in simulator';
      clean.notes = [{ date: todayISO(), author: clean.owner, text: 'Lead created from the New Lead form.' }];
    }
    onSave(clean);
  };

  return (
    <Modal title={title} onClose={onClose} size="large">
      {error && <div className="form-error">{error}</div>}
      <div className="form-grid">
        <label><span>Name / Business *</span><input className="input" value={draft.name} onChange={set('name')} placeholder="Customer or business name" autoFocus /></label>
        <label><span>Email</span><input className="input" value={draft.email} onChange={set('email')} placeholder="email@example.com" /></label>
        <label><span>Phone</span><input className="input" value={draft.phone} onChange={set('phone')} placeholder="(555) 000-0000" /></label>
        <label><span>Line of Business</span><select className="input" value={draft.type} onChange={set('type')}>{LINES.map((line) => <option key={line}>{line}</option>)}</select></label>
        <label><span>Insurance Interest</span><select className="input" value={draft.interest} onChange={set('interest')}>{LEAD_INTERESTS.map((interest) => <option key={interest}>{interest}</option>)}</select></label>
        <label><span>Product Detail</span><input className="input" value={draft.product} onChange={set('product')} placeholder="Home + Auto Bundle, BOP, GL..." /></label>
        <label><span>City</span><input className="input" value={draft.city} onChange={set('city')} /></label>
        <label><span>State</span><input className="input" value={draft.state} onChange={set('state')} placeholder="TX" maxLength={2} /></label>
        <label><span>Estimated Premium ($)</span><input className="input" type="number" min="0" value={draft.premium} onChange={set('premium')} /></label>
        <label><span>Status</span><select className="input" value={draft.status} onChange={set('status')}>{LEAD_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label><span>Priority</span><select className="input" value={draft.priority} onChange={set('priority')}><option>High</option><option>Medium</option><option>Low</option></select></label>
        <label><span>Lead Source</span><select className="input" value={draft.source} onChange={set('source')}>{LEAD_SOURCES.map((source) => <option key={source}>{source}</option>)}</select></label>
        <label><span>Owner</span><select className="input" value={draft.owner} onChange={set('owner')}>{taskOwners.map((owner) => <option key={owner}>{owner}</option>)}</select></label>
      </div>
      <div className="button-row right">
        <button className="outline-button" onClick={onClose}>Cancel</button>
        <button className="primary-button" onClick={submit}>{submitLabel}</button>
      </div>
    </Modal>
  );
}
