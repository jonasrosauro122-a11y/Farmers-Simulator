export function EmptyLightningGraphic({ variant = 'building' }) {
  if (variant === 'desert') {
    return (
      <svg className="sf-empty-svg sf-empty-desert" viewBox="0 0 460 210" role="img" aria-label="No recent reports illustration">
        <g fill="none" stroke="#9ed8ff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity=".95">
          <path d="M42 157h362M86 167h284" />
          <path d="M112 149c26-40 45-62 64-65 22-3 33 22 52 22 29 0 46-61 83-73" />
          <path d="M222 153h72l-35-44zM292 153h51l-25-30z" />
          <path d="M111 152V82c0-15 32-15 32 0v70" />
          <path d="M123 82v-38M106 58l17 14 17-14" />
          <path d="M72 134v-29c0-10 20-10 20 0v29M72 115l-13-13M92 113l14-13" />
          <path d="M174 132v-34c0-11 21-11 21 0v34M174 108l-14-13M195 107l15-14" />
          <circle cx="300" cy="62" r="44" />
          <circle cx="300" cy="62" r="25" />
          <path d="M339 44c8 10 10 24 5 37" />
          <path d="M214 90h74M243 70h95" />
          <path d="M232 70c7-17 34-17 41 0" />
          <path d="M163 100h47" />
        </g>
      </svg>
    );
  }

  return (
    <svg className="sf-empty-svg" viewBox="0 0 520 260" role="img" aria-label="Nothing to see here illustration">
      <g fill="none" stroke="#9ed8ff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity=".9">
        <path d="M95 206h354M122 222h265M401 222h22" />
        <path d="M147 195l31-124 35 124M174 152l39-64M182 122l32 73" />
        <path d="M214 96c0-19 15-34 34-34h84v76H214z" fill="#cdeaff" />
        <path d="M245 138h139v57H245z" fill="#cdeaff" />
        <path d="M245 138v57M295 138v57M384 138v57" />
        <path d="M332 138v29h47v-29" />
        <circle cx="258" cy="163" r="4" fill="#9ed8ff" />
        <circle cx="285" cy="163" r="4" fill="#9ed8ff" />
        <circle cx="313" cy="163" r="4" fill="#9ed8ff" />
        <circle cx="367" cy="163" r="4" fill="#9ed8ff" />
        <circle cx="258" cy="190" r="4" fill="#9ed8ff" />
        <circle cx="285" cy="190" r="4" fill="#9ed8ff" />
        <circle cx="367" cy="190" r="4" fill="#9ed8ff" />
        <circle cx="351" cy="158" r="6" fill="#9ed8ff" />
        <path d="M395 139l51-38 48 46" />
        <path d="M404 128l-19-14-14 12" />
        <path d="M429 96c15-24 47-24 63 0" />
        <path d="M158 86h54M179 68h90M199 48h41" />
        <path d="M186 68c0-20-29-26-41-10-4 5-6 11-6 17" />
        <path d="M275 50h118" />
        <path d="M321 34h77" />
        <path d="M338 34c0-21 29-31 43-14 16-4 31 9 31 25 14 0 25 11 25 25H299" />
        <path d="M447 53c14 5 23 17 24 32" />
        <path d="M471 102c6-8 17-10 25-4" />
        <path d="M53 198c12-18 30-18 42 0 13-12 31-9 39 5" fill="#cdeaff" />
        <path d="M460 194c19-24 49-18 60 10" fill="#cdeaff" />
      </g>
    </svg>
  );
}

export function SfObjectIcon({ children = '★', tone = 'green' }) {
  return <span className={`sf-object-icon ${tone}`}>{children}</span>;
}

export function SfButton({ children, onClick, primary = false, disabled = false }) {
  return <button className={`sf-button ${primary ? 'primary' : ''}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function SfIconButton({ children, title, onClick, disabled = false }) {
  return <button className="sf-icon-button" title={title} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function SfListHeader({ objectName, title = 'Recently Viewed', icon, iconTone = 'green', itemCount = 0, updatedText = 'Updated a few seconds ago', children }) {
  return (
    <header className="sf-list-header">
      <div className="sf-list-title-block">
        <SfObjectIcon tone={iconTone}>{icon}</SfObjectIcon>
        <div>
          <span className="sf-object-label">{objectName}</span>
          <div className="sf-view-title-row">
            <h1>{title}</h1>
            <button className="sf-view-caret" title="Switch list view">⌄</button>
            <button className="sf-pin" title="Pin list view">⚑</button>
          </div>
        </div>
      </div>
      <div className="sf-header-actions">{children}</div>
      <p className="sf-list-meta">{itemCount} item{itemCount === 1 ? '' : 's'} • {updatedText}</p>
    </header>
  );
}

export function SfListToolbar({ search, onSearch, placeholder = 'Search this list...', onRefresh }) {
  return (
    <div className="sf-list-toolbar">
      <div className="sf-list-search">
        <span>⌕</span>
        <input value={search} onChange={(event) => onSearch?.(event.target.value)} placeholder={placeholder} />
      </div>
      <SfIconButton title="List view controls">⚙⌄</SfIconButton>
      <SfIconButton title="Display as table">▦⌄</SfIconButton>
      <SfIconButton title="Refresh" onClick={onRefresh}>⟳</SfIconButton>
      <SfIconButton title="Sort">↕</SfIconButton>
      <SfIconButton title="Inline edit">✎</SfIconButton>
      <SfIconButton title="Chart" disabled>◔</SfIconButton>
      <SfIconButton title="Filter" disabled>▾</SfIconButton>
    </div>
  );
}

export function SfEmptyState({ title = 'Nothing to see here', text = "There's nothing in your list yet. Try adding a new record.", variant = 'building' }) {
  return (
    <div className="sf-empty-state">
      <EmptyLightningGraphic variant={variant} />
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
