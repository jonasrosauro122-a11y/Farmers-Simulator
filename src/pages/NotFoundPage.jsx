import Panel from '../components/Panel.jsx';

export default function NotFoundPage({ onNavigate }) {
  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Page not found</p>
          <h1>This route isn’t part of the simulator</h1>
          <span>The page you tried to open doesn’t exist. Use the navigation above or jump back to your dashboard.</span>
        </div>
      </div>
      <Panel>
        <div className="placeholder-workspace-card">
          <h2>Let’s get you back on track</h2>
          <p>Every training page is reachable from the top navigation bar.</p>
          <div className="button-row">
            <button className="primary-button" onClick={() => onNavigate('home')}>Back to Dashboard</button>
            <button className="outline-button" onClick={() => onNavigate('training')}>Open Training Center</button>
          </div>
        </div>
      </Panel>
    </main>
  );
}
