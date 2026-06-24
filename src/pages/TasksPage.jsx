import { useMemo, useState } from 'react';

export default function TasksPage({ tasks, user, initialView = '', onUpdateTask, onNewTask }) {
  const [search, setSearch] = useState('');
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = initialView === 'today'
      ? tasks.filter((task) => task.status !== 'Completed')
      : tasks;
    if (!term) return list;
    return list.filter((task) => `${task.title} ${task.relatedTo} ${task.owner}`.toLowerCase().includes(term));
  }, [tasks, search, initialView]);

  return (
    <main className="sf-pattern-page sf-tasks-page">
      <section className="sf-task-list-card">
        <header className="sf-task-card-header">
          <span className="sf-object-icon green">▤</span>
          <div>
            <h1>Recently Viewed <button>⌄</button></h1>
            <p>{visible.length} item{visible.length === 1 ? '' : 's'} • Updated a few seconds ago</p>
          </div>
          <button className="sf-pin task-pin">⚑</button>
          <button className="sf-task-menu" onClick={onNewTask}>▾</button>
        </header>

        <div className="sf-task-actions">
          <button title="Display options">▦⌄</button>
          <button title="Refresh">⟳</button>
        </div>

        <label className="sf-task-search">
          <span>⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this list..." />
        </label>

        <table className="sf-task-mini-table">
          <thead>
            <tr>
              <th><input type="checkbox" aria-label="Select all tasks" /></th>
              <th>Recently Viewed <span>↓</span></th>
              <th>i</th>
            </tr>
          </thead>
        </table>

        {visible.length === 0 ? (
          <div className="sf-task-empty">
            <p>You haven't viewed any Tasks recently.<br />Try switching list views.</p>
          </div>
        ) : (
          <div className="sf-task-recent-list">
            {visible.map((task) => (
              <label key={task.id} className="sf-task-recent-row">
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={(event) => onUpdateTask(task.id, { status: event.target.checked ? 'Completed' : 'Open' })}
                />
                <span>
                  <strong>{task.title}</strong>
                  <em>{task.relatedTo} · Owner: {task.owner || user.name}</em>
                </span>
              </label>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
