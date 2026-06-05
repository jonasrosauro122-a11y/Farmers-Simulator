import { useState } from 'react';
import Modal from './Modal.jsx';
import { taskOwners } from '../data/users.js';
import { addDaysISO } from '../utils/dates.js';

// Create-a-task modal. `relatedOptions` is built from current leads + accounts so
// trainees can practice attaching tasks to real records.
export default function TaskFormModal({ relatedOptions = [], defaults = {}, onClose, onSave }) {
  const [draft, setDraft] = useState({
    title: '', relatedTo: '', relatedType: 'General', owner: 'Jonas',
    dueDate: addDaysISO(1), priority: 'Medium', status: 'Open', notes: '', ...defaults
  });
  const [error, setError] = useState('');
  const set = (key) => (event) => setDraft((value) => ({ ...value, [key]: event.target.value }));

  const selectRelated = (event) => {
    const option = relatedOptions.find((item) => item.name === event.target.value);
    setDraft((value) => ({ ...value, relatedTo: event.target.value, relatedType: option ? option.type : 'General' }));
  };

  const submit = () => {
    if (!draft.title.trim()) return setError('Task title is required.');
    onSave({ ...draft, title: draft.title.trim(), relatedTo: draft.relatedTo || 'General' });
  };

  return (
    <Modal title="Create Task" onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      <div className="form-stack">
        <label className="field-label">Task Title *</label>
        <input className="input" value={draft.title} onChange={set('title')} placeholder="Call customer for missing documents..." autoFocus />
        <label className="field-label">Related Lead / Account</label>
        <select className="input" value={draft.relatedTo} onChange={selectRelated}>
          <option value="">— Not related to a record —</option>
          {relatedOptions.map((option) => <option key={`${option.type}-${option.name}`} value={option.name}>{option.name} ({option.type})</option>)}
        </select>
        <div className="form-grid tight">
          <label><span>Owner</span><select className="input" value={draft.owner} onChange={set('owner')}>{taskOwners.map((owner) => <option key={owner}>{owner}</option>)}</select></label>
          <label><span>Due Date</span><input className="input" type="date" value={draft.dueDate} onChange={set('dueDate')} /></label>
          <label><span>Priority</span><select className="input" value={draft.priority} onChange={set('priority')}><option>High</option><option>Medium</option><option>Low</option></select></label>
        </div>
        <label className="field-label">Notes</label>
        <textarea className="input" rows="3" value={draft.notes} onChange={set('notes')} placeholder="Optional task notes..." />
        <div className="button-row right">
          <button className="outline-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" onClick={submit}>Create Task</button>
        </div>
      </div>
    </Modal>
  );
}
