import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ComplianceBanner } from '../components/ComplianceGuard.jsx';
import { scenarios, SCENARIO_GROUPS } from '../data/scenarios.js';
import { loadLocal, saveLocal } from '../utils/storage.js';

export default function ScenariosPage({ onNavigate, onToast }) {
  const [open, setOpen] = useState(null);
  const [group, setGroup] = useState('All');
  const [completed, setCompleted] = useState(() => loadLocal('apexCrm3.scenarioScores', {}));

  const totalPoints = scenarios.reduce((sum, s) => sum + s.points, 0);
  const earned = scenarios.reduce((sum, s) => sum + (completed[s.id] ? s.points : 0), 0);
  const doneCount = scenarios.filter((s) => completed[s.id]).length;

  const visible = useMemo(
    () => (group === 'All' ? scenarios : scenarios.filter((s) => s.group === group)),
    [group]
  );

  const toggle = (scenario) => {
    setCompleted((prev) => {
      const next = { ...prev, [scenario.id]: !prev[scenario.id] };
      saveLocal('apexCrm3.scenarioScores', next);
      return next;
    });
    if (!completed[scenario.id]) onToast(`Scenario complete: +${scenario.points} points`);
  };

  const reset = () => {
    setCompleted({});
    saveLocal('apexCrm3.scenarioScores', {});
    onToast('Scenario scores reset.');
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Training Scenarios</p>
          <h1>Practice Scenarios <InfoTip text="Each scenario gives you a realistic CRM task. Open it, complete the task in the CRM, then mark it done to earn points. Progress saves in this browser." /></h1>
          <span>{scenarios.length} built-in scenarios across home, auto, and commercial lines.</span>
        </div>
        <div className="header-actions">
          <div className="score-pill">Score: {earned}/{totalPoints} · {doneCount}/{scenarios.length} done</div>
          <button className="outline-button" onClick={reset}>Reset scores</button>
        </div>
      </div>

      <ComplianceBanner compact />

      <div className="filter-row">
        {['All', ...SCENARIO_GROUPS].map((g) => (
          <button key={g} className={`filter-chip ${group === g ? 'active' : ''}`} onClick={() => setGroup(g)}>{g}</button>
        ))}
      </div>

      <div className="scenario-grid">
        {visible.map((s) => (
          <div className={`scenario-card ${completed[s.id] ? 'complete' : ''}`} key={s.id}>
            <div className="scenario-card-head">
              <span className="scenario-group">{s.group}</span>
              {completed[s.id] && <span className="status-badge green">Completed</span>}
            </div>
            <h3>{s.title}</h3>
            <p className="scenario-bg">{s.background}</p>
            <button className="text-button" onClick={() => setOpen(open === s.id ? null : s.id)}>
              {open === s.id ? 'Hide details ↑' : 'Show task details →'}
            </button>

            {open === s.id && (
              <div className="scenario-body">
                <div className="scenario-section">
                  <strong>CRM task</strong>
                  <p>{s.crmTask}</p>
                </div>
                <div className="scenario-section">
                  <strong>Required fields</strong>
                  <ul>{s.requiredFields.map((f) => <li key={f}>{f}</li>)}</ul>
                </div>
                <div className="scenario-section">
                  <strong>Success criteria</strong>
                  <p>{s.success}</p>
                </div>
                <p className="compliance-note">⚖️ {s.escalation}</p>
                <div className="button-row">
                  <button className="primary-button" onClick={() => onNavigate(s.route)}>{s.cta}</button>
                  <button className={`outline-button ${completed[s.id] ? 'is-done' : ''}`} onClick={() => toggle(s)}>
                    {completed[s.id] ? 'Mark incomplete' : `Mark complete (+${s.points})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
