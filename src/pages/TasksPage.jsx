import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { isDueToday, isOverdue } from '../utils/dates.js';

const VIEWS = ['All', 'My Tasks', 'Agency', 'High Priority', 'Due Today', 'Overdue', 'Completed'];

function viewFromParam(param) {
  const map = { my: 'My Tasks', agency: 'Agency', high: 'High Priority', today: 'Due Today', overdue: 'Overdue', completed: 'Completed' };
  return map[param] || 'All';
}

export default function TasksPage({ tasks, user, initialView = '', onUpdateTask, onNewTask }) {
  const [view, setView] = useState(viewFromParam(initialView));
  const [search, setSearch] = useState('');

  const counts = useMemo(() => ({
    'All': tasks.length,
    'My Tasks': tasks.filter((t) => t.owner === user.name).length,
    'Agency': tasks.filter((t) => t.owner !== user.name).length,
    'High Priority': tasks.filter((t) => t.priority === 'High' && t.status !== 'Completed').length,
    'Due Today': tasks.filter((t) => isDueToday(t.dueDate) && t.status !== 'Completed').length,
    'Overdue': tasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'Completed').length,
    'Completed': tasks.filter((t) => t.status === 'Completed').length
  }), [tasks, user.name]);

  const visible = useMemo(() => {
    let list = tasks;
    if (view === 'My Tasks') list = list.filter((t) => t.owner === user.name);
    if (view === 'Agency') list = list.filter((t) => t.owner !== user.name);
    if (view === 'High Priority') list = list.filter((t) => t.priority === 'High' && t.status !== 'Completed');
    if (view === 'Due Today') list = list.filter((t) => isDueToday(t.dueDate) && t.status !== 'Completed');
    if (view === 'Overdue') list = list.filter((t) => isOverdue(t.dueDate) && t.status !== 'Completed');
    if (view === 'Completed') list = list.filter((t) => t.status === 'Completed');
    const term = search.trim().toLowerCase();
    if (term) list = list.filter((t) => `${t.title} ${t.relatedTo} ${t.owner}`.toLowerCase().includes(term));
    return list;
  }, [tasks, view, search, user.name]);

  const dueLabel = (task) => {
    if (task.status === 'Completed') return <em className="due-chip done">Completed</em>;
    if (isOverdue(task.dueDate)) return <em className="due-chip overdue">Overdue · {task.dueDate}</em>;
    if (isDueToday(task.dueDate)) return <em className="due-chip today">Due Today</em>;
    return <em className="due-chip">Due {task.dueDate}</em>;
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Daily Execution</p>
          <h1>Tasks <InfoTip text="Tasks track calls, follow-ups, document requests, and escalations. Use the views to slice by owner, priority, and due date. Checking the box marks a task complete." /></h1>
          <span>Track calls, follow-ups, document requests, and escalation items.</span>
        </div>
        <button className="primary-button" onClick={onNewTask}>+ New Task</button>
      </div>

      <Panel>
        <div className="segmented-control left wrap">
          {VIEWS.map((item) => (
            <button key={item} className={view === item ? 'active' : ''} onClick={() => setView(item)}>
              {item} ({counts[item]})
            </button>
          ))}
        </div>
        <div className="search-line">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks by title, related record, or owner..." />
        </div>

        {visible.length === 0 ? (
          <div className="empty-state compact">No tasks match this view. Create one with “+ New Task”.</div>
        ) : (
          <div className="tile-list">
            {visible.map((task) => (
              <div className="task-card" key={task.id}>
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={(e) => onUpdateTask(task.id, { status: e.target.checked ? 'Completed' : 'Open' })}
                  title="Mark complete"
                />
                <div>
                  <h3 className={task.status === 'Completed' ? 'task-done' : ''}>{task.title}</h3>
                  <p>{task.relatedTo} · {task.relatedType} · Owner: {task.owner}</p>
                  {task.notes ? <span className="task-note">{task.notes}</span> : null}
                </div>
                <div className="task-meta">
                  {dueLabel(task)}
                  <em className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</em>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </main>
  );
}
