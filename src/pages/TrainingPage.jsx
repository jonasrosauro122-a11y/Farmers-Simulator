import { useEffect, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { assessmentQuestions, trainingScenarios } from '../data/content.js';
import { loadLocal, saveLocal } from '../utils/storage.js';

const MODULES = [
  { title: 'Home', what: 'Daily landing page: alerts, tasks due today, news, and shortcuts.' },
  { title: 'Leads', what: 'Prospects you are working. Track status from New through Converted or Lost.' },
  { title: 'Lead Depot', what: 'Unassigned inbound leads. Claim one to move it into My Leads.' },
  { title: 'Accounts', what: 'Existing customers: household, policies, billing, claims, documents, activity.' },
  { title: 'Tasks', what: 'Your to-do queue with owners, priorities, and due dates.' },
  { title: 'Reports Hub', what: 'Catalog of reports computed live from simulator data.' },
  { title: 'Alerts', what: 'Service notifications that need review, documentation, or routing.' },
  { title: 'Direct Mail', what: 'Campaign workflow practice: audience, template, preview, status.' },
  { title: 'Account Lookup', what: 'Bottom-bar search by name, phone, email, or policy number.' }
];

export default function TrainingPage({ onNavigate, onToast }) {
  const [openScenario, setOpenScenario] = useState(null);
  const [checked, setChecked] = useState(() => loadLocal('apexCrm2.training', {}));
  const [answers, setAnswers] = useState({});
  const [graded, setGraded] = useState(false);

  useEffect(() => saveLocal('apexCrm2.training', checked), [checked]);

  const toggleStep = (scenarioId, stepIndex) => {
    const key = `${scenarioId}:${stepIndex}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const scenarioProgress = (scenario) =>
    scenario.steps.filter((_, i) => checked[`${scenario.id}:${i}`]).length;

  const score = assessmentQuestions.filter((q) => answers[q.id] === q.answer).length;

  const grade = () => {
    if (Object.keys(answers).length < assessmentQuestions.length) {
      onToast('Answer every question before grading.');
      return;
    }
    setGraded(true);
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Training Center</p>
          <h1>VA Training & Scenarios <InfoTip text="Start with the module guide, work through the scenario checklists (your progress saves automatically), then take the mock assessment." /></h1>
          <span>Module explanations, realistic VA scenarios, checklists, and a mock assessment.</span>
        </div>
      </div>

      <Panel title="Compliance First" icon="⚖️">
        <div className="compliance-box">
          <strong>Non-licensed VAs must never:</strong> give coverage advice, bind or cancel coverage,
          quote without producer approval, or interpret policy coverage. When in doubt, document the
          request and create a task for licensed staff.
        </div>
      </Panel>

      <Panel title="What Each Module Does" icon="🧭">
        <div className="guidance-grid three-cols">
          {MODULES.map((m) => <div key={m.title}><h3>{m.title}</h3><p>{m.what}</p></div>)}
        </div>
      </Panel>

      <Panel title="Practice Scenarios" icon="🧪">
        <p className="helper-text">Each scenario is a checklist walkthrough. Checked steps are saved to this browser so trainees can resume later.</p>
        <div className="card-grid three">
          {trainingScenarios.map((scenario) => (
            <button className="report-card" key={scenario.id} onClick={() => setOpenScenario(openScenario === scenario.id ? null : scenario.id)}>
              <span>{scenario.icon} {scenarioProgress(scenario)}/{scenario.steps.length} steps</span>
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
              <em>{openScenario === scenario.id ? 'Hide checklist ↑' : 'Open checklist →'}</em>
            </button>
          ))}
        </div>
        {trainingScenarios.filter((s) => s.id === openScenario).map((scenario) => (
          <div className="scenario-detail" key={scenario.id}>
            <h3>{scenario.icon} {scenario.title} — Checklist</h3>
            <div className="tile-list">
              {scenario.steps.map((step, i) => (
                <label className="checklist-row" key={i}>
                  <input type="checkbox" checked={Boolean(checked[`${scenario.id}:${i}`])} onChange={() => toggleStep(scenario.id, i)} />
                  <span>{step}</span>
                </label>
              ))}
            </div>
            <p className="compliance-note">⚖️ {scenario.compliance}</p>
          </div>
        ))}
      </Panel>

      <Panel title="Mock Assessment" icon="📝">
        {assessmentQuestions.map((q, qi) => (
          <div className="quiz-question" key={q.id}>
            <strong>{qi + 1}. {q.question}</strong>
            <div className="quiz-options">
              {q.options.map((option, oi) => {
                let cls = '';
                if (graded) {
                  if (oi === q.answer) cls = 'correct';
                  else if (answers[q.id] === oi) cls = 'incorrect';
                }
                return (
                  <label className={`pick-row ${answers[q.id] === oi ? 'selected' : ''} ${cls}`} key={oi}>
                    <input type="radio" name={q.id} checked={answers[q.id] === oi} disabled={graded}
                      onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))} />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        <div className="button-row">
          {!graded
            ? <button className="primary-button" onClick={grade}>Grade Assessment</button>
            : (
              <>
                <strong className="quiz-score">Score: {score}/{assessmentQuestions.length} {score === assessmentQuestions.length ? '— perfect! 🎉' : ''}</strong>
                <button className="outline-button" onClick={() => { setAnswers({}); setGraded(false); }}>Retake</button>
              </>
            )}
        </div>
      </Panel>

      <Panel title="Suggested Practice Flow" icon="📚">
        <ol className="training-list">
          <li>Start on Home and identify the critical service alerts.</li>
          <li>Use Account Lookup (bottom bar) to find a customer by policy number.</li>
          <li>Open Lead Depot, claim a lead, then update its status from the lead detail page.</li>
          <li>Create a task from an alert and mark it completed in Tasks.</li>
          <li>Open Reports Hub and export the Renewal Report to CSV.</li>
        </ol>
        <button className="primary-button" onClick={() => onNavigate('home')}>Start Practice</button>
      </Panel>
    </main>
  );
}
