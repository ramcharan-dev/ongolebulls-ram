const ErrorMessage = ({ message, onRetry }) => (
  <div style={{
    background: '#fef2f2', border: '1px solid #fca5a5',
    borderRadius: 8, padding: '1rem 1.25rem',
    color: '#b91c1c', display: 'flex',
    alignItems: 'center', gap: '0.75rem',
  }}>
    <span style={{ fontSize: 18 }}>⚠️</span>
    <span style={{ flex: 1, fontSize: 14 }}>{message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          background: '#b91c1c', color: '#fff',
          border: 'none', borderRadius: 6,
          padding: '4px 12px', cursor: 'pointer', fontSize: 13,
        }}
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorMessage;
