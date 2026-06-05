import { useState } from 'react';
import Panel from '../components/Panel.jsx';
import Modal from '../components/Modal.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { mailAudiences, mailTemplates } from '../data/campaigns.js';
import { nextId } from '../utils/storage.js';
import { addDaysISO, todayISO } from '../utils/dates.js';

const STEPS = ['Name', 'Audience', 'Template', 'Preview'];

function CampaignWizard({ onClose, onSave }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [audienceId, setAudienceId] = useState(mailAudiences[0].id);
  const [templateId, setTemplateId] = useState(mailTemplates[0].id);
  const [error, setError] = useState('');

  const audience = mailAudiences.find((a) => a.id === audienceId);
  const template = mailTemplates.find((t) => t.id === templateId);

  const next = () => {
    if (step === 0 && !name.trim()) { setError('Give the campaign a name first.'); return; }
    setError('');
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const finish = (status) => {
    onSave({
      name: name.trim(), audienceId, templateId, status,
      recipients: audience.size, createdDate: todayISO(),
      scheduledDate: status === 'Draft' ? '' : status === 'Scheduled' ? addDaysISO(3) : todayISO()
    });
  };

  return (
    <Modal title="Create Direct Mail Campaign" onClose={onClose} size="large">
      <div className="wizard-steps">
        {STEPS.map((label, i) => (
          <span key={label} className={`wizard-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {step === 0 && (
        <div className="form-stack">
          <label className="field-label">Campaign Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spring Bundle Review Letters" autoFocus />
          {error && <p className="form-error">{error}</p>}
        </div>
      )}

      {step === 1 && (
        <div className="tile-list">
          {mailAudiences.map((a) => (
            <label className={`pick-row ${audienceId === a.id ? 'selected' : ''}`} key={a.id}>
              <input type="radio" name="audience" checked={audienceId === a.id} onChange={() => setAudienceId(a.id)} />
              <span><strong>{a.name}</strong><small>{a.size} recipients</small></span>
            </label>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="tile-list">
          {mailTemplates.map((t) => (
            <label className={`pick-row ${templateId === t.id ? 'selected' : ''}`} key={t.id}>
              <input type="radio" name="template" checked={templateId === t.id} onChange={() => setTemplateId(t.id)} />
              <span><strong>{t.name}</strong><small>{t.preview}</small></span>
            </label>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="mail-preview">
          <h3>{name}</h3>
          <p className="metric-caption">{audience.name} · {audience.size} recipients · template: {template.name}</p>
          <div className="mail-letter">
            <p>Dear Neighbor,</p>
            <p>{template.preview}</p>
            <p>Warm regards,<br />Your Local Agency Team</p>
          </div>
          <p className="helper-text">Simulator only — nothing is printed or mailed.</p>
        </div>
      )}

      <div className="button-row right">
        <button className="outline-button" onClick={onClose}>Cancel</button>
        {step > 0 && <button className="outline-button" onClick={() => setStep((s) => s - 1)}>Back</button>}
        {step < STEPS.length - 1 && <button className="primary-button" onClick={next}>Next</button>}
        {step === STEPS.length - 1 && (
          <>
            <button className="outline-button" onClick={() => finish('Draft')}>Save Draft</button>
            <button className="outline-button" onClick={() => finish('Scheduled')}>Schedule</button>
            <button className="primary-button" onClick={() => finish('Sent')}>Send Now (Simulated)</button>
          </>
        )}
      </div>
    </Modal>
  );
}

export default function DirectMailPage({ campaigns, setCampaigns, onToast }) {
  const [showWizard, setShowWizard] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const visible = campaigns.filter((c) => statusFilter === 'All' || c.status === statusFilter);

  const saveCampaign = (campaign) => {
    setCampaigns((items) => [{ ...campaign, id: nextId('DM', items) }, ...items]);
    setShowWizard(false);
    onToast(`Campaign ${campaign.status === 'Sent' ? 'sent (simulated)' : `saved as ${campaign.status}`}.`);
  };

  const advance = (campaign) => {
    const nextStatus = campaign.status === 'Draft' ? 'Scheduled' : 'Sent';
    setCampaigns((items) => items.map((c) => (c.id === campaign.id
      ? { ...c, status: nextStatus, scheduledDate: nextStatus === 'Scheduled' ? addDaysISO(3) : todayISO() }
      : c)));
    onToast(nextStatus === 'Scheduled' ? 'Campaign scheduled.' : 'Campaign sent (simulated).');
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Direct Mail</p>
          <h1>Campaign Center <InfoTip text="Practice the campaign workflow: name it, pick an audience and letter template, preview, then save as Draft, Schedule, or Send. Sending is simulated — nothing leaves the browser." /></h1>
          <span>Practice selecting audiences, templates, and campaign statuses.</span>
        </div>
        <button className="primary-button" onClick={() => setShowWizard(true)}>+ Create Campaign</button>
      </div>

      <Panel title="Campaigns" icon="✉️">
        <div className="segmented-control left">
          {['All', 'Draft', 'Scheduled', 'Sent'].map((s) => (
            <button key={s} className={statusFilter === s ? 'active' : ''} onClick={() => setStatusFilter(s)}>
              {s} ({s === 'All' ? campaigns.length : campaigns.filter((c) => c.status === s).length})
            </button>
          ))}
        </div>
        {visible.length === 0 ? (
          <div className="empty-state compact">No campaigns with this status yet.</div>
        ) : (
          <div className="tile-list">
            {visible.map((c) => {
              const audience = mailAudiences.find((a) => a.id === c.audienceId);
              const template = mailTemplates.find((t) => t.id === c.templateId);
              return (
                <div className="lead-tile" key={c.id}>
                  <div>
                    <h3>{c.name}</h3>
                    <p>{audience ? audience.name : 'Custom audience'} · {template ? template.name : 'Custom template'}</p>
                    <span>{c.recipients} recipients · created {c.createdDate}{c.scheduledDate ? ` · ${c.status === 'Sent' ? 'sent' : 'scheduled'} ${c.scheduledDate}` : ''}</span>
                  </div>
                  <div className="tile-actions">
                    <em className={`status-chip mail-${c.status.toLowerCase()}`}>{c.status}</em>
                    {c.status !== 'Sent' && (
                      <button className="outline-button compact" onClick={() => advance(c)}>
                        {c.status === 'Draft' ? 'Schedule' : 'Send Now'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {showWizard && <CampaignWizard onClose={() => setShowWizard(false)} onSave={saveCampaign} />}
    </main>
  );
}
