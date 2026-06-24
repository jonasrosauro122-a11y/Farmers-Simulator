import { useEffect, useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ComplianceBanner } from '../components/ComplianceGuard.jsx';
import { trainingTracks } from '../data/training.js';
import { assessmentQuestions } from '../data/content.js';
import { loadLocal, saveLocal } from '../utils/storage.js';

export default function TrainingPage({
  onNavigate,
  onToast,
  onNewLead,
  onNewAccount,
  onNewTask
}) {
  const [done, setDone] = useState(() => loadLocal('apexCrm3.training', {}));
  const [answers, setAnswers] = useState({});
  const [graded, setGraded] = useState(false);

  useEffect(() => saveLocal('apexCrm3.training', done), [done]);

  const allPractice = useMemo(
    () => trainingTracks.flatMap((t) => t.practice.map((p) => p.id)),
    []
  );
  const completedCount = allPractice.filter((id) => done[id]).length;
  const pct = Math.round((completedCount / allPractice.length) * 100);

  const runAction = (action) => {
    if (action === 'new-lead') return onNewLead && onNewLead();
    if (action === 'new-account') return onNewAccount && onNewAccount();
    if (action === 'new-task') return onNewTask && onNewTask();
    return onNavigate && onNavigate(action);
  };

  const toggleTask = (id) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (!prev[id] && onToast) onToast('Practice task marked complete.');
      return next;
    });
  };

  const score = graded
    ? assessmentQuestions.reduce(
        (acc, q) => acc + (answers[q.id] === q.answer ? 1 : 0),
        0
      )
    : 0;

  return (
    <main className="workspace page-bg">
      <header className="page-header">
        <div>
          <p className="eyebrow">Training Center</p>
          <h1>VA Training Curriculum</h1>
          <p className="helper-text">
            Five tracks of insurance CRM practice. Work through the learning
            modules, then complete the hands-on practice tasks &mdash; each one
            launches a real action in the simulator.
          </p>
        </div>
        <div className="button-row">
          <button className="outline-button" onClick={() => onNavigate && onNavigate('scenarios')}>
            Open Scenarios
          </button>
          <button className="outline-button" onClick={() => onNavigate && onNavigate('product-learning')}>
            Product Learning
          </button>
        </div>
      </header>

      <ComplianceBanner />

      <Panel title="Your progress" icon="📈">
        <div className="progress-wrap">
          <div className="progress-bar">
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="helper-text">
            {completedCount} of {allPractice.length} practice tasks complete ({pct}%)
          </p>
        </div>
      </Panel>

      <div className="track-grid">
        {trainingTracks.map((track) => {
          const trackDone = track.practice.filter((p) => done[p.id]).length;
          return (
            <Panel
              key={track.id}
              title={`${track.icon} ${track.title}`}
              className="track-card"
            >
              <p className="subhead">Learning modules</p>
              <ul className="module-list">
                {track.modules.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>

              <p className="subhead">
                Practice tasks
                <span className="track-count">{trackDone}/{track.practice.length}</span>
              </p>
              <ul className="practice-list">
                {track.practice.map((p) => (
                  <li key={p.id} className={done[p.id] ? 'practice-row done' : 'practice-row'}>
                    <label className="practice-check">
                      <input
                        type="checkbox"
                        checked={!!done[p.id]}
                        onChange={() => toggleTask(p.id)}
                      />
                      <span>{p.label}</span>
                    </label>
                    <button className="text-button" onClick={() => runAction(p.action)}>
                      Go &rarr;
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>

      <Panel title="Mock assessment" icon="📝" action={<InfoTip text="Answer all questions and grade yourself. Nothing is saved or shared." />}>
        <ol className="quiz-list">
          {assessmentQuestions.map((q) => (
            <li key={q.id} className="quiz-item">
              <p className="quiz-question">{q.question}</p>
              <div className="quiz-options">
                {q.options.map((opt, i) => {
                  const picked = answers[q.id] === i;
                  const correct = graded && i === q.answer;
                  const wrong = graded && picked && i !== q.answer;
                  return (
                    <label
                      key={i}
                      className={
                        'quiz-option' +
                        (picked ? ' picked' : '') +
                        (correct ? ' correct' : '') +
                        (wrong ? ' wrong' : '')
                      }
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={picked}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                      />
                      <span>{opt}</span>
                    </label>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
        <div className="button-row">
          <button className="primary-button" onClick={() => setGraded(true)}>
            Grade assessment
          </button>
          <button
            className="outline-button"
            onClick={() => {
              setAnswers({});
              setGraded(false);
            }}
          >
            Reset answers
          </button>
        </div>
        {graded && (
          <p className="compliance-note" style={{ marginTop: 12 }}>
            You scored {score} of {assessmentQuestions.length}.{' '}
            {score === assessmentQuestions.length
              ? 'Perfect — ready for live practice.'
              : 'Review the highlighted answers and try again.'}
          </p>
        )}
      </Panel>
    </main>
  );
}
