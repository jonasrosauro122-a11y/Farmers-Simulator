import { useMemo, useState } from 'react';

const layouts = [
  { id: '2', label: '2 Cols', bars: [1, 1] },
  { id: '3', label: '3 Cols', bars: [1, 1, 1] },
  { id: '4', label: '4 Cols', bars: [1, 1, 1, 1] },
  { id: '2-wide-left', label: '2 Cols: Wide Left', bars: [2, 1] },
  { id: '2-wide-right', label: '2 Cols: Wide Right', bars: [1, 2] },
  { id: '3-wide-left', label: '3 Cols: Wide Left', bars: [2, 1, 1] },
  { id: '3-wide-center', label: '3 Cols: Wide Center', bars: [1, 2, 1] },
  { id: '3-wide-right', label: '3 Cols: Wide Right', bars: [1, 1, 2] }
];

const availableWidgets = [
  ['Sales & Marketing Notifications', 'orange'], ['Service Alerts & Notifications', 'red'], ['Tasks - Due Today', 'green'], ['Helpful Links *', 'blue'], ['Product Platforms', 'lime'], ['Recommendation Engine', 'orange'],
  ['Prime Segment *', 'purple active'], ['Agency News & Resources / ANR *', 'indigo active'], ['New To APEX', 'indigo'], ['Recent Items', 'green'], ['Sticky Note', 'yellow'], ['Average Policy Premium', 'blue'],
  ['Quote-to-Bind Ratio', 'lime'], ['Activities', 'green'], ['New Alerts Today', 'red'], ['Alerts Due Today', 'red'], ['New Alerts Today: Critical & Pending', 'red'], ['Alerts Due Today: Critical & Pending', 'red'],
  ['New Alerts Today: Renewal', 'red'], ['New Alerts Today: Claims', 'red'], ['Reporting Hub Search', 'gray'], ['Report Hub Recent Items', 'orange'], ['Staff Activity', 'blue'], ['Upcoming Birthdays', 'pink'],
  ['Reports Hub', 'orange'], ['Unbound Quotes', 'green'], ['Open Service Requests', 'blue']
];

function LayoutCard({ layout, active, onClick }) {
  const max = Math.max(...layout.bars);
  return (
    <button className={`sf-layout-card ${active ? 'active' : ''}`} onClick={onClick}>
      <strong>{layout.label}</strong>
      <span>{layout.bars.map((bar, idx) => <i key={idx} style={{ flex: bar / max }} />)}</span>
    </button>
  );
}

export default function CustomHomePage({ widgetLayout, onChange, onReset, onNavigate }) {
  const [layout, setLayout] = useState('2');
  const [showHeader, setShowHeader] = useState(false);
  const [dirty, setDirty] = useState(false);

  const visibleWidgets = useMemo(() => widgetLayout.filter((widget) => widget.visible), [widgetLayout]);

  const toggleWidget = (label) => {
    const match = widgetLayout.find((widget) => widget.label === label || label.includes(widget.label));
    if (!match) return;
    onChange(widgetLayout.map((widget) => widget.key === match.key ? { ...widget, visible: !widget.visible } : widget));
    setDirty(true);
  };

  const restore = () => { onReset(); setDirty(true); };

  return (
    <main className="sf-pattern-page sf-custom-home-page">
      <header className="sf-builder-title">
        <span className="sf-object-icon blue">☷</span>
        <h1>Custom Home Page</h1>
      </header>

      <section className="sf-builder-section">
        <h2>Layout and Header</h2>
        <p>Set how many columns should be on your homepage</p>
        <div className="sf-layout-grid">
          {layouts.map((item) => <LayoutCard key={item.id} layout={item} active={layout === item.id} onClick={() => { setLayout(item.id); setDirty(true); }} />)}
        </div>
        <label className="sf-builder-checkbox"><input type="checkbox" checked={showHeader} onChange={(e) => { setShowHeader(e.target.checked); setDirty(true); }} /> Header (spans across all columns)</label>
      </section>

      <section className="sf-builder-section">
        <h2>Available Widgets</h2>
        <p>Drag and drop widgets to the added widgets section below to be added to your homepage.</p>
        <div className="sf-widget-palette">
          {availableWidgets.map(([label, tone]) => (
            <button key={label} className={`sf-widget-chip ${tone}`} onClick={() => toggleWidget(label)}>
              <span>{tone.includes('orange') ? '▣' : tone.includes('red') ? '📣' : tone.includes('green') ? '▤' : tone.includes('blue') ? '🔗' : tone.includes('purple') ? '▦' : tone.includes('pink') ? '🎂' : '▢'}</span>
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="sf-builder-section sf-added-widget-section">
        <header>
          <div>
            <h2>Added Widgets</h2>
            <p>Drag widgets to desired location below and once completed save changes to update your homepage.</p>
          </div>
          <div className="sf-builder-actions">
            <button onClick={restore}>Restore Default Home Page</button>
            <button className="primary" disabled={!dirty} onClick={() => { setDirty(false); onNavigate('home'); }}>Apply Changes</button>
          </div>
        </header>

        <div className="sf-added-columns">
          <div>
            {visibleWidgets.slice(0, Math.ceil(visibleWidgets.length / 2)).map((widget) => <div className="sf-added-widget-card" key={widget.key}><strong>{widget.label}</strong><span>Visible on dashboard</span></div>)}
          </div>
          <div>
            {visibleWidgets.slice(Math.ceil(visibleWidgets.length / 2)).map((widget) => <div className="sf-added-widget-card" key={widget.key}><strong>{widget.label}</strong><span>Visible on dashboard</span></div>)}
          </div>
        </div>
      </section>
    </main>
  );
}
