export default function Panel({ title, icon, action, children, className = '' }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && (
        <div className="panel-header">
          <div className="panel-title-wrap">
            {icon && <span className="panel-icon">{icon}</span>}
            <h2>{title}</h2>
          </div>
          {action}
        </div>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}
