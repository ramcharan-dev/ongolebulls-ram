import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeydown = (event) => {
      if (event.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="ap-modal-backdrop">
      <div className="ap-modal ap-modal-sm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="ap-modal-header">
          <h3 id="confirm-title">{title}</h3>
        </div>
        <div className="ap-modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: '#b45309' }}>
            <AlertTriangle size={18} />
            <strong>Confirm Action</strong>
          </div>
          <p style={{ margin: 0, color: '#475569', fontSize: 13, lineHeight: 1.5 }}>{message}</p>
        </div>
        <div className="ap-modal-footer">
          <button type="button" className="ap-btn ap-btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
          <button type="button" className="ap-btn ap-btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
