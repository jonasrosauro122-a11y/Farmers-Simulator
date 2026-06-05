import { useEffect, useRef, useState } from 'react';

// "How this works" info button. Click to open a small training hint popover.
export default function InfoTip({ text }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <span className="info-tip" ref={wrapRef}>
      <button type="button" className="info-tip-button" aria-label="How this works" onClick={() => setOpen((value) => !value)}>ⓘ</button>
      {open && <span className="info-tip-pop" role="tooltip">{text}</span>}
    </span>
  );
}
