import './AppToast.css';

export default function AppToast({ toast, className = '' }) {
  if (!toast?.message) return null;

  const toneClass = toast.type === 'error' ? 'app-toast-error' : 'app-toast-success';

  return (
    <div className={`app-toast-viewport ${className}`.trim()} aria-live="polite" aria-atomic="true">
      <div className={`app-toast ${toneClass}`} role="status">
        <span className="app-toast-dot" aria-hidden="true" />
        <span className="app-toast-message">{toast.message}</span>
      </div>
    </div>
  );
}
