import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';

export default function CustomHomePage({ widgetLayout, onChange, onReset, onNavigate }) {
  const toggle = (key) => onChange(widgetLayout.map((w) => (w.key === key ? { ...w, visible: !w.visible } : w)));

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= widgetLayout.length) return;
    const next = [...widgetLayout];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const visibleCount = widgetLayout.filter((w) => w.visible).length;

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Custom Home Page</p>
          <h1>Customize Dashboard Widgets <InfoTip text="Toggle which cards appear on the Home dashboard and use the arrows to reorder them. Changes save automatically to this browser." /></h1>
          <span>{visibleCount} of {widgetLayout.length} widgets visible. Settings save automatically.</span>
        </div>
        <div className="button-row">
          <button className="outline-button" onClick={onReset}>Reset Default Layout</button>
          <button className="primary-button" onClick={() => onNavigate('home')}>View Home</button>
        </div>
      </div>

      <Panel title="Widgets & Order" icon="⚙️">
        <div className="settings-grid">
          {widgetLayout.map((widget, index) => (
            <div className="toggle-row" key={widget.key}>
              <div className="reorder-buttons">
                <button className="outline-button compact" onClick={() => move(index, -1)} disabled={index === 0} title="Move up">↑</button>
                <button className="outline-button compact" onClick={() => move(index, 1)} disabled={index === widgetLayout.length - 1} title="Move down">↓</button>
              </div>
              <span>
                <strong>{index + 1}. {widget.label}</strong>
                <small>{widget.visible ? 'Shown on the home dashboard' : 'Hidden from the home dashboard'}</small>
              </span>
              <input type="checkbox" checked={widget.visible} onChange={() => toggle(widget.key)} />
            </div>
          ))}
        </div>
      </Panel>
    </main>
  );
}
