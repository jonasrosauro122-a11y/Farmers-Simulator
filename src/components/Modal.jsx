export default function Modal({ title, children, onClose, size = 'medium' }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className={`modal modal-${size}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
